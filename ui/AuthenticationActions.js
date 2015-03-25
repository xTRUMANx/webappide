var Reflux = require("reflux");

var AuthenticationActions = {
  register: Reflux.createAction({ asyncResult: true }),
  login: Reflux.createAction({ asyncResult: true }),
  logout: Reflux.createAction({ asyncResult: true }),
  checkSession: Reflux.createAction({ asyncResult: true })
};

module.exports = AuthenticationActions;
