var React = require("react/addons"),
  cx = React.addons.classSet;

var elementsPropertiesSchema = require("./ElementsPropertiesSchema");

var ElementsProperties = React.createClass({
  updateElementProperty: function(propertyKey, element, e){
    var value;

    var schema = this.props.elementsPropertiesSchema[element.type];

    if(schema[propertyKey].valueType === "checkbox"){
      value = e.target.checked;
    }
    else{
      value = e.target.value;
    }

    if(schema[propertyKey].valueType === "number" && schema[propertyKey].min !== undefined && Number(value) < schema[propertyKey].min){
      value = schema[propertyKey].min;
    }

    if(schema[propertyKey].valueType === "number" && schema[propertyKey].max !== undefined && Number(value) > schema[propertyKey].max){
      value = schema[propertyKey].max;
    }

    element.properties[propertyKey] = value;

    this.props.resetState();
  },
  addAsChildElement: function(){
    var element = this.props.element;

    var newElementType = this.refs.newChildElementType.getDOMNode().value;
    var newElement = { type: newElementType, nextChildId: 0, parent: element, children: [] };

    newElement.id = element.id + "." + element.nextChildId++;

    switch (newElementType){
      case "heading":
        newElement.properties = { type: "1" };
        newElement.children.push({id: newElement.id + "." + newElement.nextChildId++, nextChildId: 0, type: "text", parent: newElement, properties: {type:"free", text: "New Heading"}});
        break;
      case "link":
        newElement.properties = { type: "external", location: "#" };
        newElement.children.push({id: newElement.id + "." + newElement.nextChildId++, nextChildId: 0, type: "text", parent: newElement, properties: {type:"free", text: "New Link"}});
        break;
      case "list":
        var childElement;

        if(newElement.parent.type !== "navbar") {
          childElement = {id: newElement.id + "." + newElement.nextChildId++, nextChildId: 0, type: "text", parent: newElement, properties: {type: "free", text: "New List Item"}};
        }
        else{
          childElement = {id: newElement.id + "." + newElement.nextChildId++, nextChildId: 0, type: "link", parent: newElement, properties: { type: "external", location: "#" }, children: [{type: "text", parent: newElement, properties: {type:"free", text: "New Link"}}]};
        }

        newElement.properties = { type: "unordered" };
        newElement.children.push(childElement);
        break;
      case "text":
        newElement.properties = { type: "free", text: "New Text" };
        break;
      case "navbar":
        newElement.properties = { brand: "Brand" };
        break;
      case "grid":
        newElement.properties = { columnsCount: 1 };
        break;
    }

    newElement.parent = element;

    element.children.push(newElement);

    this.props.resetState();
  },
  addAsParentElement: function(){
    var element = this.props.element;

    var newElementType = this.refs.newChildElementType.getDOMNode().value;
    var newElement = { id: element.parent.nextChildId++, nextChildId: 0, type: newElementType, parent: element.parent, children: [] };

    switch (newElementType){
      case "heading":
        newElement.properties = { type: "1" };
        break;
      case "link":
        newElement.properties = { type: "external", location: "#" };
        break;
      case "list":
        newElement.properties = { type: "unordered" };
        break;
      case "text":
        newElement.properties = { type: "free", text: "New Text" };
        break;
      case "navbar":
        newElement.properties = { brand: "Brand" };
        break;
      case "grid":
        newElement.properties = { columnsCount: 1 };
        break;
    }

    // NOTE: Modifying a prop property directly. Don't think this works...
    element.parent = newElement;
    element.id = newElement.id + "." + newElement.nextChildId++;

    newElement.children.push(element);

    this.props.resetState();
  },
  deleteElement: function(){
    this.props.deleteElement(this.props.element);
  },
  render: function(){
    var element = this.props.element;

    if(!element){
      return <h2>No element selected.</h2>;
    }

    var schema = this.props.elementsPropertiesSchema[element.type];

    var propertyKeys = Object.keys(schema).filter(function(key){
      return !schema[key].ifChildOf ||
        schema[key].ifChildOf.filter(function(parent){
          return element.parent && element.parent.type === parent;
        }).length > 0;
    });

    var propertiesTypes = propertyKeys.map(function(propertyKey, i){
      var value = element.properties[propertyKey];

      var key = element.type + "." + i + "." + propertyKey;

      var input;

      switch (schema[propertyKey].valueType){
        case "options":
          var options = schema[propertyKey].values.map(function(value, index){
            return <option key={index}>{value}</option>
          });

          input = (
            <select className="form-control" value={value} onChange={this.updateElementProperty.bind(this, propertyKey, element)}>
              {options}
            </select>
          );
          break;
        case "number":
          input = <input className="form-control" type="number" value={value || schema[propertyKey].defaultValue} min={schema[propertyKey].min} max={schema[propertyKey].max} onChange={this.updateElementProperty.bind(this, propertyKey, element)} />;
          break;
        case "checkbox":
          input = <input className="checkbox" value={value} type="checkbox" onChange={this.updateElementProperty.bind(this, propertyKey, element)} />;
          break;
        case "text":
        default:
          input = <input className="form-control" value={value} onChange={this.updateElementProperty.bind(this, propertyKey, element)} />;
          break;
      }

      return (
        <div className="form-group" key={key}>
          <label className="control-label col-sm-2">{propertyKey}</label>
          <div className="col-sm-10">
            {input}
          </div>
        </div>
      );
    }.bind(this));

    var elementsTypes = Object.keys(elementsPropertiesSchema).map(function(elementType, index){
      if(elementType != "page") {
        return <option key={index}>{elementType}</option>
      }
    });

    var deleteButtonClasses = cx({
      clickable: true,
      btn: true,
      "btn-danger": true,
      disabled: !element.parent
    });

    return (
      <div className="row">
        <div className="col-sm-3">
          <h2>Element: {element.type}</h2>
          <button className={deleteButtonClasses} disabled={!element.parent} onClick={this.deleteElement}>
            <span className="glyphicon glyphicon-remove"></span>
            Delete Element
          </button>
          <select className="form-control" className="form-control" ref="newChildElementType">
            {elementsTypes}
          </select>
          <button className="btn btn-success" type="button" onClick={this.addAsChildElement}>
            <span className="glyphicon glyphicon-plus"></span>
            Add as Child Element
          </button>
          <button className="btn btn-success" type="button" onClick={this.addAsParentElement}>
            <span className="glyphicon glyphicon-plus"></span>
            Add as Parent Element
          </button>
        </div>
        <div className="col-sm-9">
          <h3>Element Properties</h3>
          <form className="form-horizontal">
            {propertiesTypes}
          </form>
        </div>
      </div>
    );
  }
});

module.exports = ElementsProperties;
