// 监听扩展安装事件
/**
 * Chrome扩展后台脚本
 * 处理扩展的后台任务和消息通信
 */

// 监听扩展安装事件
chrome.runtime.onInstalled.addListener(function() {
  console.log('JSON工具盒扩展已安装');

  // 设置初始状态
  chrome.storage.sync.set({
    lastUsed: new Date().toISOString()
  });
});

/**
 * 监听来自content script的消息
 * @param {Object} message - 消息对象
 * @param {Object} sender - 发送者信息
 * @param {Function} sendResponse - 响应函数
 * @returns {boolean} - 返回true保持消息通道开放
 */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'formatJSON') {
    try {
      const formattedJSON = JSON.stringify(JSON.parse(message.json), null, 2);
      sendResponse({ success: true, result: formattedJSON });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  } else if (message.action === 'generateMock') {
    const mockData = generateMockData(message.count);
    sendResponse({ success: true, result: mockData });
  }
  return true; // 保持消息通道开放，以便异步发送响应
});

/**
 * 生成Mock数据
 * @description 根据指定数量生成模拟数据
 * @param {number} count - 生成的数据条数
 * @returns {Object} - 包含模拟数据的对象
 */
function generateMockData(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
    const item = {
      name: '项目' + (i + 1),
      description: '这是项目' + (i + 1) + '的描述内容',
      status: Math.random() > 0.5 ? 'active' : 'inactive',
      value: Math.floor(Math.random() * 1000)
    };

    item.id = i + 1;
    item.createTime = new Date().toISOString();
    item.randomNum = Math.random().toFixed(6);

    data.push(item);
  }

  return {
    code: 0,
    msg: 'success',
    data: data,
    total: count
  };
}

// 定期清理存储的数据
chrome.alarms.create('cleanup', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'cleanup') {
    // 清理一周前的数据
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    chrome.storage.sync.get(null, function(items) {
      for (const key in items) {
        if (key.startsWith('history_') && new Date(items[key].timestamp) < weekAgo) {
          chrome.storage.sync.remove(key);
        }
      }
    });
  }
});