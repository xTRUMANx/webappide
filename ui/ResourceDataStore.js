var React = require("react"),
  Reflux = require("reflux"),
  Request = require("request"),
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
    var data = this.resourceData[id];

    Request({
      url: "http://localhost:3000/api/resourceData",
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: data,
      json: true
      }, function(err, res, body){
        // TODO: Figure out what should happen if save succeeds or fails
        console.log(arguments)
      }
    );

    this.emit();
  },
  onNewResourceData: function(id, resourceId){
    this.resourceData[id] = { resourceId: resourceId, data: {} };

    this.emit();
  },
  onUpdateResourceDataProperty: function(propertyKey, id, value){
    this.resourceData[id] = this.resourceData[id] || { data: {} };

    this.resourceData[id].data[propertyKey] = value;

    this.emit();
  }
});

module.exports = ResourceDataStore;
