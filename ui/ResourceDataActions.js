var Reflux = require("reflux");

var ResourceDataActions = {
  save: Reflux.createAction(),
  newResourceData: Reflux.createAction(),
  updateResourceDataProperty: Reflux.createAction(),
  loadAll: Reflux.createAction()
};

module.exports = ResourceDataActions;
