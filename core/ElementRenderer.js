var React = require("react/addons"),
  cx = React.addons.classSet,
  ReactRouter = require("react-router"),
  Link = ReactRouter.Link,
  Form = require("./Form"),
  Input = require("./Input"),
  DataRows = require("./DataRows");

var ElementRenderer = React.createClass({displayName: "ElementRenderer",
  mixins: [ReactRouter.Navigation],
  render: function(){
    var element = this.props.element;

    if(!element) return null;

    var renderedElement;

    var childElements = element.children || [];

    var renderedChildren = childElements.map(function(childElement, index){
      return React.createElement(ElementRenderer, {element: childElement, pageBuilder: this.props.pageBuilder, key: index, content: this.props.content, resourceOptions: this.props.resourceOptions, resourcePropertiesOptions: this.props.resourcePropertiesOptions, resources: this.props.resources, siteId: this.props.siteId, ide: this.props.ide});
    }.bind(this));

    switch (element.type){
      case "page":
        renderedElement = (
          React.createElement("div", null, 
            renderedChildren
          )
        );
        break;
      case "content":
        if(this.props.pageBuilder){
          renderedElement = (
            React.createElement("h1", null, "Content Goes Here")
          );
        }
        else{
          renderedElement = this.props.content
        }
        break;
      case "heading":
        var headingClass = cx({
          "text-center": element.properties.centered
        });

        renderedElement = (
          React.createElement("h" + element.properties.type, { className: headingClass }, renderedChildren)
        );
        break;
      case "link":
        if(element.properties.type === "external"){
          renderedElement = (
            React.createElement("a", {href: url}, renderedChildren)
          );
        }
        else if(this.props.ide){
          var url = "";

          if(element.properties.page){
            url = this.makePath("previewPage", { pageId: element.properties.page, siteId: this.props.siteId });
          }

          renderedElement = (
            React.createElement(Link, {to: url}, renderedChildren)
          );
        }
        else{
          var url = this.makeHref("root", null, { pageId: element.properties.page });

          renderedElement = (
            React.createElement(Link, {to: "root", query: {pageId: element.properties.page}}, renderedChildren)
          );
        }

        break;
      case "list":
        var list;

        var listClass = cx({
          "nav navbar-nav": element.parent.type === "navbar",
          "navbar-right": element.parent.type === "navbar" && element.properties.rightOfNavbar
        });

        var renderedListItems = renderedChildren.map(function(renderedChild, key){
          return (
            React.createElement("li", {key: key}, 
              renderedChild
            )
          );
        });

        switch (element.properties.type){
          case "ordered":
            list = (
              React.createElement("ol", null, 
                renderedListItems
              )
            );
            break;
          default :
            list = React.createElement("ul", {className: listClass}, renderedListItems)
        }
        renderedElement = list;
        break;
      case "grid":
        var width = Math.floor(12 / element.properties.columnsCount);
        width = width > 12 ? 12 : width < 1 ? 1 : width;
        var colClass = "col-xs-" + width;

        var actualRenderedChildren = renderedChildren.map(function(childElement, key){
          var offset = Number(childElements[key].properties.gridOffset);

          var offsetClass;

          if(!isNaN(offset) && offset > 0){
            offsetClass = "col-sm-offset-" + offset;
          }

          var classSet = {};
          classSet[colClass] = true;
          classSet[offsetClass] = !!offsetClass;

          var colClasses = cx(classSet);

          return (
            React.createElement("div", {className: colClasses, key: key}, 
              childElement
            )
          );
        });

        var rows = [];
        var childrenCount = actualRenderedChildren.length;

        for(var i = 0; i < Math.ceil(childrenCount/element.properties.columnsCount); i++){
          rows.push((
            React.createElement("div", {className: "row", key: i}, 
              actualRenderedChildren.splice(0, element.properties.columnsCount)
            )
          ));
        }

        renderedElement = (
          React.createElement("div", null, 
            rows
          )
        );

        break;
      case "text":
        var textClass = cx({
          "navbar-text": element.parent.type === "navbar",
          "navbar-right": element.parent.type === "navbar" && element.properties.rightOfNavbar,
          "text-center": element.properties.centered
        });

        switch (element.properties.type){
          case "free":
            renderedElement = (
              React.createElement("span", {className: textClass}, element.properties.text)
            );
            break;
          case "bold":
            renderedElement = (
              React.createElement("strong", {className: textClass, key: this.props.key}, element.properties.text)
            );
            break;
          case "italics":
            renderedElement = (
              React.createElement("em", {className: textClass, key: this.props.key}, element.properties.text)
            );
            break;
          case "paragraph":
          default:
            renderedElement = (
              React.createElement("p", {className: textClass, key: this.props.key}, element.properties.text)
            );
            break;
        }
        break;
      case "image":
        renderedElement = (
          React.createElement("img", {src: element.properties.url, width: element.properties.width})
        );
        break;
      case "navbar":
        renderedElement = (
          React.createElement("nav", {className: "navbar navbar-default"}, 
            React.createElement("div", {className: "container-fluid"}, 
              React.createElement("div", {className: "navbar-header"}, 
                React.createElement("a", {className: "navbar-brand", href: "/"}, element.properties.brand)
              ), 
              renderedChildren
            )
          )
        );

        break;
      case "jumbotron":
        renderedElement = (
          React.createElement("div", {className: "jumbotron"}, 
            React.createElement("div", {className: "container"}, 
              renderedChildren
            )
          )
        );

        break;
      case "form":
        renderedElement = (
          React.createElement(Form, {element: element, pageBuilder: this.props.pageBuilder}, 
            renderedChildren
          )
        );

        break;
      case "input":
        renderedElement = (
          React.createElement(Input, {element: element, resources: this.props.resources})
        );
        break;
      case "table":
        renderedElement = (
          React.createElement("table", {className: "table table-bordered table-condensed table-hover table-striped"}, 
            React.createElement("tbody", null, 
              renderedChildren
            )
          )
        );
        break;
      case "dataTable":
        renderedElement = (
          React.createElement("table", {className: "table table-condensed table-hover table-striped"}, 
            renderedChildren
          )
        );
        break;
      case "tableRow":
        renderedElement = (
          React.createElement("tr", null, 
            renderedChildren
          )
        );

        break;
      case "dataRows":
        renderedElement = React.createElement(DataRows, {element: element, resources: this.props.resources})
        break;
      default :
        renderedElement = (
          React.createElement("h1", null, "Unknown element: ", element.type)
        );
    }

    if(element.parent && element.parent.type === "tableRow"){
      if(element.parent.properties.isHeader || element.properties.isHeader){
        renderedElement = (
          React.createElement("th", null, 
            renderedElement
          )
        );
      }
      else{
        renderedElement = (
          React.createElement("td", null, 
            renderedElement
          )
        );
      }
    }

    if(element.properties.layout){
      return (
        React.createElement(ElementRenderer, {element: this.props.layoutPage, content: renderedElement})
      );
    }
    else{
      return renderedElement;
    }
  }
});

module.exports = ElementRenderer;
