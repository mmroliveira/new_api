module.exports = {
  development: {
    client: "pg",
    connection: {
      database: "globalmax",
      user: "postgres",
      password: "qwer",
    },
    migrations: {
      directory: "./src/database/migrations",
    },
    seeds: {
      directory: "./src/database/seeds",
    },
  },

  production: {
    client: "pg",
    connection: {
      database: "finance_l8yh",
      user: "finance_l8yh_user",
      password: "XtC2uzD5taaikr3iVsk78OoaMs8RvUAz"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./dist/src/database/migrations",
    },
    seeds: {
      directory: "./dist/src/database/seeds",
    },
  },
};
