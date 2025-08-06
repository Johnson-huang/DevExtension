# HJ的Chrome拓展

## 项目简介

这是一个Chrome浏览器扩展，提供JSON数据格式化、复制和微信小程序mock数据生成功能，帮助开发者更高效地进行前端开发和调试。

![Trae IDE](https://lf-cdn.trae.com.cn/obj/trae-com-cn/trae_website_prod_cn/favicon.png)

本项目完全使用Trae IDE实现开发。Trae IDE提供了强大的AI辅助编程功能，包括代码补全、错误提示、重构建议等，极大提升了开发效率和代码质量。

## 功能特点
- **JSON数据格式化**：美化和格式化页面上的JSON数据，使其更易于阅读
- **复制功能**：一键复制格式化后的JSON数据
- **Mock数据生成**：为微信小程序开发提供快速的模拟数据生成
- **右键菜单支持**：在页面上选中文本后，可通过右键菜单快速格式化JSON

## 安装说明
1. 克隆本项目到本地
2. 运行`npm install`安装依赖
3. 运行`npm run build`构建项目
4. 打开Chrome浏览器，进入扩展管理页面
5. 启用"开发者模式"，点击"加载已解压的扩展程序"，选择项目的build目录

## 使用方法
1. **JSON格式化**：在包含JSON数据的页面上点击扩展图标，扩展会自动格式化页面上的JSON数据
2. **右键菜单**：选中页面上的JSON文本，右键选择"格式化JSON"选项
3. **Mock数据生成**：在扩展弹出页面中，选择需要的Mock数据类型和参数，点击生成按钮

## 技术栈与依赖
| 库名称 | 版本 | 描述 |
|--------|------|------|
| react | ^18.2.0 | 用于构建用户界面的JavaScript库 |
| react-dom | ^18.2.0 | 提供DOM特定方法的React扩展 |
| react-json-view | ^1.21.3 | 用于展示和交互JSON数据的React组件 |
| react-scripts | 5.0.1 | 创建React应用的脚本集 |
| less | ^4.4.0 | CSS预处理器 |
| less-loader | ^12.3.0 | Webpack加载器，用于处理Less文件 |
| react-app-rewired | ^2.2.1 | 自定义Create React App配置的工具 |
| customize-cra | ^1.0.0 | 配合React-App-Rewired使用的配置工具 |

## 项目结构
```tree
DevExtension/
├── .gitignore          # Git忽略文件
├── .vscode/            # VSCode配置
│   └── settings.json   # VSCode设置
├── README.md           # 项目说明文档
├── background.js       # 扩展后台脚本
├── build/              # 构建输出目录
│   ├── asset-manifest.json # 资源清单
│   ├── images/         # 构建后的图标
│   │   ├── icon128.svg # 128x128图标
│   │   ├── icon16.svg  # 16x16图标
│   │   └── icon48.svg  # 48x48图标
│   ├── index.html      # 构建后的HTML
│   └── static/         # 静态资源
│       ├── css/        # CSS文件
│       └── js/         # JavaScript文件
├── config-overrides.js # 配置覆盖文件
├── content.js          # 扩展内容脚本
├── manifest.json       # 扩展清单文件
├── package-lock.json   # 依赖锁文件
├── package.json        # 项目依赖和脚本
├── popup.html          # 扩展弹出页面
├── public/             # 公共资源
│   ├── images/         # 图标资源
│   │   ├── icon128.svg # 128x128图标
│   │   ├── icon16.svg  # 16x16图标
│   │   └── icon48.svg  # 48x48图标
│   └── index.html      # 公共HTML模板
├── scripts/            # 脚本工具
│   ├── generate-popup.js # 生成弹出页面脚本
│   └── update-readme.js # 更新README脚本
├── src/                # 源代码
│   ├── App.jsx         # 主组件
│   ├── App.less        # 样式文件
│   └── index.js        # 入口文件
└── update-readme.js    # 更新README脚本
```

## 构建和开发
- 开发模式：`npm start`
- 构建项目：`npm run build`
- 运行测试：`npm test`

## 更新日志
### v1.0.0
- 初始版本发布
- 实现JSON格式化和复制功能
- 实现Mock数据生成功能
- 添加右键菜单支持

---
最后更新时间: 2025/8/6 11:44:50