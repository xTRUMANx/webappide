var React = require("react"),
  Reflux = require("reflux"),
  Utils = require("./Utils"),
  ElementsStore = require("./ElementsStore"),
  ElementsActions = require("./ElementsActions"),
  ResourceDataStore = require("./ResourceDataStore"),
  ResourceDataActions = require("./ResourceDataActions");

var Input = React.createClass({
  mixins: [Reflux.connect(ElementsStore, "elementState"), Reflux.connect(ResourceDataStore)],
  componentWillMount: function(){
    var ancestorForm = Utils.findAncestorByType(this.props.element, "form");

    var resourceDataId = Utils.generateResourceDataId(this.props.element);

    this.setState({ ancestorForm: ancestorForm, resourceDataId: resourceDataId });
  },
  updateResourceDataProperty: function(propertyKey, formId, e){
    var value = e.target.attributes["type"].value === "checkbox" ? e.target.checked : e.target.value;

    ResourceDataActions.updateResourceDataProperty(propertyKey, this.state.resourceDataId, value)
  },
  render: function(){
    if(!this.props.resources.length) {
      return (
        <p>[Input Element]</p>
      );
    }

    var element = this.props.element;

    var ancestorForm = this.state.ancestorForm;

    var resourceData = this.state.resourceData && this.state.resourceData[this.state.resourceDataId] ? this.state.resourceData[this.state.resourceDataId] : {};

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
                    <input type="checkbox" defaultValue={resourceData[resourceProperty.name]} onChange={this.updateResourceDataProperty.bind(this, resourceProperty.name, ancestorForm.id)} />
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
                <input className="form-control" type={resourceProperty.type} defaultValue={resourceData[resourceProperty.name]} onChange={this.updateResourceDataProperty.bind(this, resourceProperty.name, ancestorForm.id)} />
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

module.exports = Input;
