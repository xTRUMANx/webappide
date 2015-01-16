var React = require("react/addons"),
  Reflux = require("reflux"),
  Actions = require("./Actions");

var elementsPropertiesSchema = require("./ElementsPropertiesSchema");

var Store = require("./Store");

var ElementsProperties = require("./ElementsProperties");

var ElementsTree = require("./ElementsTree");

var ElementRenderer = require("./ElementRenderer");

var PageBuilder = React.createClass({
  mixins: [Reflux.connect(Store)],
  render: function(){
    return (
      <div className="row">
        <div id="elementProperties" className="col-xs-12">
          <ElementsProperties element={this.state.selectedElement} elementsPropertiesSchema={elementsPropertiesSchema} />
        </div>
        <div id="elementsTree" className="col-xs-4">
          <h2>Elements Tree</h2>
          <ElementsTree tree={this.state.elementsTree} selectedElement={this.state.selectedElement} showChildren={true} />
        </div>
        <div className="col-xs-8">
          <ElementRenderer element={this.state.elementsTree} />
        </div>
      </div>
    );
  }
});

module.exports = PageBuilder;
