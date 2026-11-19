# Mushroom Lab

Explore Mathematics Differently.

`npm ci` 安装依赖，`npm run dev` 启动预览，`npm test` 验证题库和评分，`npm run build` 生成静态站点。

- docs/ 保存总规划、路线图及设计规范。
- src/content/ 保存题库、词典与课程内容。
- src/ 保存页面、样式与浏览器端评分。
- .github/workflows/ 保存 GitHub Pages 构建和部署流程。

在 GitHub 仓库 Settings → Pages 选择 GitHub Actions 后，可从 Actions 手动运行部署。推送 main 也会触发流程。发布后按路线图完成大陆网络验收。

题库以考纲版本、课程、组件、章节、主题和技能分类。新增题目使用稳定 ID。评分单位为平台练习任务。更改既有答案后递增练习版本，避免旧记录混用。样板数值输入支持整数、小数和分数。分步练习提供完整过程解析。

