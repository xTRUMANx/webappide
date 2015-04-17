var apiRootUrl = "http://localhost:3000/api/";

var apiUrls = {
  registration: apiRootUrl + "authentication/register",
  login: apiRootUrl + "authentication/login",
  logout: apiRootUrl + "authentication/logout",
  whoami: apiRootUrl + "authentication/whoami",
  resources: apiRootUrl + "resources",
  pages: apiRootUrl + "pages",
  deployedPages: apiRootUrl + "deployedPages",
  resourceData: apiRootUrl + "resourceData",
  sites: apiRootUrl + "sites"
  deployments: apiRootUrl + "sites/deployments"
  deploy: apiRootUrl + "sites/deploy"
};

module.exports = {
  apiUrls: apiUrls
};
