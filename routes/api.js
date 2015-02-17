var Express = require("express"),
  Router = Express.Router,
  pagesRoutes = require("./pages"),
  resourcesRoutes = require("./resources"),
  resourceDataRoutes = require("./resourceData");

var router = Router();

router.use("/pages", pagesRoutes);
router.use("/resources", resourcesRoutes);
router.use("/resourceData", resourceDataRoutes);

module.exports = router;
