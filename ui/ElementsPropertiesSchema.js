// Navbar dropdown - screw it cuz it requires bootstrap.js and jquery
// navbar-right DONE
// navbar-text DONE
// Grid, rows DONE
// Grid offsets? DONE!
// text-center DONE
// Jumbotron DONE
// Panels
// Carousel?

var elementsPropertiesSchema = {
  page: {
    title: {
      valueType: "text"
    },
    layout: {
      valueType: "options",
      values: "layoutPages"
    }
  },
  heading: {
    type: {
      valueType: "options",
      values: [1, 2, 3, 4, 5, 6]
    },
    centered: {
      valueType: "checkbox"
    }
  },
  link: {
    type: {
      valueType: "options",
      values: ["internal", "external"]
    },
    location: {
      valueType: "text",
      ifSiblingEquals: {
        sibling: "type",
        value: "external"
      }
    },
    page: {
      valueType: "options",
      values: "pages",
      ifSiblingEquals: {
        sibling: "type",
        value: "internal"
      }
    }
  },
  list: {
    type: {
      valueType: "options",
      values: ["unordered", "ordered"]
    },
    rightOfNavbar: {
      valueType: "checkbox",
      ifChildOf: ["navbar"]
    }
  },
  text: {
    type: {
      valueType: "options",
      values: ["free", "paragraph", "bold", "italics"]
    },
    text: {
      valueType: "text"
    },
    rightOfNavbar: {
      valueType: "checkbox",
      ifChildOf: ["navbar"]
    },
    centered: {
      valueType: "checkbox"
    }
  },
  image: {
    url: {
      valueType: "text"
    },
    width: {
      valueType: "number"
    }
  },
  navbar: {
    brand: {
      valueType: "text"
    }
  },
  grid: {
    columnsCount: {
      valueType: "number",
      min: 1,
      max: 12
    }
  },
  jumbotron: {
  },
  content: {
  },
  form: {
    resource: {
      valueType: "options",
      values: "resourceOptions",
      sanitizer: Number
    }
  },
  input: {
    resourceProperty: {
      valueType: "options",
      values: "resourcePropertiesOptions",
      sanitizer: Number
    }
  },
  table: {
  },
  dataTable: {
    resource: {
      valueType: "options",
      values: "resourceOptions",
      sanitizer: Number
    }
  },
  tableRow: {
    isHeader: {
      valueType: "checkbox"
    }
  },
  dataRows: {
    // TODO: Change valueType to multi-something that presents two columns (available and selected) via new component
    selectedFields: {
      valueType: "multi-options",
      rowsShown: 3,
      selectMultiple: true,
      values: "resourcePropertiesOptions"
    }
  }
};

var propertyKeys = Object.keys(elementsPropertiesSchema);

propertyKeys.forEach(function(propertyKey){
  elementsPropertiesSchema[propertyKey]["gridOffset"] = {
    valueType: "number",
    min: 0,
    max: 12,
    defaultValue: 0,
    ifChildOf: ["grid"]
  };

  if(!elementsPropertiesSchema[propertyKey]["isHeader"]) {
    elementsPropertiesSchema[propertyKey]["isHeader"] = {
      valueType: "checkbox",
      ifChildOf: ["tableRow"]
    }
  }
});

module.exports = elementsPropertiesSchema;
