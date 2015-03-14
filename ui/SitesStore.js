var Reflux = require("reflux"),
  Request = require("request"),
  SitesActions = require("./SitesActions");

var SitesStore = Reflux.createStore({
  listenables: [SitesActions],
  init: function(){
    this.saveFailed = false;
    this.saving = false;
  },
  getInitialState: function(){
    return this.emittedData();
  },
  emittedData: function(){
    return {
      saveFailed: this.saveFailed,
      saving: this.saving,
      loadingSite: this.loadingSite,
      loadingSiteFailed: this.loadingSiteFailed,
      loadingSites: this.loadingSites,
      loadingSitesFailed: this.loadingSiteFailed,
      loadedSite: this.loadedSite,
      loadedSites: this.loadedSites
    };
  },
  emit: function(){
    this.trigger(this.emittedData());
  },
  onCreateSite: function(site, cb){
    this.saveFailed = false;
    this.saving = true;
    this.emit();

    Request({
      url: "http://localhost:3000/api/sites",
      method: "POST",
      json: true,
      body: site
    }, function(err, res, body){
      var saveSucceeded = !err && res.statusCode === 200;

      if(saveSucceeded) {
        cb(body.id);
      }

      this.saveFailed = !saveSucceeded;
      this.saving = false;
      this.emit();
    }.bind(this));
  },
  onLoadSite: function(id){
    this.loadingSite = true;
    this.loadingSiteFailed = false;
    this.emit();

    Request({
      url: "http://localhost:3000/api/sites",
      qs: {id: id}
    }, function(err, res, body){
      var loadSucceeded = !err && res.statusCode === 200;

      if(loadSucceeded){
        this.loadedSite = JSON.parse(body);
      }

      this.loadSiteFailed = !loadSucceeded;
      this.loadingSite = false;
      this.emit();
    }.bind(this));
  },
  onLoadSites: function(){
    this.loadingSites = true;
    this.loadingSitesFailed = false;
    this.emit();

    Request({
      url: "http://localhost:3000/api/sites",
    }, function(err, res, body){
      var loadSucceeded = !err && res.statusCode === 200;

      if(loadSucceeded){
        this.loadedSites = JSON.parse(body);
      }

      this.loadingSitesFailed = !loadSucceeded;
      this.loadingSites = false;
      this.emit();
    }.bind(this));
  },
  onLoadSite: function(siteId){
    this.loadingSite = true;
    this.loadingSiteFailed = false;
    this.emit();

    Request({
      url: "http://localhost:3000/api/sites",
      qs: {id: siteId}
    }, function(err, res, body){
      var loadSucceeded = !err && res.statusCode === 200;

      if(loadSucceeded){
        this.loadedSite = JSON.parse(body);
      }

      this.loadingSiteFailed = !loadSucceeded;
      this.loadingSite = false;
      this.emit();
    }.bind(this));
  },
  onDeletePage: function(page){
    var pageId = page.id;

    this.emit();

    Request("http://localhost:3000/api/pages", {method: "delete", qs: {id: pageId}}, function(err, res, body){
      if(err){
        return console.log(err);
      }

      if(res.statusCode === 200){
        var page = this.loadedSite.pages.filter(function(p){ return p.pageId === pageId})[0];

        var pageIndex = this.loadedSite.pages.indexOf(page);

        this.loadedSite.pages.splice(pageIndex, 1);

        SitesActions.deletePage.completed();
      }
      else{
        this.err = err || res.statusCode;

        SitesActions.deletePage.failed(this.err);
      }

      this.emit();
    }.bind(this));

    return 42;
  }
});

module.exports = SitesStore;
