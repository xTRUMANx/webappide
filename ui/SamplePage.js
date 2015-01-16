var rootElement = {
  id: "0",
  nextChildId: 10,
  type: "page",
  properties: {
    title: "Sample Page"
  }
};

var navbar = {
  id: "0.0",
  nextChildId: 1,
  type:"navbar",
  parent: rootElement,
  properties: {
    brand: "Sample Page"
  },
  children: []
};

var navbarList = {
  id: "0.0.0",
  nextChildId: 1,
  type: "list",
  parent: navbar,
  properties: {
    type: "unordered"
  },
  children: []
};

var navbarListItem1Link = {
  id: "0.0.0.0",
  nextChildId: 1,
  type: "link",
  parent: navbarList,
  properties: {
    type: "external",
    location: "http://www.mustafasha.com"
  },
  children: []
};

var navbarListItem1LinkText = {
  id: "0.0.0.0.0",
  nextChildId: 0,
  type: "text",
  parent: navbarListItem1Link,
  properties: {
    type: "free",
    text: "Mustafa's Site"
  }
};

navbarListItem1Link.children.push(navbarListItem1LinkText);

navbarList.children.push(navbarListItem1Link);

navbar.children.push(navbarList);

var jumbotron = {
  id: "0.1",
  nextChildId: 2,
  type: "jumbotron",
  parent: rootElement,
  properties: {},
  children: []
};

var jumbotronHeading = {
  id: "0.1.0",
  nextChildId: 1,
  type: "heading",
  parent: jumbotron,
  properties: {
    type: "1"
  },
  children: []
};

jumbotronHeading.children.push({
  id: "0.1.0.0",
  nextChildId: 0,
  type: "text",
  parent: jumbotronHeading,
  properties: {
    type: "free",
    text: "Sample Page"
  }
});

jumbotron.children.push(jumbotronHeading);

jumbotron.children.push({
  id: "0.1.1",
  nextChildId: 0,
  type: "text",
  parent: jumbotron,
  properties: {
    type: "paragraph",
    text: "This page shows off many of the elements supported."
  }
});

var heading = {
  id: "0.2",
  nextChildId: 1,
  type: "heading",
  parent: rootElement,
  properties: {
    type: "1"
  },
  children: []
};

heading.children.push({
  id: "0.2.0",
  nextChildId: 0,
  type: "text",
  parent: heading,
  properties: {
    type: "free",
    text: "A Heading"
  }
});

var link = {
  id: "0.6",
  nextChildId: 1,
  type: "link",
  parent: rootElement,
  properties: {
    type: "external",
    location: "https://google.com"
  },
  children: []
};

link.children.push({
  id: "0.6.0",
  nextChildId: 0,
  type: "text",
  parent: link,
  properties: {
    type: "free",
    text: "Google Search"
  }
});

var list = {
  id: "0.7",
  nextChildId: 2,
  type: "list",
  parent: rootElement,
  properties: {
    type: "ordered"
  },
  children: []
};

var listItem1Text = {
  id: "0.7.0",
  nextChildId: 0,
  type: "text",
  parent: list,
  properties: {
    type: "free",
    text: "First"
  }
};

list.children.push(listItem1Text);

var listItem2Text = {
  id: "0.7.1",
  nextChildId: 0,
  type: "text",
  parent: list,
  properties: {
    type: "free",
    text: "Second"
  }
};

list.children.push(listItem2Text);

var image = {
  id: "0.8",
  nextChildId: 0,
  type: "image",
  parent: rootElement,
  properties: {
    url: "react.svg",
    width: "100"
  },
  children: []
};

var grid = {
  id: "0.9",
  nextChildId: 12,
  type: "grid",
  parent: rootElement,
  properties: {
    columnsCount: 12
  },
  children: []
};

function generateGridColumn(i) {
  return {
    id: grid.id + "." + (i - 1),
    nextChildId: 0,
    type: "text",
    parent: grid,
    properties: {
      type: "paragraph",
      text: "Col " + i
    }
  }
}

for(var i = 1; i<=12; i++) {
  grid.children.push(generateGridColumn(i));
}

rootElement.children = [
  navbar,
  jumbotron,
  heading,
  {
    id: "0.3",
    nextChildId: 0,
    type: "text",
    parent: rootElement,
    properties: {
      type: "paragraph",
      text: "A paragraph of text."
    }
  },
  {
    id: "0.4",
    nextChildId: 0,
    type: "text",
    parent: rootElement,
    properties: {
      type: "bold",
      text: "Some bold text."
    }
  },
  {
    id: "0.5",
    nextChildId: 0,
    type: "text",
    parent: rootElement,
    properties: {
      type: "italics",
      text: "Some italiticized text."
    }
  },
  link,
  list,
  image,
  grid
];

module.exports = rootElement;
