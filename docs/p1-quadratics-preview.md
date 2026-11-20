# Quadratics 基础练习预览交付记录

## 开工基线

- 本地原工作目录启动于 `main`，HEAD `add5c0f89bbf8ec94f0a0fdaea75f90bfff9dcd0`，未配置远端。
- GitHub `wbw07007-spec/mushroom-lab` 的 `main` 为 `24b51d3348002b09b4dd51ece6627f8d4b37d48f`。同一 SHA 为本轮开始时最近一次成功的 Pages 部署。[部署记录](https://github.com/wbw07007-spec/mushroom-lab/actions/runs/44664753991)
- 独立克隆从该 GitHub SHA 建立 `quadratics-foundation-preview` 分支。根目录、上一级项目目录及预览克隆内未找到 `AGENTS.md`。
- 已读项目 `docs/master-plan.txt` 中 V1.0 的课程层级、练习、过程评分、查词、存储和阶段验收；核对基线 Practice、Teacher Editor、本地进度和判分实现。

### 原工作目录已有未提交改动

本次编辑均发生在独立克隆。开工时原目录的变更清单如下。

```text
M .github/workflows/pages.yml
M package-lock.json
M package.json
M src/TeacherEditor.tsx
M src/content/questions.ts
M src/grading.test.mjs
M src/main.tsx
M src/styles.css
?? ML-branded-notes/
?? P3-graph-revision/
?? P3-handwritten-revision/
?? P3-public-revision/
?? P3-remake-content.md
?? docs/p1-companion-question-map.csv
?? docs/p1-past-paper-inventory.csv
?? docs/p1-source-inventory.csv
?? mushroom-logo-original.png
?? mushroom-logo-v1.png
?? public/
?? src/ChordOfContactDiagram.tsx
?? src/PastPaperBank.tsx
?? src/ResourceLibrary.tsx
?? src/SignGraph.tsx
?? src/content/applications-practice.ts
?? src/content/circular-practice.ts
?? src/content/coordinate-geometry.ts
?? src/content/differentiation-practice.ts
?? src/content/function-notes.ts
?? src/content/functions-companions.ts
?? src/content/integration-practice.ts
?? src/content/p1-past-papers.json
?? src/content/p1-resources.json
?? src/content/practice-set.ts
?? src/content/practice-topics.ts
?? src/content/quadratics.ts
?? src/content/series-practice.ts
?? src/content/trig-practice.ts
?? src/teacher-drafts.test.mjs
?? src/teacher-drafts.ts
```

## 变更文件

| 文件 | 内容 |
|---|---|
| `src/main.tsx` | 首页／第一章／技能入口，复用现有答题与查词实现，显示作答方式 |
| `src/content/quadratics-foundation.ts` | 第一组 4 道填空及每题的分步解析、一般提示、典型错答提示 |
| `src/attempt-history.ts` | 按任务保存有效尝试、首次结果、答对前帮助与完成状态 |
| `src/content/questions.ts` | 增加 standard form、constant 和 subtract 的中文释义 |
| `src/styles.css` | 技能入口、窄屏练习布局和作答状态 |
| `src/attempt-history.test.mjs` | 作答方式、解析跨刷新、四题独立核算和无效输入测试 |
| `docs/p1-quadratics-skill-map.md` | 已读资料、技能对照及题目与答案 |
| `docs/p1-quadratics-preview.md` | 本交付记录 |

新增作答证据使用各任务独立存储键。现有页面地址、原有题目 ID、原完成记录和教师草稿存储键延续原实现。答错时展示自行订正和看提示；翻看完整解析与数学提示均在打开时立即记录。查词不写入作答存储。原完成记录若无作答证据，显示“已完成，作答方式未知”。

## 验证结果

- Windows、Node.js 24.22.0、仓库锁定依赖及 Vite 7.1.12。生产构建通过。构建器提示现有主包超过 500 kB。
- `node --test src/grading.test.mjs src/teacher-drafts.test.mjs src/attempt-history.test.mjs`，9 项通过。
- Windows Codex 内置浏览器，从首页进入第一章、进入技能、开始练习，实测四道题分别覆盖首次独立答对、独立订正、看提示后答对、看解析后刷新再答对。空白和格式错误未添加有效次数。查词后仍判首次独立答对。重复提交同一道题完成数保持 1/4。第四题接受 −1.75，单测也验证 −7/4 和 −14/8。
- 桌面内容视口 1265 px，手机宽度模拟设置 390 × 844，扣除滚动条后内容视口 375 px。题干公式、输入和按钮可用，页面无水平溢出，查词弹窗在可视范围内，中英界面及中文作答结果可切换。
- 手机真机、中国大陆校园网未实测。正式 Pages 发布等待确认。
