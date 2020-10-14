var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

//url that points to the db 27017 is the default
const url = "mongodb://localhost:27017/test";

//defining layout

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
const schema = mongoose.Schema;
const userDataSchema = new mongoose.Schema(
  {
    type: String,
    address: String,
  },
  { collection: "user-data" }
);

//model of the schema
let userData = mongoose.model("userData", userDataSchema);

/* GET home page. */
router.get("/", function(req, res, next){
  res.render("index");
});

router.get("/get-data", function(req, res, nex){
  userData
    .find({})
    .lean()
    .exec((error, doc) => {
      //res.render("index", { items: doc });
      res.send({ items: doc });
    });
});

router.post("/insert", function(req, res, next) {
  const item = JSON.parse(req.body);
  let point = {
    //  type: req.body.type,
    //  address: req.body.address,
    
  };
  let data = new userData(item);
  data.save();
  // res.send(point);

  // res.redirect("/");
});

router.post("/update", function(req, res, next){
  let id = req.body.id;

  userData.findById(id, function(err, doc) {
    if (err) {
      console.log("error, no entry found");
    }
    doc.type = req.body.type;
    doc.address = req.body.address;
    doc.save();
  });
  res.redirect("/");
});

router.post("/delete", function(req, res, next) {
  let address = req.body.address;

  //cambiare anche con il click

  userData.findByIdAndRemove(address).exec();
  res.redirect("/");
});

module.exports = router;
