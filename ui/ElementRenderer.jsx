var React = require("react/addons"),
  cx = React.addons.classSet;

var ElementRenderer = React.createClass({
  render: function(){
    var element = this.props.element;

    if(!element) return null;

    var renderedElement;

    var childElements = element.children || [];

    var renderedChildren = childElements.map(function(childElement, index){
      return <ElementRenderer element={childElement} key={index} />;
    });

    switch (element.type){
      case "page":
        renderedElement = (
          <div>
            {renderedChildren}
          </div>
        );
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
        renderedElement = (
          <a href={element.properties.location}>{renderedChildren}</a>
        );
        break;
      case "list":
        var list;

        var listClass = cx({
          "nav navbar-nav": element.parent.type === "navbar",
          "navbar-right": element.parent.type === "navbar" && element.properties.rightOfNavbar
        });

        var renderedListItems = renderedChildren.map(function(renderedChild, key){
          return (
            <li key={key}>
              {renderedChild}
            </li>
          );
        });

        switch (element.properties.type){
          case "ordered":
            list = (
              <ol>
                {renderedListItems}
              </ol>
            );
            break;
          default :
            list = <ul className={listClass}>{renderedListItems}</ul>
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
            <div className={colClasses} key={key}>
              {childElement}
            </div>
          );
        });

        var rows = [];
        var childrenCount = actualRenderedChildren.length;

        for(var i = 0; i < Math.ceil(childrenCount/element.properties.columnsCount); i++){
          rows.push((
            <div className="row" key={i}>
              {actualRenderedChildren.splice(0, element.properties.columnsCount)}
            </div>
          ));
        }

        renderedElement = (
          <div>
            {rows}
          </div>
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
              <span className={textClass}>{element.properties.text}</span>
            );
            break;
          case "bold":
            renderedElement = (
              <strong className={textClass} key={this.props.key}>{element.properties.text}</strong>
            );
            break;
          case "italics":
            renderedElement = (
              <em className={textClass} key={this.props.key}>{element.properties.text}</em>
            );
            break;
          case "paragraph":
          default:
            renderedElement = (
              <p className={textClass} key={this.props.key}>{element.properties.text}</p>
            );
            break;
        }
        break;
      case "image":
        renderedElement = (
          <img src={element.properties.url} width={element.properties.width} />
        );
        break;
      case "navbar":
        renderedElement = (
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header">
                <a className="navbar-brand" href="/">{element.properties.brand}</a>
              </div>
              {renderedChildren}
            </div>
          </nav>
        );

        break;
      case "jumbotron":
        renderedElement = (
          <div className="jumbotron">
            <div className="container">
              {renderedChildren}
            </div>
          </div>
        );

        break;
      default :
        renderedElement = (
          <h1>Unknown element: {element.type}</h1>
        );
    }

    return renderedElement;
  }
});

module.exports = ElementRenderer;