var Express = require("express"),
  Router = Express.Router,
  pagesRoutes = require("./pages"),
  resourcesRoutes = require("./resources");

var router = Router();

router.use("/pages", pagesRoutes);
router.use("/resources", resourcesRoutes);

module.exports = router;
