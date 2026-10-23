# 开发与构建

## 目录

| 路径 | 内容 |
| --- | --- |
| `src/` | Host、客户端、目录、主题、上下文适配与宠物 |
| `desktop/` | macOS AppKit / WebKit 伴随窗口 |
| `assets/pets/` | 运行时角色素材 |
| `vendor/dsh-context/` | 固定在 0.74.0 的上游源码与发布 bundle |
| `licenses/` | 第三方完整许可 |
| `tests/` | 数据、HTTP、生命周期和 UI 回归测试 |
| `preview/` | 本机交互预览 |
| `scripts/` | 构建、静态检查、打包和本机验证 |
| `.github/` | CI 与问题模板 |

## 常用命令

```bash
npm ci
npm run check
npm test
npm run build
npm run pack:plugin
```

通用构建不读取本机 DSH 安装包，不依赖 Python 或 Swift。`prepack` 自动构建 JS；打包前可运行 `npm run build:desktop` 加入当前 macOS 架构的伴随程序。未包含该程序的平台仍可使用窗口内宠物。

`vendor/dsh-context/lib/` 是固定上游发布产物，参与 Host 和客户端构建，必须随源码保留；其来源和 tarball 哈希见 `UPSTREAM.json`。`src/vendor/context-client.cjs` 由构建脚本生成，不手工编辑。其余 `src/vendor/` 文件是经适配的上游实现。相关许可证见 `THIRD_PARTY_NOTICES.md`。

## 真实宿主验证与预览

```bash
npm run build:preview
npm run preview
npm run test:installed
npm run test:bundle  # 先生成 releases/ 中的当前版本 tgz
```

这两类验证需要本机安装 DSH。默认读取 macOS 的 `/Applications/DSH Desktop Beta.app/Contents/Resources/app/node_modules/@deepseek-ai`，其他位置可设置 `DSH_MODULE_ROOT`。预览生成的宿主 CSS 位于忽略的 `artifacts/` 中，不随插件分发。`test:installed` 使用临时存储，不改活动 Profile。`test:bundle` 解压真实 tgz，在临时 Profile 中调用宿主原始 `listBundles()`，验证文件入口不可见、包登记后可见，以及版本、翻译和 patch 行。

`npm run build:desktop` 需要 macOS 与 Xcode Command Line Tools。生成的可执行文件只适用于构建机器的架构；发布时应标明架构，不应把它描述为跨平台二进制。

## 兼容标识

公开包名与加载 ID 为 `dsh-super-nexusx`。`liquid_glass` 领域、`/plugins/dsh-liquid-glass/` 兼容路由、`lg-` 样式前缀、偏好键和 macOS UserDefaults 标识沿用历史值，避免升级丢失数据。它们不是遗漏更名的目录。Liquid Glass 是工作台中的主题名称。
