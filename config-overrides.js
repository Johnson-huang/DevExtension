const { override, addLessLoader } = require('customize-cra');
const webpack = require('webpack');

module.exports = override(
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
    },
    sourceMap: false
  }),
  // 配置PostCSS
  (config) => {
    // 查找postcss-loader配置
    const postcssRule = config.module.rules.find(rule =>
      rule.oneOf?.some(oneOf =>
        oneOf.use?.some(use =>
          use.loader && use.loader.includes('postcss-loader')
        )
      )
    );

    if (postcssRule && postcssRule.oneOf) {
      postcssRule.oneOf.forEach(oneOf => {
        if (oneOf.use) {
          oneOf.use.forEach(use => {
            if (use.loader && use.loader.includes('postcss-loader')) {
              // 确保使用postcssOptions属性
              if (use.options && !use.options.postcssOptions) {
                use.options = {
                  postcssOptions: use.options
                };
              }
            }
          });
        }
      });
    }

    // 添加ProvidePlugin配置以确保React被正确打包
    config.plugins.push(
      new webpack.ProvidePlugin({
        React: 'react',
      })
    );

    return config;
  }
);