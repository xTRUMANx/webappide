var React = require("react");
  Reflux = require("reflux"),
  Utils = require("./Utils"),
  ProgressBar = require("./ProgressBar"),
  ResourcesStore = require("./ResourcesStore"),
  ResourcesActions = require("./ResourcesActions"),
  ResourceDataStore = require("./ResourceDataStore"),
  ResourceDataActions = require("./ResourceDataActions");

var DataRows = React.createClass({displayName: "DataRows",
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
        React.createElement("tbody", null, 
          React.createElement("tr", null, 
            React.createElement("td", null, 
              React.createElement(ProgressBar, {message: "Loading"})
            )
          )
        )
      );
    }

    if(!this.props.element.properties.selectedFields || !this.props.element.properties.selectedFields.length){
      return (
        React.createElement("tbody", null)
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
        return React.createElement("th", {key: property.id}, property.name)
      });

    var headerRow = (
      React.createElement("tr", {key: "headerRow-" + this.state.resourceId}, headerRowCells)
    );

    if(!this.state.ResourceDataStore.allResourceData[this.state.resourceId]){
      return (
        React.createElement("tbody", null, 
          headerRow
        )
      );
    }

    var rows = this.state.ResourceDataStore.allResourceData[this.state.resourceId].
      map(function(resourceData){
        var cells = this.props.element.properties.selectedFields.map(function(field){
          var property = this.state.ResourcesStore.resource.properties.filter(function(property){
            return property.id === field;
          })[0];

          return (
            React.createElement("td", {key: property.id}, resourceData.data[property.id] ? resourceData.data[property.id].toString() : resourceData.data[property.id])
          );
        }.bind(this));

        return (
          React.createElement("tr", {key: "dataRow-" + resourceData.id}, 
            cells
          )
        );
      }.bind(this));

    rows.unshift(headerRow);

    return (
      React.createElement("tbody", null, 
        rows
      )
    );
  }
});

module.exports = DataRows;
