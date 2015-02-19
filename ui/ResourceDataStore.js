var React = require("react"),
  Reflux = require("reflux"),
  Request = require("request"),
  ResourceDataActions = require("./ResourceDataActions");

var ResourceDataStore = Reflux.createStore({
  listenables: [ResourceDataActions],
  init: function(){
    this.resourceData = {};

    this.saveSucceeded = false;
    this.saveFailed = false;
    this.saving = false;
  },
  getInitialState: function(){
    return this.emittedData();
  },
  emittedData: function(){
    return {
      resourceData: this.resourceData,
      saveSucceeded: this.saveSucceeded,
      saveFailed: this.saveFailed,
      saving: this.saving
    };
  },
  emit: function(){
    this.trigger(this.emittedData());
  },
  onSave: function(id){
    this.saveSucceeded = false;
    this.saveFailed = false;
    this.saving = true;

    this.emit();

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
        var saveSucceeded = !err && res.statusCode === 200;

        if(saveSucceeded) {
          this.resourceData[id].id = body;
        }

        this.saveSucceeded = saveSucceeded;
        this.saveFailed = !saveSucceeded;
        this.saving = false;
        this.emit();
      }.bind(this)
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
