var React = require("react"),
  Reflux = require("reflux"),
  Utils = require("./Utils"),
  ResourceDataStore = require("./ResourceDataStore"),
  ResourceDataActions = require("./ResourceDataActions");

var Form = React.createClass({displayName: "Form",
  mixins: [Reflux.connect(ResourceDataStore)],
  componentDidMount: function(){
    var id = Utils.generateResourceDataId(this.props.element);

    ResourceDataActions.newResourceData(id, this.props.element.properties.resource);
  },
  submit: function(e){
    e.preventDefault();
    var id = Utils.findRoot(this.props.element).pageId + "-" + this.props.element.id;

    ResourceDataActions.save(id);
  },
  render: function(){
    return (
      React.createElement("form", {className: "form-horizontal", onSubmit: this.submit}, 
        this.state.saveFailed ? React.createElement("p", {className: "alert alert-danger"}, "Save Failed") : null, 
        this.state.saveSucceeded ? React.createElement("p", {className: "alert alert-success"}, "Save Succeeded") : null, 
        this.props.children, 
        React.createElement("input", {className: "btn btn-primary col-sm-offset-3", type: "submit", disabled: this.state.saving, value: "Save"})
      )
    );
  }
});

module.exports = Form;
