export default {
  defaults: {
    port: process.env.PORT || 3000
  },

  prod: {},

  dev: {
    port: 3001
  },
  test: {}
};
