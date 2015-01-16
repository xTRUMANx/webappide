var React = require("react/addons"),
  cx = React.addons.classSet,
  Actions = require("./Actions");

var ElementsTree = React.createClass({
  getInitialState: function(){
    return {
      showChildren: this.props.showChildren
    }
  },
  toggleShowChildren: function(){
    this.setState({ showChildren: !this.state.showChildren });
  },
  elementSummary: function(element){
    switch (element.type){
      case "heading":
      case "text":
        return element.properties.type;
        break;
      case "link":
        return element.properties.text;
        break;
      default :
        return "";
    }
  },
  selectElement: function(element){
    Actions.selectElement(element);
  },
  deleteElement: function(element){
    Actions.deleteElement(element);
  },
  moveUp: function(element){
    Actions.moveUp(element);
  },
  moveDown: function(element){
    Actions.moveDown(element);
  },
  render: function(){
    var element = this.props.tree,
      key = this.props.key;

    if(!element) return null;

    var childElements = element.children || [];

    var renderedChildElements = null;

    if(this.state.showChildren){
      renderedChildElements = childElements.map(function(childElement, index){
        return <ElementsTree tree={childElement} key={index} selectedElement={this.props.selectedElement} />
      }.bind(this));
    }

    var summary = this.elementSummary(element);

    if(summary){
      summary = "- " + summary;
    }

    var showTreeToggler = !!childElements.length;

    var treeToggler = null;

    if(showTreeToggler){
      var iconClass = cx({
        glyphicon: true,
        "glyphicon-chevron-right": this.state.showChildren,
        "glyphicon-chevron-down": !this.state.showChildren
      });

      var title = this.state.showChildren ? "Collapse" : "Expand";

      treeToggler = (
        <a className="clickable slight-margin" title={title} onClick={this.toggleShowChildren}>
          <span className={iconClass}></span>
        </a>
      );
    }

    var elementClass = cx({
      clickable: true,
      "slight-margin": true,
      elementIsSelected: element === this.props.selectedElement
    });

    var moveUpClass = cx({
      clickable: element.parent && element.parent.children.indexOf(element) !== 0,
      hoverOnly: true,
      disabled: element.parent && element.parent.children.indexOf(element) === 0
    });

    var moveDownClass = cx({
      clickable: element.parent && element.parent.children.indexOf(element) !== element.parent.children.length - 1,
      hoverOnly: true,
      disabled: element.parent && element.parent.children.indexOf(element) === element.parent.children.length - 1
    });

    return (
      <ul className="tree" key={key}>
        <li className="elementTreeNode">
          <div className="elementTreeInfo">
            {treeToggler}
            <a className={elementClass} title={element.id} onClick={this.selectElement.bind(this, element)}>{element.type} {summary}</a>
            <a className={moveUpClass} onClick={this.moveUp.bind(this, element)}><span className="glyphicon glyphicon-arrow-up"></span></a>
            <a className={moveDownClass} onClick={this.moveDown.bind(this, element)}><span className="glyphicon glyphicon-arrow-down"></span></a>
            <a className="clickable hoverOnly slight-margin" onClick={this.deleteElement.bind(this, element)}><span className="glyphicon glyphicon-remove text-danger"></span></a>
          </div>
          {renderedChildElements}
        </li>
      </ul>
    );
  }
});

module.exports = ElementsTree;
