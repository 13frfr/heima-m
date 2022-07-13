module.exports = {
  plugins: {
    // autoprefixer: {
    //   browsers: ["Android >= 4.0", "iOS >= 8"],
    // },
    "postcss-pxtorem": {
      // 1rem 的大小
      // vant 默认37.5
      rootValue:37.5,
      // rootValue: (module) => (/vant/gi.test(module.file) ? 37.5 : 75), // 适配的属性
      propList: ["*"],
    },
  },
};
