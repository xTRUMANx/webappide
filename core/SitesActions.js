var Reflux = require("reflux");

var SitesActions = {
  createSite: Reflux.createAction(),
  loadSites: Reflux.createAction(),
  loadSite: Reflux.createAction(),
  deletePage: Reflux.createAction({ asyncResult: true }),
  setAsHomePage: Reflux.createAction({ asyncResult: true }),
  deploySite: Reflux.createAction({ asyncResult: true })
}

module.exports = SitesActions;
