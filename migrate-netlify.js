const fs = require('fs');
const path = require('path');

const targetDir = path.join('d:/workspaces/hugo-blog', 'content', 'posts');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function createPost(title, category, content, date) {
  let slug = title.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!slug) slug = 'post-' + Math.floor(Math.random() * 100000);
  const fm = [
    '---',
    'title: "' + title.replace(/"/g, '\\"') + '"',
    'date: ' + date.toISOString(),
    'draft: false',
    'categories: ["' + category + '"]',
    '---',
    '',
    content,
    ''
  ].join('\n');
  fs.writeFileSync(path.join(targetDir, slug + '.md'), fm, 'utf8');
}

const src = fs.readFileSync('d:/workspaces/netlify-blog/src/db/seed-100.ts', 'utf8');

// 각 코드 블록 인덱스 추출
const subjStart = src.indexOf('const subjects = [');
const subjEnd = src.indexOf('];', subjStart) + 2;
const verbsStart = src.indexOf('const verbs = [');
const verbsEnd = src.indexOf('];', verbsStart) + 2;
const techStart = src.indexOf('const techTopics = [');
const techEnd = src.indexOf('];', techStart) + 2;
const fnStart = src.indexOf('function generatePostContent');
const fnEnd = src.indexOf('async function main');

// TypeScript 타입 어노테이션 제거
function stripTs(code) {
  return code
    .replace(/: string\[\]/g, '')
    .replace(/: string/g, '')
    .replace(/: number/g, '');
}

const subjectsCode  = stripTs(src.substring(subjStart, subjEnd)).replace('const subjects = ', '');
const verbsCode     = stripTs(src.substring(verbsStart, verbsEnd)).replace('const verbs = ', '');
const techCode      = stripTs(src.substring(techStart, techEnd)).replace('const techTopics = ', '');
const fnCode        = stripTs(src.substring(fnStart, fnEnd));

// eval 코드 조립
const evalBody = [
  'const subjects = ' + subjectsCode,
  'const verbs = ' + verbsCode,
  'const techTopics = ' + techCode,
  fnCode,
  'const posts = [];',
  'for (let i = 1; i <= 100; i++) {',
  '  const base = subjects[i % subjects.length];',
  '  let title = base.title + " (제 " + Math.ceil(i / 10) + "권)";',
  '  if (i > 30) {',
  '    const verb = verbs[i % verbs.length];',
  '    const topic = techTopics[i % techTopics.length];',
  '    title = "실무 관점의 " + topic + " " + verb + " (#" + i + ")";',
  '  }',
  '  posts.push({ title: title, category: base.category, content: generatePostContent(i, title, i) });',
  '}',
  'return posts;'
].join('\n');

let netlify100 = [];
try {
  const fn = new Function(evalBody);
  netlify100 = fn();
  console.log('추출 성공, 포스트 수:', netlify100.length);
} catch (e) {
  console.error('eval 오류:', e.message.substring(0, 300));
  process.exit(1);
}

netlify100.forEach((p, i) => {
  createPost(p.title, p.category, p.content, new Date(Date.now() - i * 10000000));
});

console.log('netlify-blog 100개 포스트 마이그레이션 완료');
