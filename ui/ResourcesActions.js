var Reflux = require("reflux");

var Actions = {
  load: Reflux.createAction(),
  addProperty: Reflux.createAction(),
  removeProperty: Reflux.createAction(),
  updateProperty: Reflux.createAction(),
  update: Reflux.createAction(),
  save: Reflux.createAction()
};

module.exports = Actions;
