const mongoose = require('mongoose');

const Checkout = mongoose.model(
  "Checkout", 
  new mongoose.Schema(
   {
    firstname: String,
    lastname: String,
    phone: String,
    username: String,
    email: String,
    address: String,
    city: String,
    subcity: String,
    zip: String,
    },
    { timestamps: true }
  ));

  module.exports = { Checkout };