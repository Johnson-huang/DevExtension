/**
 * HJ的Chrome拓展主组件
 * 提供JSON格式化和微信小程序Mock数据生成功能
 */
import React, { useState } from 'react';
import './App.less';
import ReactJson from 'react-json-view';
function App() {
  // JSON格式化输入
  const [formatJsonInput, setFormatJsonInput] = useState('');
  // JSON格式化输出
  const [formatJsonOutput, setFormatJsonOutput] = useState('');
  // Mock数据输入
  const [mockJsonInput, setMockJsonInput] = useState('');
  // Mock数据输出
  const [mockJsonOutput, setMockJsonOutput] = useState('');
  // 通知信息
  const [notification, setNotification] = useState({ message: '', type: '' });
  // 当前激活的标签页 ('format' 或 'mock')
  const [activeTab, setActiveTab] = useState('format');


  /**
   * 格式化JSON字符串
   * @description 将输入的JSON字符串解析后重新格式化输出
   * @returns {void}
   */
  const formatJSON = () => {
    try {
      if (!formatJsonInput) {
        showNotification('请先输入JSON字符串', 'warning');
        return;
      }
      const json = JSON.parse(formatJsonInput);
      setFormatJsonOutput(JSON.stringify(json, null, 2));
      showNotification('格式化成功！', 'success');
    } catch (error) {
      setFormatJsonOutput(null);
      showNotification('格式化失败，请检查JSON格式: ' + error.message, 'error');
    }
  };

  /**
   * 复制结果到剪贴板
   * @description 根据当前激活的标签页，复制对应的格式化结果或Mock数据
   * @returns {void}
   */
  const copyToClipboard = () => {
    const textToCopy = activeTab === 'format' ? formatJsonOutput : mockJsonOutput;
    navigator.clipboard.writeText(textToCopy).then(() => {
      showNotification('已复制到剪贴板！', 'success');
    }).catch(() => {
      showNotification('复制失败，请手动复制', 'error');
    });
  };

  /**
   * 生成小程序Mock数据
   * @description 将输入的JSON数据转换为符合微信小程序要求的Mock数据格式
   * @returns {void}
   */
  const generateMockFromResult = () => {
    try {
      if (!mockJsonInput) {
        showNotification('请先输入JSON数据', 'warning');
        return;
      }

      let data;
      try {
        // 尝试解析输入的JSON数据
        data = JSON.parse(mockJsonInput);
      } catch (error) {
        setMockJsonOutput(null);
        showNotification('输入的不是有效的JSON: ' + error.message, 'error');
        return;
      }

      // 构建符合微信小程序要求的Mock数据格式
      const mockData = {
        data: data,  // data是JSON对象类型
        statusCode: 200,
        header: 'Content-Type: application/json'
      };

      // 将整个Mock数据对象序列化为格式化的JSON字符串
      setMockJsonOutput(JSON.stringify(mockData, null, 2));
      showNotification('Mock数据生成成功！', 'success');
    } catch (error) {
      setMockJsonOutput(null);
      showNotification('生成失败: ' + error.message, 'error');
    }
  };

  /**
   * 显示通知
   * @description 在页面底部显示通知信息，3秒后自动消失
   * @param {string} message - 通知内容
   * @param {string} type - 通知类型 ('success', 'error', 'warning')
   * @returns {void}
   */
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  return (
    <div className="body-class">
      <div className="container">
        <h1 className="title-h1">HJ的Chrome拓展</h1>
        <p className="paragraph">提供JSON格式化和微信小程序mock数据生成功能</p>

      {/* Tab切换区域 */}
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'format' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('format');
            setMockJsonInput('');
            setMockJsonOutput('');
          }}
        >
          JSON格式化
        </button>
        <button 
          className={`tab-button ${activeTab === 'mock' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('mock');
            setFormatJsonInput('');
            setFormatJsonOutput('');
          }}
        >
          生成小程序Mock数据
        </button>
      </div>

      {/* 内容区域 */}
      <div className="tab-content">
        {activeTab === 'format' && (
          <div className="section">
            <h2>JSON格式化</h2>
            <textarea
              className="textarea-class"
              value={formatJsonInput}
              onChange={(e) => setFormatJsonInput(e.target.value)}
              placeholder="请输入JSON字符串..."
            ></textarea>
            <div className="buttons">
              <button className="button-class" onClick={formatJSON}>格式化</button>
              <button className="button-class copy-btn" onClick={copyToClipboard}>复制结果</button>
            </div>
            {formatJsonOutput && (
              <div className="json-view-container">
                <h3>格式化结果:</h3>
                {(() => {
                  try {
                    const jsonData = JSON.parse(formatJsonOutput);
                    return <ReactJson src={jsonData} theme="monokai" />;
                  } catch (error) {
                    return <div className="error-message">无法显示结果: {error.message}</div>;
                  }
                })()}
              </div>
            )}
          </div>
        )}

        {activeTab === 'mock' && (
          <div className="section">
            <h2>生成小程序Mock数据</h2>
            <textarea
              className="textarea-class"
              value={mockJsonInput}
              onChange={(e) => setMockJsonInput(e.target.value)}
              placeholder="输入JSON数据"
            ></textarea>
            <div className="buttons">
              <button className="button-class mock-btn" onClick={generateMockFromResult}>生成小程序Mock数据</button>
              <button className="button-class copy-btn" onClick={copyToClipboard}>复制结果</button>
            </div>
            {mockJsonOutput && (
              <div className="json-view-container">
                <h3>Mock数据结果:</h3>
                {(() => {
                  try {
                    const jsonData = JSON.parse(mockJsonOutput);
                    return <ReactJson src={jsonData} theme="monokai" />;
                  } catch (error) {
                    return <div className="error-message">无法显示结果: {error.message}</div>;
                  }
                })()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 通知组件 */}
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  </div>
  );
}

export default App;