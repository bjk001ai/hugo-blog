const fs = require('fs');
const path = require('path');

const targetDir = path.join('d:/workspaces/hugo-blog', 'content', 'posts');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function createPost(title, category, content, date) {
  let slug = title.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!slug) slug = 'post-' + Date.now() + Math.floor(Math.random() * 1000);
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
  const filePath = path.join(targetDir, slug + '.md');
  // 중복 slug 처리
  const finalPath = fs.existsSync(filePath)
    ? path.join(targetDir, slug + '-' + Date.now() + '.md')
    : filePath;
  fs.writeFileSync(finalPath, fm, 'utf8');
}

/**
 * neon-blog seed 파일에서 배열을 직접 파싱
 * seed 파일은 template literal을 쓰므로 eval()로 처리
 */
function parseSeedArray(filePath, varName) {
  const code = fs.readFileSync(filePath, 'utf8');
  const varStart = code.indexOf('const ' + varName);
  if (varStart === -1) { console.warn('변수를 찾을 수 없음:', varName); return []; }
  const arrStart = code.indexOf('[', varStart);

  // 중첩 괄호 추적으로 배열 끝 찾기
  let depth = 0;
  let inStr = false;
  let strChar = '';
  let i = arrStart;
  for (; i < code.length; i++) {
    const c = code[i];
    if (inStr) {
      if (c === '\\') { i++; continue; } // 이스케이프 건너뜀
      if (c === strChar) inStr = false;
    } else {
      if (c === '`' || c === '"' || c === "'") { inStr = true; strChar = c; }
      else if (c === '[') depth++;
      else if (c === ']') {
        depth--;
        if (depth === 0) break;
      }
    }
  }

  const arrayStr = code.substring(arrStart, i + 1);
  try {
    return eval('(' + arrayStr + ')');
  } catch (e) {
    console.error('배열 파싱 오류 (' + varName + '):', e.message.substring(0, 100));
    return [];
  }
}

// neon-blog extraPosts
const extraPosts = parseSeedArray(
  'd:/workspaces/neon-blog/src/db/seed-extra-posts.ts',
  'extraPosts'
);
console.log('extraPosts:', extraPosts.length);
extraPosts.forEach((p, i) =>
  createPost(p.title, p.category, p.content, new Date(Date.now() - i * 2000000))
);

// neon-blog studyPosts
const studyPosts = parseSeedArray(
  'd:/workspaces/neon-blog/src/db/seed-study.ts',
  'studyPosts'
);
console.log('studyPosts:', studyPosts.length);
studyPosts.forEach((p, i) =>
  createPost(p.title, p.category, p.content, new Date(Date.now() - i * 2000000 - 86400000))
);

console.log('neon-blog 마이그레이션 완료');
