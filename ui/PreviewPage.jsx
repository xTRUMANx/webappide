var React = require("react/addons"),
  ReactRouter = require("react-router"),
  Reflux = require("reflux"),
  ElementsStore = require("./ElementsStore"),
  ElementsActions = require("./ElementsActions"),
  ElementRenderer = require("./ElementRenderer"),
  ProgressBar = require("./ProgressBar");

var PreviewPage = React.createClass({
  mixins: [Reflux.connect(ElementsStore), ReactRouter.State],
  componentDidMount: function(){
    var pageId = this.getQuery().id;

    ElementsActions.load(pageId);
  },
  render: function(){
    if(this.state.loading) {
      return (
        <ProgressBar message="Loading" />
      );
    }

    if(this.state.err) {
      return <p className="alert alert-danger">Failed to load data. Try refreshing. {this.state.err}</p>;
    }

    if(!this.state.elementsTree) return null;

    return (
      <div>
        <h2 className="text-center">Previewed Page: {this.state.elementsTree.properties.title}</h2>
        <hr />
        <ElementRenderer element={this.state.elementsTree} />
      </div>
    );
  }
});

module.exports = PreviewPage;
