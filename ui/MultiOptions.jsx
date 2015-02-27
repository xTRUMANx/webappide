var React = require("react");

var MultiOptions = React.createClass({
  getInitialState: function(){
    var availableOptions = this.props.options.
      filter(function(option){
        return this.props.selectedOptions.indexOf(option.value) === -1
      }.bind(this)).
      map(function(option){
      return {
        label: option.label,
        value: option.value
      }
    });

    console.log(this.props.selectedOptions)
    var selectedOptions = this.props.options.
      filter(function(option){
        return this.props.selectedOptions.indexOf(option.value) > -1
      }.bind(this)).
      sort(function(a, b){
        return this.props.selectedOptions.indexOf(a.value) > this.props.selectedOptions.indexOf(b.value);
      }.bind(this)).
      map(function(option){
        return {
          label: option.label,
          value: option.value
        }
      });

    return {
      availableOptions: availableOptions,
      selectedOptions: selectedOptions
    };
  },
  moveAllLeft: function(e){
    e.preventDefault();

    this.setState({
      availableOptions: this.props.options,
      selectedOptions: []
    });

    var event = {
      target: {
        value: []
      }
    };

    this.props.onChange(event);
  },
  moveSelectedLeft: function(e){
    e.preventDefault();

    var value = this.refs.selectedOptions.getDOMNode().value;

    if(value){
      var option = this.state.selectedOptions.filter(function(option){return option.value == value})[0];

      var index = this.state.selectedOptions.indexOf(option);

      this.state.selectedOptions.splice(index, 1);
      this.state.availableOptions.push(option);

      this.setState({
        selectedOptions: this.state.selectedOptions,
        availableOptions: this.state.availableOptions
      });

      var event = {
        target: {
          value: this.state.selectedOptions.map(function(option){return option.value})
        }
      };

      this.props.onChange(event);
    }
  },
  moveSelectedRight: function(e){
    e.preventDefault();

    var value = this.refs.availableOptions.getDOMNode().value;

    if(value){
      var option = this.state.availableOptions.filter(function(option){return option.value == value})[0];

      var index = this.state.availableOptions.indexOf(option);

      this.state.availableOptions.splice(index, 1);
      this.state.selectedOptions.push(option);

      this.setState({
        availableOptions: this.state.availableOptions,
        selectedOptions: this.state.selectedOptions
      });

      var event = {
        target: {
          value: this.state.selectedOptions.map(function(option){return option.value})
        }
      };

      this.props.onChange(event);
    }
  },
  moveAllRight: function(e){
    e.preventDefault();

    this.setState({
      availableOptions: [],
      selectedOptions: this.props.options
    });

    var event = {
      target: {
        value: this.props.options.map(function(option){return option.value})
      }
    };

    this.props.onChange(event);
  },
  moveSelectedUp: function(e){
    e.preventDefault();

    var value = this.refs.selectedOptions.getDOMNode().value;

    if(value){
      var option = this.state.selectedOptions.filter(function(option){ return option.value == value})[0];

      var index = this.state.selectedOptions.indexOf(option);

      if(index !== 0){
        this.state.selectedOptions.splice(index, 1);

        this.state.selectedOptions.splice(index - 1, 0, option);

        this.setState({
          selectedOptions: this.state.selectedOptions
        });

        var event = {
          target: {
            value: this.state.selectedOptions.map(function(option){return option.value})
          }
        };

        this.props.onChange(event);
      }
    }
  },
  moveSelectedDown: function(e){
    e.preventDefault();

    var value = this.refs.selectedOptions.getDOMNode().value;

    if(value){
      var option = this.state.selectedOptions.filter(function(option){ return option.value == value})[0];

      var index = this.state.selectedOptions.indexOf(option);

      if(index !== this.state.selectedOptions.length - 1){
        this.state.selectedOptions.splice(index, 1);

        this.state.selectedOptions.splice(index + 1, 0, option);

        this.setState({
          selectedOptions: this.state.selectedOptions
        });

        var event = {
          target: {
            value: this.state.selectedOptions.map(function(option){return option.value})
          }
        };

        this.props.onChange(event);
      }
    }
  },
  render: function(){
    var availableOptions = this.state.availableOptions.map(function(option){
      return (
        <option value={option.value} key={option.value}>{option.label}</option>
      );
    });

    var selectedOptions = this.state.selectedOptions.map(function(option){
      return (
        <option value={option.value} key={option.value}>{option.label}</option>
      );
    });

    return (
      <div className="row">
        <div className="col-sm-4">
          <h4>Available Options</h4>
          <select className="form-control" size={4} ref="availableOptions">
            {availableOptions}
          </select>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-default col-sm-12" onClick={this.moveAllLeft}>
            <span className="glyphicon glyphicon-chevron-left"></span>
            <span className="glyphicon glyphicon-chevron-left"></span>
          </button>
          <button className="btn btn-default col-sm-12" onClick={this.moveSelectedLeft}>
            <span className="glyphicon glyphicon-chevron-left"></span>
          </button>
          <button className="btn btn-default col-sm-12" onClick={this.moveSelectedRight}>
            <span className="glyphicon glyphicon-chevron-right"></span>
          </button>
          <button className="btn btn-default col-sm-12" onClick={this.moveAllRight}>
            <span className="glyphicon glyphicon-chevron-right"></span>
            <span className="glyphicon glyphicon-chevron-right"></span>
          </button>
        </div>
        <div className="col-sm-4">
          <h4>Selected Options</h4>
          <select className="form-control" size={4} ref="selectedOptions">
            {selectedOptions}
          </select>
        </div>
        <div className="col-sm-2">
          <button className="btn btn-default col-sm-12" onClick={this.moveSelectedUp}>
            <span className="glyphicon glyphicon-chevron-up"></span>
          </button>
          <button className="btn btn-default col-sm-12" onClick={this.moveSelectedDown}>
            <span className="glyphicon glyphicon-chevron-down"></span>
          </button>
        </div>
      </div>
    );
  }
});

module.exports = MultiOptions;
