var express = require("express");
var router = express.Router();
// var helpers = require("../helpers/todos");

router.get('/',function(req,res){
    res.send("hello from todos route");
});

module.exports = router;