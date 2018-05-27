export default {
  defaults: {
    port: process.env.PORT || 3000,
    db: './sqlite.db'
  },

  prod: {},

  dev: {
    port: 3001
  },
  test: {}
};
