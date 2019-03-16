module.exports = {
  config: {
    // add hyper-init configuration like this:
    init: [
      {
        rule: "once",
        commands: ["cd ./app", "npm run start"]
      },
      {
        rule: "windows",
        commands: ["mongod --dbpath ./data/db"]
      },
      {
        rule: "windows",
        commands: ["cd ./server", "npm run start"]
      }
    ]
  },

  plugins: ["hyper-init"]
};
