var React = require("react"),
  ReactRouter = require("react-router"),
  Reflux = require("reflux"),
  ResourcesActions = require("./ResourcesActions"),
  ResourcesStore = require("./ResourcesStore");

var ResourceDesigner = React.createClass({
  mixins: [Reflux.connect(ResourcesStore), ReactRouter.State],
  componentDidMount: function(){
    var resourceId = this.getQuery().id;

    if(resourceId) {
      ResourcesActions.load(resourceId);
    }
    else{
      ResourcesActions.newResource();
    }
  },
  addProperty: function(){
    ResourcesActions.addProperty();
  },
  removeProperty: function(property){
    if(confirm("Are you sure you want to delete this property?\nProperty Name: " + property.name)) {
      ResourcesActions.removeProperty(property);
    }
  },
  updatePropertyValue: function(property, propertyKey, e){
    ResourcesActions.updateProperty(property, propertyKey, e.target.value);
  },
  update: function(key, e){
    ResourcesActions.update(key, e.target.value);
  },
  save: function(){
    ResourcesActions.save();
  },
  render: function(){
    var resourcePropertyTypes = ["text", "number", "date", "boolean"].map(function(resourcePropertyType, index){
      return (
        <option key={index}>
          {resourcePropertyType}
        </option>
      );
    });

    var properties = this.state.resource.properties.map(function(resourceProperty, i){
      return (
        <tr key={resourceProperty.id}>
          <td>
            <button className="btn btn-danger" type="button" disabled={resourceProperty.uneditable} onClick={this.removeProperty.bind(this, resourceProperty)}>
              <span className="glyphicon glyphicon-remove" />
            </button>
          </td>
          <td>
            <input className="form-control" defaultValue={resourceProperty.name} readOnly={resourceProperty.uneditable} onChange={this.updatePropertyValue.bind(this, resourceProperty, "name")} />
          </td>
          <td>
            <select className="form-control" defaultValue={resourceProperty.type} disabled={resourceProperty.uneditable} onChange={this.updatePropertyValue.bind(this, resourceProperty, "type")}>
              {resourcePropertyTypes}
            </select>
          </td>
        </tr>
      );
    }.bind(this));

    return (
      <div>
        <h1>Resource Designer</h1>
        {this.state.err ? <p className="alert alert-danger">An error occurred while saving. Err: {this.state.err}</p> : null}
        <form className="form-horizontal" key={this.state.resource.id}>
          <div className="form-group">
            <label className="control-label col-sm-3">Resource Name</label>
            <div className="col-sm-9">
              <input className="form-control" defaultValue={this.state.resource.name} onChange={this.update.bind(this, "name")} />
            </div>
          </div>
          <div className="col-sm-9 col-sm-offset-3">
            <input className="btn btn-primary" type="submit" value="Save" disabled={this.state.saving} onClick={this.save} />
          </div>
          <table className="table table-bordered table-condensed table-striped">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {properties}
            </tbody>
          </table>
          <button className="btn btn-success" type="button" onClick={this.addProperty}>
            Add Property
          </button>
        </form>
      </div>
    );
  }
});

module.exports = ResourceDesigner;
