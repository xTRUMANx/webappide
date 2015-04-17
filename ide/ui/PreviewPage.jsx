var React = require("react/addons"),
  ReactRouter = require("react-router"),
  Reflux = require("reflux"),
  ElementsStore = require("webappide-core/ElementsStore"),
  ElementsActions = require("webappide-core/ElementsActions"),
  ElementRenderer = require("webappide-core/ElementRenderer"),
  ProgressBar = require("webappide-core/ProgressBar");

var PreviewPage = React.createClass({
  mixins: [Reflux.connect(ElementsStore), ReactRouter.State],
  getInitialState: function(){
    return {siteId: this.getParams().siteId, pageId: this.getParams().pageId};
  },
  componentDidMount: function(){
    ElementsActions.load(this.state.pageId);
    ElementsActions.loadLayoutPages();
    ElementsActions.loadResources();
  },
  componentWillReceiveProps: function(){
    var currentPageId = this.getParams().pageId;

    if(currentPageId !== this.state.pageId){
      this.setState({pageId: currentPageId});

      ElementsActions.load(currentPageId);
    }
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
        <ElementRenderer element={this.state.elementsTree} layoutPage={this.state.layoutPage} resources={this.state.resources} siteId={this.state.siteId}
        ide={true} />
      </div>
    );
  }
});

module.exports = PreviewPage;
