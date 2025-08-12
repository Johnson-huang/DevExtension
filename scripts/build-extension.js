/**
 * 完整的Chrome扩展构建脚本
 * - 运行构建
 * - 复制必要文件到构建目录
 * - 更新manifest.json中的路径
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 定义路径
const rootDir = path.join(__dirname, '..');
const buildDir = path.join(rootDir, 'build');
const extensionDir = path.join(rootDir, 'extension'); // 最终的扩展目录

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 清理旧目录
function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// 复制文件
function copyFile(source, target) {
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
  console.log(`✅ 已复制: ${source} -> ${target}`);
}

// 复制目录
function copyDir(sourceDir, targetDir) {
  ensureDir(targetDir);
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ 已复制: ${sourcePath} -> ${targetPath}`);
    }
  }
}

// 更新manifest.json中的路径
function updateManifest() {
  const manifestPath = path.join(extensionDir, 'manifest.json');
  let manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  // 更新图标路径
  if (manifest.action && manifest.action.default_icon) {
    manifest.action.default_icon = {
      '16': 'images/icon16.png',
      '48': 'images/icon48.png',
      '128': 'images/icon128.png'
    };
    console.log('✅ 已更新default_icon路径');
  }

  if (manifest.icons) {
    manifest.icons = {
      '16': 'images/icon16.png',
      '48': 'images/icon48.png',
      '128': 'images/icon128.png'
    };
    console.log('✅ 已更新icons路径');
  }

  // 保存更新后的manifest.json
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('✅ 已更新manifest.json中的图标路径');
}

// 主构建函数
function buildExtension() {
  try {
    console.log('🚀 开始构建Chrome扩展...');

    // 清理旧的构建目录
    cleanDir(buildDir);
    cleanDir(extensionDir);

    // 运行原始构建流程
    console.log('🔨 运行npm run build...');
    execSync('npm run update-readme && react-app-rewired build', { stdio: 'inherit' });

    // 生成popup.html
    console.log('🔨 生成popup.html...');
    execSync('node scripts/generate-popup.js', { stdio: 'inherit' });

    // 复制构建产物到扩展目录
    console.log('📋 复制构建产物到扩展目录...');
    copyDir(path.join(buildDir, 'static'), path.join(extensionDir, 'static'));
    copyDir(path.join(buildDir, 'images'), path.join(extensionDir, 'images'));

    // 复制其他必要文件
    console.log('📋 复制其他必要文件...');
    copyFile(path.join(rootDir, 'manifest.json'), path.join(extensionDir, 'manifest.json'));
    copyFile(path.join(rootDir, 'content.js'), path.join(extensionDir, 'content.js'));
    copyFile(path.join(rootDir, 'background.js'), path.join(extensionDir, 'background.js'));
    copyFile(path.join(rootDir, 'popup.html'), path.join(extensionDir, 'popup.html'));

    // 更新manifest.json中的路径
    updateManifest();

    console.log('✅ Chrome扩展构建完成！产物位于: ' + extensionDir);
  } catch (error) {
    console.error('❌ 构建失败:', error.message);
    process.exit(1);
  }
}

// 执行构建
buildExtension();