const express = require('express');
var router = express.Router();

var { Checkout } = require('../models/checkout.model');


router.get('/', (req, res) => {
  Checkout.find((err,docs) => {
    if (!err) { res.send(docs);}
    else { console.log('Error occured')}
  });
});  

router.post('/', (req, res) => {
  var check = new Checkout ({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone: req.body.phone,
    username: req.body.username,
    email: req.body.email,
    address: req.body.address,
    city: req.body.city,
    subcity: req.body.subcity,
    zip: req.body.zip,
  });
  check.save((err,doc) => {
    if (!err) { res.send(doc);}
    else { console.log('Error in save')}
  });
});
 
module.exports = router;