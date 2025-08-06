/**
 * 应用入口文件
 * 负责渲染根组件到DOM中
 */

// 导入依赖
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';  // 导入主组件
import './App.less';     // 导入全局样式

// 创建根容器
const root = ReactDOM.createRoot(document.getElementById('root'));

// 渲染应用
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);