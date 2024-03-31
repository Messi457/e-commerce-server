const mongoose = require("mongoose");

const Product = mongoose.model(
  "Product",
  new mongoose.Schema(
    {
      pName: String ,
      pSlug: String ,
      pQty:  Number ,
      pPrice: Number ,
      pPriceSale: Number ,
      pDesc: String ,

      pSize:  String ,
      pColor:  String ,
      pStar:  Number ,
      pImageDefault:  String ,
      pImages:  String ,
      pSpecification: String 
    },
    { timestamps: true }
));

module.exports = { Product };