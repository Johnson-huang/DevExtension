// 监听来自后台或popup的消息
/**
 * Chrome扩展内容脚本
 * 注入到网页中，提供页面JSON格式化和选中文本JSON格式化功能
 */

/**
 * 监听来自扩展的消息
 * @param {Object} message - 消息对象
 * @param {Object} sender - 发送者信息
 * @param {Function} sendResponse - 响应函数
 * @returns {boolean} - 返回true保持消息通道开放
 */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'formatPageJSON') {
    // 尝试格式化当前页面中的JSON
    try {
      // 查找页面中可能包含JSON的元素
      const jsonElements = document.querySelectorAll('pre, code, textarea');
      let foundJSON = false;

      jsonElements.forEach(element => {
        const text = element.textContent.trim();
        if ((text.startsWith('{') && text.endsWith('}')) || 
            (text.startsWith('[') && text.endsWith(']'))) {
          try {
            // 尝试解析为JSON
            const json = JSON.parse(text);
            // 格式化JSON并替换内容
            element.textContent = JSON.stringify(json, null, 2);
            foundJSON = true;
          } catch (e) {
            // 不是有效的JSON
          }
        }
      });

      if (foundJSON) {
        sendResponse({ success: true, message: '已格式化页面中的JSON' });
      } else {
        sendResponse({ success: false, message: '未在页面中找到有效的JSON' });
      }
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
  return true;
});

/**
 * 创建上下文菜单项
 * @description 添加一个右键菜单选项，允许用户格式化选中的JSON文本
 */
chrome.contextMenus.create({
  id: 'formatSelectedJSON',
  title: '格式化选中的JSON',
  contexts: ['selection']
});

/**
 * 监听上下文菜单点击事件
 * @description 处理右键菜单中格式化JSON选项的点击事件
 * @param {Object} info - 菜单信息对象
 * @param {Object} tab - 标签页对象
 */
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === 'formatSelectedJSON') {
    const selectedText = info.selectionText;
    try {
      // 解析并格式化选中的JSON
      const json = JSON.parse(selectedText);
      const formattedJSON = JSON.stringify(json, null, 2);

      // 向当前标签页发送消息，替换选中的文本
      chrome.tabs.sendMessage(tab.id, {
        action: 'replaceSelectedText',
        text: formattedJSON
      });
    } catch (error) {
      // 显示错误通知
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon48.png',
        title: 'JSON格式化失败',
        message: '选中的文本不是有效的JSON: ' + error.message
      });
    }
  }
});

// 注入一个脚本到页面，用于替换选中的文本
function injectReplaceTextScript() {
  const script = document.createElement('script');
  script.textContent = `
    document.addEventListener('JSON_TOOLBOX_REPLACE_TEXT', function(e) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(e.detail.text));
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  `;
  document.head.appendChild(script);
}

// 监听替换选中文本的消息
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'replaceSelectedText') {
    // 触发页面中的事件，替换选中的文本
    const event = new CustomEvent('JSON_TOOLBOX_REPLACE_TEXT', {
      detail: { text: message.text }
    });
    document.dispatchEvent(event);
    sendResponse({ success: true });
  }
  return true;
});

// 页面加载完成后注入脚本
window.addEventListener('load', injectReplaceTextScript);