var Reflux = require("reflux");

var Actions = {
  addChildElement: Reflux.createAction(),
  addParentElement: Reflux.createAction(),
  deleteElement: Reflux.createAction(),
  selectElement: Reflux.createAction(),
  updateElementProperty: Reflux.createAction(),
  moveUp: Reflux.createAction(),
  moveDown: Reflux.createAction(),
  load: Reflux.createAction(),
  loadDeployedPage: Reflux.createAction(),
  loadPages: Reflux.createAction(),
  loadLayoutPages: Reflux.createAction(),
  loadDeployedLayoutPages: Reflux.createAction(),
  loadResources: Reflux.createAction(),
  newPage: Reflux.createAction(),
  save: Reflux.createAction()
};

module.exports = Actions;
