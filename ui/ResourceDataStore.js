var React = require("react"),
  Reflux = require("reflux"),
  ResourceDataActions = require("./ResourceDataActions");

var ResourceDataStore = Reflux.createStore({
  listenables: [ResourceDataActions],
  init: function(){
    this.resourceData = {};
  },
  getInitialState: function(){
    return this.emittedData();
  },
  emittedData: function(){
    return this.resourceData;
  },
  emit: function(){
    this.trigger(this.emittedData());
  },
  onSave: function(id){
    // TODO: Make AJAX Request instead
    console.log("save resource data", id, this.resourceData[id])

    this.emit();
  },
  onNewResourceData: function(id){
    this.resourceData[id] = {};

    this.emit();
  },
  onUpdateResourceDataProperty: function(propertyKey, id, value){
    this.resourceData[id] = this.resourceData[id] || {};

    this.resourceData[id][propertyKey] = value;

    this.emit();
  }
});

module.exports = ResourceDataStore;
