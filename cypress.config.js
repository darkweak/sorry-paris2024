const { defineConfig } = require("cypress");

let clientID;
let email;
let code;

module.exports = defineConfig({
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        setClientId: (val) => {
            return (clientID = val);
        },
        getClientId: () => {
            return clientID;
        },

        setEmail: (val) => {
            return (email = val);
        },
        getEmail: () => {
            return email;
        },

        setCode: (val) => {
            return (code = val);
        },
        getCode: () => {
            return code;
        }
      })
    },
  },
});
