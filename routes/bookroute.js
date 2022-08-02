var express = require("express");

var  router = express.Router();

var controller = require("../controllers/bookController");

router.get('/', controller.bookList)
router.post('/', controller.bookStore);

module.exports = router;