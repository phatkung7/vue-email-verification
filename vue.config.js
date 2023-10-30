const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: process.env.VUE_APP_BASE_URL,
    //disableHostCheck: true,
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "DDC Helpdesk Systems";
      return args;
    });
  },
});
