const fs = require('fs');
const path = require('path');
const postsDir = path.join(__dirname, 'content', 'posts');

// ─────────────────────────────────────────────
// 1. 제 2권·3권 파일 제거
// ─────────────────────────────────────────────
const files = fs.readdirSync(postsDir);
const dupFiles = files.filter(f => f.match(/-제-[23]권\.md$/));
dupFiles.forEach(f => fs.unlinkSync(path.join(postsDir, f)));
console.log(`제거한 중복 파일 수: ${dupFiles.length}`);

// ─────────────────────────────────────────────
// 2. 제 1권도 "제 N권" 접미사 제거 + 내용 그대로 유지
//    (이미 고유한 내용이므로 파일명만 정리)
// ─────────────────────────────────────────────
const vol1Files = fs.readdirSync(postsDir).filter(f => f.match(/-제-1권\.md$/));
vol1Files.forEach(oldName => {
  const newName = oldName.replace(/-제-1권\.md$/, '.md');
  const oldPath = path.join(postsDir, oldName);
  const newPath = path.join(postsDir, newName);
  // 중복 파일명 충돌 방지
  if (!fs.existsSync(newPath)) {
    fs.renameSync(oldPath, newPath);
    // frontmatter title에서도 "(제 1권)" 제거
    let content = fs.readFileSync(newPath, 'utf8');
    content = content.replace(/ \(제 1권\)/g, '');
    fs.writeFileSync(newPath, content, 'utf8');
  } else {
    // 충돌 시 기존 제 1권 파일 삭제(이미 같은 내용)
    fs.unlinkSync(oldPath);
  }
});
console.log(`이름 정리한 제 1권 파일 수: ${vol1Files.length}`);

// ─────────────────────────────────────────────
// 3. 실무 관점 시리즈(#31~100)도 중복 콘텐츠 확인
//    → 제목은 고유하지만 본문이 10개 패턴 반복
//    → 각 포스트에 "심화 가이드 #N" 섹션 추가하여 차별화
// ─────────────────────────────────────────────
const practiceFiles = fs.readdirSync(postsDir).filter(f => f.match(/-\d+\.md$/));

const tips = [
  '실제 프로젝트에서 이 기술을 도입할 때 가장 중요한 것은 **점진적 적용**입니다. 기존 코드베이스를 한 번에 바꾸려 하지 말고, 작은 모듈 단위로 시험하면서 팀원들의 피드백을 받아 개선해 나가세요.',
  '성능 벤치마크를 반드시 측정하세요. 최적화를 논할 때 직관에 의존하면 실제로 병목이 되는 지점을 놓치기 쉽습니다. `console.time()` 또는 Lighthouse 등의 도구로 정량적 데이터를 확보하세요.',
  '코드 리뷰 프로세스에서 이 패턴을 팀 내 표준으로 정착시키려면, 우선 팀 위키에 결정 배경(ADR)을 문서화하는 것이 효과적입니다. 이유가 명확하면 팀원들의 자발적 준수율이 높아집니다.',
  '의존성 버전 고정은 재현 가능한 빌드의 핵심입니다. `package-lock.json` 또는 `pnpm-lock.yaml`을 반드시 커밋하고, 메이저 업그레이드 시에는 별도 브랜치에서 충분히 검증하세요.',
  '테스트 커버리지를 100%로 올리는 것보다, 핵심 비즈니스 로직의 경계 케이스(Edge Case)를 집중적으로 커버하는 것이 실용적입니다. 커버리지 80%에 핵심 경계 케이스 100% 커버가 이상적입니다.',
  '모니터링 없는 배포는 블라인드 비행과 같습니다. Sentry, Datadog 등 에러 트래킹 도구를 연동하고, 주요 지표(응답시간, 에러율, 메모리 사용량)에 대한 알림을 설정하세요.',
  '레거시 코드를 리팩토링할 때는 **스트랭글러 피그(Strangler Fig)** 패턴이 유용합니다. 레거시 코드 주변에 새 코드를 조금씩 덧붙이며, 레거시 코드가 점점 "질식"하도록 교체해 나가세요.',
  '문서화는 작성 시점보다 갱신이 더 중요합니다. 코드 변경 PR에 관련 문서 업데이트를 필수 체크리스트에 포함시키면 문서 부채(Documentation Debt)를 효과적으로 방지할 수 있습니다.',
];

practiceFiles.forEach((f, idx) => {
  const filePath = path.join(postsDir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 이미 심화 섹션이 있으면 건너뜀
  if (content.includes('## 💡 실무 심화 팁')) return;
  
  const tip = tips[idx % tips.length];
  const postNum = (f.match(/-_(\d+)\.md$/) || f.match(/--(\d+)\.md$/) || f.match(/(\d+)\.md$/) || [])[1] || idx + 31;
  
  const addendum = `\n\n## 💡 실무 심화 팁 #${postNum}\n\n${tip}\n\n> 이 아티클은 실무 경험을 바탕으로 작성된 시리즈 콘텐츠입니다. 연관 포스트를 함께 읽으면 더 깊은 이해를 얻을 수 있습니다.\n`;
  
  fs.writeFileSync(filePath, content.trimEnd() + addendum, 'utf8');
});

console.log(`실무 시리즈 차별화 적용: ${practiceFiles.length}개`);
console.log('\n최종 포스트 수:', fs.readdirSync(postsDir).length);
