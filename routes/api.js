var Express = require("express"),
  Router = Express.Router,
  sitesRoutes = require("./sites"),
  pagesRoutes = require("./pages"),
  resourcesRoutes = require("./resources"),
  resourceDataRoutes = require("./resourceData");

var router = Router();

router.use("/sites", sitesRoutes);
router.use("/pages", pagesRoutes);
router.use("/resources", resourcesRoutes);
router.use("/resourceData", resourceDataRoutes);

module.exports = router;
