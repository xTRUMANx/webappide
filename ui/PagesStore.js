var Reflux = require("reflux"),
  Actions = require("./PagesActions"),
  Request = require("request");

var Store = Reflux.createStore({
  listenables: [Actions],
  init: function(){
    this.loading = false;
    this.loaded = false;
    this.pages = [];
    this.deleting = {};
  },
  getInitialState: function() {
    return this.emittedData();
  },
  emittedData: function(){
    return {
      loading: this.loading,
      deleting: this.deleting,
      loaded: this.loaded,
      err: this.err,
      pages: this.pages
    };
  },
  emit: function(){
    this.trigger(this.emittedData());
  },
  onLoad: function(){
    if(this.loaded) this.emit();

    this.loading = true;
    this.emit();

    Request("http://localhost:3000/api/pages", function(err, res, body){
      if(err){
        return console.log(err);
      }

      if(res.statusCode === 200){
        var pages = JSON.parse(body);

        pages = pages || [];

        pages.forEach(function(page){
          setElementParent(page);
        });

        this.pages = pages;

        this.loaded = true;
      }
      else{
        this.err = err || res.statusCode;
        this.loaded = false;
      }

      this.loading = false;
      this.emit();
    }.bind(this));
  },
  onDelete: function(pageId){
    this.deleting[pageId] = true;
    this.emit();

    Request("http://localhost:3000/api/pages", {method: "delete", qs: {id: pageId}}, function(err, res, body){
      if(err){
        return console.log(err);
      }

      if(res.statusCode === 200){
        var page = this.pages.filter(function(p){ return p.pageId === pageId})[0];

        var pageIndex = this.pages.indexOf(page);

        this.pages.splice(pageIndex, 1);
      }
      else{
        this.err = err || res.statusCode;
      }

      delete this.deleting[pageId];
      this.emit();
    }.bind(this));
  }
});

function setElementParent(element){
  if(element.children){
    element.children.forEach(function(childElement){
      childElement.parent = element;

      setElementParent(childElement);
    });
  }

  return element;
}

module.exports = Store;
