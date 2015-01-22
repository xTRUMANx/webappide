var React = require("react/addons"),
  cx = React.addons.classSet,
  ElementsActions = require("./ElementsActions");

var ElementsProperties = React.createClass({
  updateElementProperty: function(propertyKey, element, e){
    var schema = this.props.elementsPropertiesSchema[element.type];

    var value;

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

    ElementsActions.updateElementProperty(element.id, propertyKey, value);
  },
  addAsChildElement: function(){
    var element = this.props.element;

    var newElementType = this.refs.newChildElementType.getDOMNode().value;

    ElementsActions.addChildElement(newElementType, element);
  },
  addAsParentElement: function(){
    var element = this.props.element;

    var newElementType = this.refs.newChildElementType.getDOMNode().value;

    ElementsActions.addParentElement(newElementType, element);
  },
  deleteElement: function(){
    ElementsActions.deleteElement(this.props.element);
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

    var elementsTypes = Object.keys(this.props.elementsPropertiesSchema).map(function(elementType, index){
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
