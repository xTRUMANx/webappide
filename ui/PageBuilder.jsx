var React = require("react/addons");

var elementsPropertiesSchema = require("./ElementsPropertiesSchema");

var samplePage = require("./SamplePage");

var initialState = {
  elementsTree: samplePage,
  selectedElement: samplePage
};

var ElementsProperties = require("./ElementsProperties");

var ElementsTree = require("./ElementsTree");

var ElementRenderer = require("./ElementRenderer");

var PageBuilder = React.createClass({
  getInitialState: function(){
    return initialState;
  },
  resetState: function(){
    this.setState(this.state);
  },
  selectElement: function(element){
    this.setState({ selectedElement: element });
  },
  deleteElement: function(element){
    var parent = element.parent;

    parent.children.splice(parent.children.indexOf(element), 1);

    this.selectElement(parent);
  },
  moveUp: function(element){
    var parent = element.parent;

    var elementIndex = parent.children.indexOf(element);

    if(elementIndex === 0){
      return;
    }

    parent.children.splice(elementIndex, 1);

    parent.children.splice(elementIndex - 1, 0, element);

    this.resetState();
  },
  moveDown: function(element){
    var parent = element.parent;

    var elementIndex = parent.children.indexOf(element);

    if(elementIndex === parent.children.length - 1){
      return;
    }

    parent.children.splice(elementIndex, 1);

    parent.children.splice(elementIndex + 1, 0, element);

    this.resetState();
  },
  render: function(){
    return (
      <div className="row">
        <div id="elementProperties" className="col-xs-12">
          <ElementsProperties element={this.state.selectedElement} resetState={this.resetState} deleteElement={this.deleteElement} elementsPropertiesSchema={elementsPropertiesSchema} />
        </div>
        <div id="elementsTree" className="col-xs-4">
          <h2>Elements Tree</h2>
          <ElementsTree tree={this.state.elementsTree} selectedElement={this.state.selectedElement} selectElementCb={this.selectElement} deleteElement={this.deleteElement} showChildren={true} moveUp={this.moveUp} moveDown={this.moveDown} />
        </div>
        <div className="col-xs-8">
          <ElementRenderer element={this.state.elementsTree} />
        </div>
      </div>
    );
  }
});

module.exports = PageBuilder;
