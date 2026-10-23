# 参与贡献

感谢参与 DSH Super Nexusx。缺陷和建议请提交至 [Issues](https://github.com/biek12/dsh-super-nexusx/issues)。较大的改动请先描述场景和方案，避免重复工作。

## 开发流程

1. Fork 仓库，从 `master` 创建功能分支。
2. 使用 Node.js 22.19+ 和 npm，运行 `npm ci`。
3. 修改源码。保持现有风格、两空格缩进和模块边界；避免把生成文件、个人路径或安装日志加入仓库。
4. 运行 `npm run check`、`npm test`、`npm run build`、`npm run pack:plugin`。
5. 涉及桌面宠物时，在 macOS 运行 `npm run build:desktop`，并实测窗口拖动、退出清理和屏幕边缘布局。
6. 提交 Pull Request，说明问题、改动、验证结果和已知限制。

## 代码约束

- `src/` 是插件实现，`desktop/` 是 macOS 伴随窗口，`vendor/` 是固定版本上游依赖。
- ESLint 检查自有 JS/JSX；第三方适配代码保留来源与原有风格，更新时同步许可。
- 涉及 HTTP、持久化、生命周期或兼容性修复，应增加能复现问题的测试。
- 保留 `liquid_glass` 存储领域及旧偏好键；更名时不要清空已有分类与宠物位置。
- 不直接修改宿主安装包、会话正文、模型请求或其他插件的数据。
- `lib/`、`artifacts/`、`releases/` 是生成目录；npm 包由构建产生，GitHub 仓库保存源码。

## 本机验证

见 [开发说明](docs/DEVELOPMENT.md)。自动检查不能替代真实 DSH 交互验收。提交说明应区分已验证行为、尚未测试的平台与规划能力。

提交代码即表示同意以本项目 MIT 许可证分发；引入第三方代码时必须保留其原始许可和归属。
