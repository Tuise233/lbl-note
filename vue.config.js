const { defineConfig } = require('@vue/cli-service')
const path = require('path');
module.exports = defineConfig({
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.join(__dirname, "./src/assets/style/index.less")]
    },
    electronBuilder: {
      builderOptions: {
        'productName': "拉布拉记"
      }
    }
  }
})
