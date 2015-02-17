module.exports = {
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
  }
};
