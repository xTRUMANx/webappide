var Reflux = require("reflux"),
  Actions = require("./ElementsActions"),
  ElementsPropertiesSchema = require("./ElementsPropertiesSchema"),
  Request = require("request"),
  Utils = require("./Utils");

var Store = Reflux.createStore({
  listenables: [Actions],
  init: function(){
    this.layoutPages = [];
    this.resourceOptions = [];
    this.resources = [];
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
      layoutPage: this.layoutPage,
      resourceOptions: this.resourceOptions,
      resources: this.resources,
      resourcePropertiesOptions: this.resourcePropertiesOptions
    };
  },
  emit: function(){
    this.trigger(this.emittedData());
  },
  onNewPage: function(siteId){
    this.siteId = siteId;

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
  onLoad: function(pageId, siteId){
    this.siteId = siteId;

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
          this.layoutPage = Utils.setElementParent(parsedResponse.layoutPage);
        }

        var page = parsedResponse.page;
        page = Utils.setElementParent(page);
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
        layoutPages = Utils.setElementParent(layoutPages);
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
        pages = Utils.setElementParent(pages);
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
  onLoadResources: function(){
    Request("http://localhost:3000/api/resources", function(err, res, body){
      if(err){
        return console.log(err);
      }

      if(res.statusCode === 200){
        var resources = JSON.parse(body);
        resources = Utils.setElementParent(resources);
        this.resources = resources;
        this.resourceOptions = resources.map(function(resource){
          return {
            label: resource.name,
            value: resource.id
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
      qs: {siteId: this.siteId},
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
    var newElement = { type: newElementType, nextChildId: 0, parent: parentElement, children: [], properties: {} };

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

    var elementPropertySchema = ElementsPropertiesSchema[element.type][propertyKey];

    var sanitizer = elementPropertySchema.sanitizer;

    if(sanitizer){
      value = sanitizer(value);
    }

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
  },
  resourcePropertiesOptions: function(element){
    var ancestorType = element.type === "input" ? "form" : "dataTable";

    var ancestor = findAncestorByType(element, ancestorType);

    if(!ancestor || !ancestor.properties.resource) return [];

    var resource = this.resources.filter(function(r){
      return r.id === ancestor.properties.resource;
    })[0];

    return resource.properties.filter(function(p){return p.name !== "id";}).map(function(p){
      return {
        label: p.name,
        value: p.id
      }
    });
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

function findAncestorByType(element, type){
  if(element.type === type){
    return element;
  }
  else if(!element.parent){
    return null;
  }
  else {
    return findAncestorByType(element.parent, type);
  }
}

module.exports = Store;
