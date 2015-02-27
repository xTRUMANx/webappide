var React = require("react"),
  ReactRouter = require("react-router"),
  Reflux = require("reflux"),
  ResourcesActions = require("./ResourcesActions"),
  ResourcesStore = require("./ResourcesStore"),
  ResourceDataActions = require("./ResourceDataActions");
  ResourceDataStore = require("./ResourceDataStore"),
  ProgressBar = require("./ProgressBar"),
  Utils = require("./Utils");

var DataEditor = React.createClass({
  mixins: [Reflux.connect(ResourcesStore, "resourcesStoreState"), Reflux.connect(ResourceDataStore, "resourceDataStoreState"), ReactRouter.State],
  componentDidMount: function(){
    var resourceId = this.getQuery().id;

    this.state.resourceId = resourceId;

    ResourcesActions.load(resourceId);
    ResourceDataActions.loadAll(resourceId);
  },
  render: function(){
    if(this.state.resourcesStoreState.loading || this.state.resourceDataStoreState.loading) {
      return (
        <ProgressBar message="Loading" />
      );
    }

    var resource= this.state.resourcesStoreState.resource;
    var resourceData= this.state.resourceDataStoreState.allResourceData[this.state.resourceId];

    return (
      <div>
        <h1>Data Editor</h1>

        <DataViewer resource={resource} resourceData={resourceData}/>
      </div>
    );
  }
});

var DataViewer = React.createClass({
  mixins: [Reflux.connect(ResourceDataStore, "resourceDataStoreState")],
  getInitialState: function(){
    return {
      editing: []
    };
  },
  edit: function(resourceData){
    var editing = this.state.editing;

    var id = Utils.generateResourceDataIdForDataEditor(resourceData.id);

    if(editing[resourceData.id]) {
      ResourceDataActions.save(id, resourceData.id, this.props.resource.id);
    }
    else{
      ResourceDataActions.newResourceData(id, this.props.resource.id, resourceData)
    }

    editing[resourceData.id] = !editing[resourceData.id];

    this.setState({editing: editing});
  },
  render: function(){
    if(!this.props.resourceData){
      return (
        <h3>No Data Found</h3>
      );
    }

    var headerRow = this.props.resource.properties.map(function(property){
      return (
        <th key={property.id}>{property.name}</th>
      );
    });

    var dataRows = this.props.resourceData.map(function(resourceData){
      var cells = this.props.resource.properties.map(function(property){
        var value = resourceData.data[property.id];

        if(property.name === "id"){
          value = resourceData.id;
        }

        if(property.type === "boolean") {
          value = value ? "true" : "false";
        }

        return (
          <td key={property.id}>
            {this.state.editing[resourceData.id] && property.name !== "id"? <ResourceDataPropertyEditor property={property} resourceData={resourceData} /> : value}
          </td>
        );
      }.bind(this));

      return (
        <tr key={resourceData.id}>
          <td>
            <a className="clickable" onClick={this.edit.bind(this, resourceData)}>
              {this.state.editing[resourceData.id] ? "Update" : "Edit"}
            </a>
          </td>
          {cells}
        </tr>
      );
    }.bind(this));

    return (
      <div>
        <table className="table table-bordered table-condensed table-hover table-striped">
          <thead>
            <th></th>
            {headerRow}
          </thead>
          <tbody>
            {dataRows}
          </tbody>
        </table>
      </div>
    );
  }
});

var ResourceDataPropertyEditor = React.createClass({
  mixins: [Reflux.connect(ResourceDataStore, "resourceDataStoreState")],
  updateResourceDataProperty: function(propertyKey, id, e){
    var value = e.target.attributes["type"].value === "checkbox" ? e.target.checked : e.target.value;

    ResourceDataActions.updateResourceDataProperty(propertyKey, id, value)
  },
  render: function(){
    var value = this.props.resourceData.data[this.props.property.id];
    var editor;

    var id = Utils.generateResourceDataIdForDataEditor(this.props.resourceData.id);

    switch (this.props.property.type){
      case "boolean":
        editor = <input type="checkbox" ref="input" defaultChecked={value} onChange={this.updateResourceDataProperty.bind(this, this.props.property.id, id)} />
        break;
      default :
        editor = <input type={this.props.property.type} className="form-control" ref="input" defaultValue={value} onChange={this.updateResourceDataProperty.bind(this, this.props.property.id, id)} />
    }

    return editor;
  }
});

module.exports = DataEditor;
