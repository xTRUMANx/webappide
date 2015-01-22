var Express = require("express"),
  Router = Express.Router,
  pagesRoutes = require("./pages");

var router = Router();

router.use("/pages", pagesRoutes);

module.exports = router;
