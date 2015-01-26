var Reflux = require("reflux"),
  ResourcesActions = require("./ResourcesActions"),
  Request = require("request");

var ResourcesStore = Reflux.createStore({
  listenables: [ResourcesActions],
  init: function(){
    this.resource = {
      nextPropertyId: 2,
      properties: [{id: 1, name: "id", type: "number", uneditable: true}]
    };
  },
  getInitialState: function(){
    return this.emittedData();
  },
  emittedData: function(){
    return {
      resource: this.resource,
      saving: this.saving,
      err: this.err
    };
  },
  emit: function(){
    this.trigger(this.emittedData());
  },
  onLoad: function(id){
    this.loading = true;
    this.err = false;

    this.emit();

    Request("http://localhost:3000/api/resources?id=" + id, function(err, res, body){
      this.resource = JSON.parse(body);

      this.loading = false;
      this.emit();
    }.bind(this));
  },
  onAddProperty: function(){
    var newProperty = {id: this.resource.nextPropertyId++};

    this.resource.properties.push(newProperty);

    this.emit();
  },
  onRemoveProperty: function(property){
    var resourceProperty = this.resource.properties.filter(function(p){ return p.id === property.id })[0];

    var index = this.resource.properties.indexOf(resourceProperty);

    this.resource.properties.splice(index, 1);

    this.emit();
  },
  onUpdateProperty: function(property, propertyKey, value){
    var resourceProperty = this.resource.properties.filter(function(p){ return p.id === property.id })[0];

    resourceProperty[propertyKey] = value;

    this.emit();
  },
  onUpdate: function(key, value){
    this.resource[key] = value;

    this.emit();
  },
  onSave: function(){
    this.saving = true;
    this.err = false;

    this.emit();

    Request({
      url: "http://localhost:3000/api/resources",
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(this.resource)
    }, function(err, res, body){
      this.err = err || (res.statusCode !== 200 && res.statusCode);

      if(!this.err && !this.resource.id){
        this.resource.id = JSON.parse(body).id;
      }

      this.saving = false;
      this.emit();
    }.bind(this));
  }
});

module.exports = ResourcesStore;
