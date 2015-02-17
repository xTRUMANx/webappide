var React = require("react"),
  Reflux = require("reflux"),
  Utils = require("./Utils"),
  ResourceDataStore = require("./ResourceDataStore"),
  ResourceDataActions = require("./ResourceDataActions");

var Form = React.createClass({
  mixins: [Reflux.connect(ResourceDataStore)],
  componentDidMount: function(){
    var id = Utils.generateResourceDataId(this.props.element);

    ResourceDataActions.newResourceData(id);
  },
  submit: function(e){
    e.preventDefault();
    var id = Utils.findRoot(this.props.element).pageId + "-" + this.props.element.id;

    ResourceDataActions.save(id);
  },
  render: function(){
    return (
      <form className="form-horizontal" onSubmit={this.submit}>
        {this.props.children}
        <input className="btn btn-primary" type="submit" value="Save" />
      </form>
    );
  }
});

module.exports = Form;
