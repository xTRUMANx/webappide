var Reflux = require("reflux");

var Actions = {
  addChildElement: Reflux.createAction(),
  addParentElement: Reflux.createAction(),
  deleteElement: Reflux.createAction(),
  selectElement: Reflux.createAction(),
  updateElementProperty: Reflux.createAction(),
  moveUp: Reflux.createAction(),
  moveDown: Reflux.createAction()
};

module.exports = Actions;
