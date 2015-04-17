var React = require("react"),
  Reflux = require("reflux"),
  Request = require("request"),
  ResourceDataActions = require("./ResourceDataActions"),
  Config = require("./config");

var ResourceDataStore = Reflux.createStore({
  listenables: [ResourceDataActions],
  init: function(){
    this.resourceData = {};
    this.allResourceData = {};

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
      allResourceData: this.allResourceData,
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
      url: Config.apiUrls.resourceData,
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
  onNewResourceData: function(id, resourceId, resourceData){
    this.resourceData[id] = resourceData || {};

    this.resourceData[id].resourceId = resourceId;
    this.resourceData[id].data = this.resourceData[id].data || {};

    this.saveSucceeded = false;
    this.saveFailed = false;
    this.saving = false;

    this.emit();
  },
  onUpdateResourceDataProperty: function(propertyKey, id, value){
    this.resourceData[id] = this.resourceData[id] || { data: {} };

    this.resourceData[id].data[propertyKey] = value;

    this.emit();
  },
  onLoadAll: function(resourceId){
    this.loading = true;
    this.err = false;

    this.emit();

    Request(Config.apiUrls.resourceData + "?resourceId=" + resourceId, function(err, res, body){
      this.allResourceData[resourceId] = JSON.parse(body);

      this.loading = false;
      this.emit();
    }.bind(this));
  }
});

module.exports = ResourceDataStore;
