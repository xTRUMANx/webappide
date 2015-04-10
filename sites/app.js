var React = require("react"),
  ReactRouter = require("react-router"),
  Route = ReactRouter.Route;

var ElementRenderer = require("webappide-core/ElementRenderer");
var ProgressBar = require("webappide-core/ProgressBar");

var App = React.createClass({displayName: "App",
  render: function(){
    return (
      React.createElement("html", null, 
        React.createElement("head", null, 
          React.createElement("title", null, this.props.elementsTree.properties.title), 
          React.createElement("link", {rel: "stylesheet", type: "text/css", href: "css/bootstrap.min.css"})
        ), 
        React.createElement("body", null, 
          React.createElement(ElementRenderer, {element: this.props.elementsTree, layoutPage: this.props.layoutPage, resources: this.props.resources, siteId: this.props.siteId})
        )
      )
    );
  }
});

var routes = (
  React.createElement(Route, {name: "/", handler: App})
);

module.exports = routes;
