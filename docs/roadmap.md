# Mushroom Lab V1.0

长期依据见 [项目总规划](master-plan.txt)。将网站基础和练习样板安排为两个开发阶段，共同构成首个可试用版本。

| 阶段 | 交付 | 验收 |
| --- | --- | --- |
| 1 网站基础 | 首页、课程、资源库、学术主页、练习入口及中英切换 | 导航可直接链接和刷新，手机布局可用 |
| 2 P1 样板 | 原创 Functions & Transformations 练习、解析、查词和本地进度 | 完成单选、多选、数学输入和综合步骤，刷新后可继续 |
| 3 教师编辑器 | 按现有题库结构创建、预览、验证、导出 | 教师可独立完成一题的编辑流程 |
| 4 扩充题库 | P1 优先，随后 P3、M1、S1、0580、9231 | 内容经教师复核，考纲版本可追溯 |
| 5 学生门户 | 登录、班级、作业、记录、权限 | 验证学生和教师的数据隔离 |
| 6 高级功能 | 自适应、词汇分析和选配 AI | 验证教学收益、部署和维护成本 |

公开试用验收还包括 GitHub Pages 实际发布和中国大陆不同设备与网络实测。记录首屏、练习入口、加载失败和复访体验。

## 技术选择

React、TypeScript 和 Vite 提供可维护的组件和静态构建。现阶段用 CSS 变量维护设计规范，便于在界面稳定后评估 Tailwind 的收益。静态部署降低运维负担，匿名记录保存在当前浏览器。公开样板的答案随构建发布。正式考试和有权限要求的数据需要另行设计服务端。

- [KaTeX](https://github.com/KaTeX/KaTeX) 用于本地公式渲染，字体随构建交付。
- [MathLive](https://github.com/arnog/mathlive) 待评估移动端键盘、输入可访问性及本地资源体积。
- [Numbas](https://docs.numbas.org.uk/en/latest/licensing.html) 为 Apache-2.0。下一步用同一道分步题对比其运行时、导出包和教师编辑成本。
- [STACK](https://github.com/maths/moodle-qtype_stack) 和 [SymPy](https://github.com/sympy/sympy) 待评估部署复杂度、定义域与表达式等价语义。
- [JSXGraph](https://github.com/jsxgraph/jsxgraph) 待用一个函数参数实验验证触屏交互。
- Step-Wise 在确定具体仓库后核查许可证和维护状态。

引入候选前确认许可证、固定版本、兼容性和回滚方式。重要变更在 docs 中记录采用理由及长期维护成本。

