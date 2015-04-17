var React = require("react"),
  ReactRouter = require("react-router"),
  Route = ReactRouter.Route,
  Utils = require("webappide-core/Utils"),
  ElementsStore = require("webappide-core/ElementsStore"),
  ElementsActions = require("webappide-core/ElementsActions");

var ElementRenderer = require("webappide-core/ElementRenderer");
var ProgressBar = require("webappide-core/ProgressBar");

var App = React.createClass({displayName: "App",
  mixins: [Reflux.listenTo(ElementsStore, "onStoreChange"), ReactRouter.State],
  onStoreChange: function(state){
    this.setState(state);
  },
  getInitialState: function(){
    return this.props;
  },
  componentWillReceiveProps: function(){
    var currentPageId = this.getQuery().pageId;

    if(currentPageId !== this.state.elementsTree.pageId){
      this.setState({pageId: currentPageId});
      ElementsActions.loadDeployedPage(currentPageId);
      ElementsActions.loadDeployedLayoutPages();
      ElementsActions.loadResources();
    }
  },
  render: function(){
    return (
      React.createElement("html", null, 
        React.createElement("head", null, 
          React.createElement("title", null, this.props.elementsTree.properties.title), 
          React.createElement("link", {rel: "stylesheet", type: "text/css", href: "css/bootstrap.min.css"})
        ), 
        React.createElement("body", null, 
          React.createElement(ElementRenderer, {element: this.state.elementsTree, layoutPage: this.state.layoutPage, resources: this.state.resources, siteId: this.state.siteId}), 
          React.createElement("script", {src: "/js/bundle.js"}), 
          React.createElement("script", {id: "props", type: "text", dangerouslySetInnerHTML: {__html: this.props.serializedProps}})
        )
      )
    );
  }
});

var routes = (
  React.createElement(Route, {name: "root", path: "/", handler: App})
);

module.exports = routes;

if(typeof window !== "undefined"){
  window.onload = function(){
    var serializedProps = document.getElementById("props").innerHTML;

    var props = JSON.parse(serializedProps);
    props.serializedProps = serializedProps;

    props.elementsTree = Utils.setElementParent(props.elementsTree);

    if(props.layoutPage) props.layoutPage = Utils.setElementParent(props.layoutPage);

    var currentUrl = window.location.pathname + window.location.search;

    ReactRouter.run(routes, ReactRouter.HistoryLocation, function(Handler){
      React.render(React.createElement(Handler, React.__spread({},  props)), window.document);
    });
  };
}
