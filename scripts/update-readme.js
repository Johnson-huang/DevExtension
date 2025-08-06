#!/usr/bin/env node

/**
 * 更新README.md文件的最后更新时间
 */
const fs = require('fs');
const path = require('path');

// 读取README.md文件（从项目根目录）
const readmePath = path.join(__dirname, '..', 'README.md');
let readmeContent = fs.readFileSync(readmePath, 'utf8');

// 更新最后更新时间
const currentTime = new Date().toLocaleString();
// 更新最后更新时间（匹配有无空格和内容的情况）
readmeContent = readmeContent.replace(/最后更新时间:?.*/, `最后更新时间: ${currentTime}`);

// 写回文件
fs.writeFileSync(readmePath, readmeContent, 'utf8');

console.log(`✅ README.md已更新，最后更新时间: ${currentTime}`);