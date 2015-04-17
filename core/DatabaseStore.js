var Reflux = require("reflux"),
  DatabaseActions = require("./DatabaseActions"),
  Request = require("request"),
  Config = require("./config");

var DatabaseStore = Reflux.createStore({
  listenables: [DatabaseActions],
  init: function(){
    this.resources = [];
  },
  getInitialState: function(){
    return this.emittedData();
  },
  emittedData: function(){
    return {
      resources: this.resources,
      err: this.err,
      loading: this.loading
    };
  },
  emit: function(){
    this.trigger(this.emittedData());
  },
  onLoadResources: function(){
    this.loading = true;
    this.err = false;
    this.emit();

    Request(Config.apiUrls.resources, function(err, res, body){
      this.err = err || (res.statusCode !== 200 && res.statusCode);

      if(!this.err){
        this.resources = JSON.parse(body);
      }

      this.loading = false;
      this.emit();
    }.bind(this));
  }
});

module.exports = DatabaseStore;
