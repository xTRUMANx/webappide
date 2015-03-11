var Reflux = require("reflux");

var SitesActions = {
  createSite: Reflux.createAction(),
  loadSites: Reflux.createAction(),
  loadSite: Reflux.createAction()
}

module.exports = SitesActions;
