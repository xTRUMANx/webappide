var React = require("react/addons"),
  ReactRouter = require("react-router"),
  Reflux = require("reflux"),
  ElementsStore = require("./ElementsStore"),
  ElementsActions = require("./ElementsActions");

var elementsPropertiesSchema = require("./ElementsPropertiesSchema");

var ElementsProperties = require("./ElementsProperties");

var ElementsTree = require("./ElementsTree");

var ElementRenderer = require("./ElementRenderer");

var ProgressBar = require("./ProgressBar");

var PageDesigner = React.createClass({
  mixins: [Reflux.connect(ElementsStore), ReactRouter.State],
  getInitialState: function(){
    return {siteId: this.getParams().siteId};
  },
  componentDidMount: function(){
    var pageId = this.getParams().pageId;

    if(pageId) {
      ElementsActions.load(pageId, this.state.siteId);
    }
    else{
      ElementsActions.newPage(this.state.siteId);
    }

    ElementsActions.loadPages();
    ElementsActions.loadLayoutPages();
    ElementsActions.loadResources();
  },
  save: function(){
    this.setState({saveErr: null, saving: true, saved: false});

    ElementsActions.save(function(err){
      if(err){
        return this.setState({saveErr: err});
      }
      else{
        this.setState({saved: true});
      }

      this.setState({saving: false});
    }.bind(this));
  },
  render: function(){
    if(this.state.loading) {
      return (
        <ProgressBar message="Loading" />
      );
    }

    if(this.state.err) {
      return <p className="alert alert-danger">Failed to load data. Try refreshing. {this.state.err}</p>;
    }

    return (
      <div className="row">
        <div id="elementProperties" className="col-xs-12">
          <button className="btn btn-primary" type="button" disabled={this.state.saving} onClick={this.save}>Save</button>
          {this.state.saving ? <ProgressBar message="Saving" /> : null }
          {this.state.saveErr ? <p className="alert alert-danger">Failed to save data. Try again later. {this.state.err}</p> : null}
          <hr />
          <ElementsProperties element={this.state.selectedElement} rootElement={this.state.elementsTree} layoutPages={this.state.layoutPages} pages={this.state.pages} resourceOptions={this.state.resourceOptions} resourcePropertiesOptions={this.state.resourcePropertiesOptions} resources={this.state.resources} elementsPropertiesSchema={elementsPropertiesSchema} />
        </div>
        <div id="elementsTree" className="col-xs-4">
          <h2>Elements Tree</h2>
          <ElementsTree tree={this.state.elementsTree} selectedElement={this.state.selectedElement} showChildren={true} />
        </div>
        <div className="col-xs-8">
          <ElementRenderer element={this.state.elementsTree} layoutPage={this.state.layoutPage} resources={this.state.resources} pageBuilder={true} siteId={this.state.siteId} />
        </div>
      </div>
    );
  }
});

module.exports = PageDesigner;
