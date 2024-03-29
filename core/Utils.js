module.exports = {
  setElementParent: function(element){
    if(element.children){
      element.children.forEach(function(childElement){
        childElement.parent = element;
        
        this.setElementParent(childElement);
      }.bind(this));
    }

    return element;
  },
  findAncestorByType: function(element, type)
  {
    if (element.type === type) {
      return element;
    }
    else if (!element.parent) {
      return null;
    }
    else {
      return this.findAncestorByType(element.parent, type);
    }
  },
  findRoot: function(element) {
    if (!element.parent) {
      return element;
    }
    else {
      return this.findRoot(element.parent);
    }
  },
  generateResourceDataId: function(element){
    var ancestorForm = this.findAncestorByType(element, "form");

    var id = this.findRoot(element).pageId + "-" + ancestorForm.id;

    return id;
  },
  generateResourceDataIdForDataEditor: function(resourceDataId){
    return "DataEditor-" + resourceDataId;
  }
};
