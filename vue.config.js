module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    disableHostCheck: true,
    // proxy: {
    //   '^/_dev' : {
    //     target: 'olivia_host',
    //     pathRewrite: { '^/_dev' : '' }
    //   }
    // }
  },
};
