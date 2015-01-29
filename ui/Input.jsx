var React = require("react"),
  Reflux = require("reflux"),
  ElementsStore = require("./ElementsStore"),
  ElementsActions = require("./ElementsActions");

var Input = React.createClass({
  mixins: [Reflux.connect(ElementsStore, "elementState")],
  componentDidMount: function(){

  },
  render: function(){
    if(!this.props.resources.length) {
      return (
        <p>[Input Element]</p>
      );
    }

    var element = this.props.element;

    var ancestorForm = findAncestorByType(element, "form");

    var resource = this.props.resources.filter(function(r){
      return r.id === ancestorForm.properties.resource;
    })[0];

    var resourceProperty = resource.properties.filter(function(p){
      return p.id === element.properties.resourceProperty;
    })[0];

    var renderedInput;

    if(resourceProperty){
      switch(resourceProperty.type) {
        case "boolean":
          renderedInput = (
            <div className="form-group">
                <div className="checkbox">
                  <label>
                    <input type="checkbox" />
                    {resourceProperty.name}
                  </label>
                </div>
            </div>
          );
          break;
        default :
          renderedInput = (
            <div className="form-group">
              <label className="control-label">{resourceProperty.name}</label>
              <div className="">
                <input className="form-control" type={resourceProperty.type} />
              </div>
            </div>
          );
      }
    }
    else{
      renderedInput = (
        <p>[Input Element]</p>
      );
    }

    return renderedInput;
  }
});

function findAncestorByType(element, type){
  if(element.type === type){
    return element;
  }
  else if(!element.parent){
    return null;
  }
  else {
    return findAncestorByType(element.parent, type);
  }
}

module.exports = Input;
