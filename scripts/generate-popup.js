/**
 * 自动生成popup.html文件，根据asset-manifest.json中的资源路径
 */
const fs = require('fs');
const path = require('path');

// 读取asset-manifest.json（从项目根目录）
const manifestPath = path.join(__dirname, '..', 'build', 'asset-manifest.json');

// 检查asset-manifest.json是否存在
if (!fs.existsSync(manifestPath)) {
  console.error('❌ 错误: asset-manifest.json文件不存在。请先运行npm run build。');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// 提取CSS和JS文件路径
const cssPath = manifest.files['main.css'];
const jsPath = manifest.files['main.js'];

// 确保路径正确
const normalizedCssPath = cssPath.startsWith('/') ? '.' + cssPath : cssPath;
const normalizedJsPath = jsPath.startsWith('/') ? '.' + jsPath : jsPath;

// HTML模板
const htmlTemplate = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HJ的Chrome拓展</title>
  <link rel="stylesheet" href="${normalizedCssPath}">
</head>
<body>
  <div id="root"></div>
  <script src="${normalizedJsPath}"></script>
</body>
</html>`;

// 写入popup.html（到项目根目录）
const popupPath = path.join(__dirname, '..', 'popup.html');
fs.writeFileSync(popupPath, htmlTemplate, 'utf8');

console.log('✅ popup.html已成功生成，引用路径已更新');