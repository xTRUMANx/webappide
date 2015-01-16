var Reflux = require("reflux"),
  Actions = require("./Actions"),
  Data = require("./SamplePage");

var Store = Reflux.createStore({
  listenables: [Actions],
  init: function(){
    this.data = Data;
    this.selectedElement = Data;
  },
  getInitialState: function() {
    return { elementsTree: this.data, selectedElement: this.data };
  },
  onAddChildElement: function(newElementType, parentElement){
    var newElement = { type: newElementType, nextChildId: 0, parent: parentElement, children: [] };

    newElement.id = parentElement.id + "." + parentElement.nextChildId++;

    switch (newElementType){
      case "heading":
        newElement.properties = { type: "1" };
        newElement.children.push({id: newElement.id + "." + newElement.nextChildId++, nextChildId: 0, type: "text", parent: newElement, properties: {type:"free", text: "New Heading"}});
        break;
      case "link":
        newElement.properties = { type: "external", location: "#" };
        newElement.children.push({id: newElement.id + "." + newElement.nextChildId++, nextChildId: 0, type: "text", parent: newElement, properties: {type:"free", text: "New Link"}});
        break;
      case "list":
        var childElement;

        if(newElement.parent.type !== "navbar") {
          childElement = {id: newElement.id + "." + newElement.nextChildId++, nextChildId: 0, type: "text", parent: newElement, properties: {type: "free", text: "New List Item"}};
        }
        else{
          childElement = {id: newElement.id + "." + newElement.nextChildId++, nextChildId: 0, type: "link", parent: newElement, properties: { type: "external", location: "#" }, children: [{type: "text", parent: newElement, properties: {type:"free", text: "New Link"}}]};
        }

        newElement.properties = { type: "unordered" };
        newElement.children.push(childElement);
        break;
      case "text":
        newElement.properties = { type: "free", text: "New Text" };
        break;
      case "navbar":
        newElement.properties = { brand: "Brand" };
        break;
      case "grid":
        newElement.properties = { columnsCount: 1 };
        break;
    };

    newElement.parent = parentElement;

    parentElement.children.push(newElement);

    this.selectedElement = newElement;

    this.trigger({ elementsTree: this.data, selectedElement: this.selectedElement });
  },
  onAddParentElement: function(newElementType, childElement){
    var newElement = { id: childElement.id, nextChildId: 0, type: newElementType, parent: childElement.parent, children: [] };

    switch (newElementType){
      case "heading":
        newElement.properties = { type: "1" };
        break;
      case "link":
        newElement.properties = { type: "external", location: "#" };
        break;
      case "list":
        newElement.properties = { type: "unordered" };
        break;
      case "text":
        newElement.properties = { type: "free", text: "New Text" };
        break;
      case "navbar":
        newElement.properties = { brand: "Brand" };
        break;
      case "grid":
        newElement.properties = { columnsCount: 1 };
        break;
    }

    newElement.children.push(childElement);

    resetChildIds(childElement, newElement);

    var index = newElement.parent.children.indexOf(childElement);

    newElement.parent.children.splice(index, 1, newElement);

    this.trigger({ elementsTree: this.data, selectedElement: newElement });
  },
  onDeleteElement: function(element){
    var parent = element.parent;

    parent.children.splice(parent.children.indexOf(element), 1);

    this.selectedElement = parent;

    this.trigger({ elementsTree: this.data, selectedElement: this.selectedElement });
  },
  onSelectElement: function(element){
    this.selectedElement = element;

    this.trigger({ selectedElement: this.selectedElement });
  },
  onUpdateElementProperty: function(element, propertyKey, value){
    element.properties[propertyKey] = value;

    this.trigger({ elementsTree: this.data });
  },
  onMoveUp: function(element){
    var parent = element.parent;

    var elementIndex = parent.children.indexOf(element);

    if(elementIndex === 0){
      return;
    }

    parent.children.splice(elementIndex, 1);

    parent.children.splice(elementIndex - 1, 0, element);

    this.trigger({ elementsTree: this.data });
  },
  onMoveDown: function(element){
    var parent = element.parent;

    var elementIndex = parent.children.indexOf(element);

    if(elementIndex === parent.children.length - 1){
      return;
    }

    parent.children.splice(elementIndex, 1);

    parent.children.splice(elementIndex + 1, 0, element);

    this.trigger({ elementsTree: this.data });
  }
});

function resetChildIds(element, parentElement){
  element.id = parentElement.id + "." + parentElement.nextChildId++;

  if(element.children && element.children.length) {
    element.children.map(function(child){
      resetChildIds(child, element);
    })
  }
}

module.exports = Store;
