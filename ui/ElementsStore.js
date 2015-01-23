var Reflux = require("reflux"),
  Actions = require("./ElementsActions"),
  Request = require("request");

var Store = Reflux.createStore({
  listenables: [Actions],
  init: function(){
    this.layoutPages = [];
  },
  getInitialState: function(){
    return this.emittedData();
  },
  emittedData: function(){
    return {
      loading: this.loading,
      loaded: this.loaded,
      err: this.err,
      elementsTree: this.page,
      selectedElement: this.selectedElement,
      pages: this.pages,
      layoutPages: this.layoutPages,
      layoutPage: this.layoutPage
    };
  },
  emit: function(){
    this.trigger(this.emittedData());
  },
  onNewPage: function(){
    var page = {
      id: "0",
      nextChildId: 0,
      type: "page",
      properties: {
        title: "New Page"
      },
      children: []
    };

    this.page = page;
    this.selectedElement = page;

    this.emit();
  },
  onLoad: function(pageId){
    if(this.loaded) this.emit();

    this.loading = true;

    this.emit();

    Request("http://localhost:3000/api/pages?id=" + pageId, function(err, res, body){
      if(err){
        return console.log(err);
      }

      if(res.statusCode === 200){
        this.loaded = true;

        var parsedResponse = JSON.parse(body);

        if(parsedResponse.layoutPage) {
          this.layoutPage = setElementParent(parsedResponse.layoutPage);
        }

        var page = parsedResponse.page;
        page = setElementParent(page);
        this.page = page;
        this.selectedElement = page;
      }
      else{
        this.err = err || res.statusCode;
        this.loaded = false;
      }

      this.loading = false;

      this.emit();
    }.bind(this));
  },
  onLoadLayoutPages: function(){
    Request("http://localhost:3000/api/pages?layoutsPagesOnly=true", function(err, res, body){
      if(err){
        return console.log(err);
      }

      if(res.statusCode === 200){
        var layoutPages = JSON.parse(body);
        layoutPages = setElementParent(layoutPages);
        this.layoutPages = layoutPages.map(function(layoutPage){
          return {
            label: layoutPage.properties.title,
            value: layoutPage.pageId
          };
        });
      }
      else{
        this.err = err || res.statusCode;
      }

      this.emit();
    }.bind(this));
  },
  onLoadPages: function(){
    Request("http://localhost:3000/api/pages", function(err, res, body){
      if(err){
        return console.log(err);
      }

      if(res.statusCode === 200){
        var pages = JSON.parse(body);
        pages = setElementParent(pages);
        this.pages = pages.map(function(page){
          return {
            label: page.properties.title,
            value: page.pageId
          };
        });
      }
      else{
        this.err = err || res.statusCode;
      }

      this.emit();
    }.bind(this));
  },
  onSave: function(cb){
    var page = JSON.stringify(this.page, function(key, value){
      if(key === "parent" && value){
        return value.id;
      }
      else{
        return value;
      }
    });

    Request({
      url: "http://localhost:3000/api/pages",
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: page
    }, function(err, res, body){
      if(!this.page.pageId){
        this.page.pageId = JSON.parse(body).pageId;

        this.emit();
      }
      cb(err);
    }.bind(this));
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
          childElement = {id: newElement.id + "." + newElement.nextChildId++, nextChildId: 0, type: "link", parent: newElement, properties: { type: "external", location: "#" }, children: []};
          childElement.children.push({id: childElement.id + "." + childElement.nextChildId++, nextChildId: 0, type: "text", parent: newElement, properties: {type:"free", text: "New Link"}});
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
      case "content":
        newElement.properties = {};
        this.page.contentElement = newElement.id;
        break;
    }

    newElement.parent = parentElement;

    parentElement.children.push(newElement);

    this.selectedElement = newElement;

    this.emit();
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
      case "content":
        this.page.contentElement = newElement.id;
        break;
    }

    newElement.children.push(childElement);

    resetChildIds(childElement, newElement);

    var index = newElement.parent.children.indexOf(childElement);

    newElement.parent.children.splice(index, 1, newElement);

    this.emit();
  },
  onDeleteElement: function(element){
    var parent = element.parent;

    parent.children.splice(parent.children.indexOf(element), 1);

    this.selectedElement = parent;

    if(element.type === "content"){
      delete this.page.contentElement;
    }

    this.emit();
  },
  onSelectElement: function(element){
    this.selectedElement = element;

    this.emit();
  },
  onUpdateElementProperty: function(elementId, propertyKey, value){
    var element = findElementById(elementId, this.page);

    element.properties[propertyKey] = value;

    this.emit();
  },
  onMoveUp: function(element){
    var parent = element.parent;

    var elementIndex = parent.children.indexOf(element);

    if(elementIndex === 0){
      return;
    }

    parent.children.splice(elementIndex, 1);

    parent.children.splice(elementIndex - 1, 0, element);

    this.emit();
  },
  onMoveDown: function(element){
    var parent = element.parent;

    var elementIndex = parent.children.indexOf(element);

    if(elementIndex === parent.children.length - 1){
      return;
    }

    parent.children.splice(elementIndex, 1);

    parent.children.splice(elementIndex + 1, 0, element);

    this.emit();
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

function setElementParent(element){
  if(element.children){
    element.children.forEach(function(childElement){
      childElement.parent = element;

      setElementParent(childElement);
    });
  }

  return element;
}

function findElementById(elementId, elementsTree){
  if(elementsTree.id === elementId){
    return elementsTree;
  }
  else if(elementId.indexOf(elementsTree.id) !== 0 || !elementsTree.children || !elementsTree.children.length){
    return null;
  }
  else {
    var childElement = elementsTree.children.filter(function(child){
      return elementId.indexOf(child.id) === 0;
    })[0];

    return findElementById(elementId, childElement);
  }
}

module.exports = Store;