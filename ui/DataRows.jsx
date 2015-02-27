var React = require("react");
  Reflux = require("reflux"),
  Utils = require("./Utils"),
  ProgressBar = require("./ProgressBar"),
  ResourcesStore = require("./ResourcesStore"),
  ResourcesActions = require("./ResourcesActions"),
  ResourceDataStore = require("./ResourceDataStore"),
  ResourceDataActions = require("./ResourceDataActions");

var DataRows = React.createClass({
  mixins: [Reflux.connect(ResourcesStore, "ResourcesStore"), Reflux.connect(ResourceDataStore, "ResourceDataStore")],
  componentDidMount: function(){
    var ancestorTable = Utils.findAncestorByType(this.props.element, "dataTable");

    var resourceId = ancestorTable.properties.resource;

    this.setState({
      resourceId: resourceId
    });

    ResourcesActions.load(resourceId);
    ResourceDataActions.loadAll(resourceId);
  },
  render: function(){
    if(this.state.ResourcesStore.loading || this.state.ResourceDataStore.loading){
      return (
        <tbody>
          <tr>
            <td>
              <ProgressBar message="Loading" />
            </td>
          </tr>
        </tbody>
      );
    }

    if(!this.props.element.properties.selectedFields || !this.props.element.properties.selectedFields.length){
      return (
        <tbody />
      );
    }

    var headerRowCells = this.state.ResourcesStore.resource.properties.
      filter(function(property){
        return this.props.element.properties.selectedFields.indexOf(property.id) > -1;
      }.bind(this)).
      sort(function(a, b){
        return this.props.element.properties.selectedFields.indexOf(a.id) > this.props.element.properties.selectedFields.indexOf(b.id)
      }.bind(this)).
      map(function(property){
        return <th key={property.id}>{property.name}</th>
      });

    var headerRow = (
      <tr key={"headerRow-" + this.state.resourceId}>{headerRowCells}</tr>
    );

    if(!this.state.ResourceDataStore.allResourceData[this.state.resourceId]){
      return (
        <tbody>
          {headerRow}
        </tbody>
      );
    }

    var rows = this.state.ResourceDataStore.allResourceData[this.state.resourceId].
      map(function(resourceData){
        var cells = this.props.element.properties.selectedFields.map(function(field){
          var property = this.state.ResourcesStore.resource.properties.filter(function(property){
            return property.id === field;
          })[0];

          return (
            <td key={property.id}>{resourceData.data[property.name] ? resourceData.data[property.name].toString() : resourceData.data[property.name]}</td>
          );
        }.bind(this));

        return (
          <tr key={"dataRow-" + resourceData.id}>
            {cells}
          </tr>
        );
      }.bind(this));

    rows.unshift(headerRow);

    return (
      <tbody>
        {rows}
      </tbody>
    );
  }
});

module.exports = DataRows;
