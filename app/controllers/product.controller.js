const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Product } = require('../models/product.model');

const { authJwt } = require("../middlewares");
const sysUpload = require('./sysUpload.controller');
const fs = require('fs')



// Create and Save a new Products
router.post('/', sysUpload.upload.array('images', 12),(req, res) => {
  const files = req.files;
  const body = req.body;
  let imageArr = [];
  let pImages_join = '';

  // console.log('files--', files);
  // console.log('body--', body);

  /**
   * Remember
   * upload.single => req.file  --> file no s
   * upload.array => req.files --> file + s
   */

  if (!files) {
      return res.status(404).send({ message: "Please upload a file." });
  } else {
      files.forEach((value) => {
          imageArr.push(value.filename);
      });
      pImages_join = imageArr.join(',');
      console.log('pImages_join--', pImages_join);
  }

  console.log('imageArr--', imageArr);
   var prod = new Product ({
    pName: req.body.pName,
    pSlug: req.body.pSlug,
    pQty: req.body.pQty,
    pPrice: req.body.pPrice,
    pPriceSale: req.body.pPriceSale,
    pDesc: req.body.pDesc,
    pSize: req.body.pSize,
    pColor: req.body.pColor,
    pStar: req.body.pStar,
    pImageDefault: imageArr[0],
    pImages: pImages_join,
    pSpecification: req.body.pSpecification
  });
  prod.save((err,doc) => {
    if (!err) { res.send(doc);}
    else { console.log('Error in save')}
  });
});

// Retrieve all Products from the database.
router.get('/', (req, res) => {
  Product.find((err,doc) => {
    if (!err) { res.send(doc);}
    else { console.log('Error occured')}
  });
});  
// Find a single Product with an id
router.get('/:id', (req, res) => {
 if (!ObjectId.isValid(req.params.id))
     return res.status(400).send(`No product with given id : ${req.params.id}`);
  
     const Id = parseInt(req.params.id);
     console.log('Id--', Id);
         Product.findOne(req.params.id, (err,docs) => {
             if (!err) {res.send(docs);}
             else { console.log ("Error")}
         });
    });
// Update a Product by the id in the request
router.put('/:id',  sysUpload.upload.array('images', 12), (req, res) => {
  if (!ObjectId.isValid(req.params.id))
     return res.status(400).send(`No product with given id : ${req.params.id}`);
  
     const Id = parseInt(req.params.id);
     console.log('Id--', Id);

  // -----------------------
  const files = req.files;
  const body = req.body;
  let imageArr = [];
  let pImages_join = '';

  /**
   * Remember
   * upload.single => req.file  --> file no s
   * upload.array => req.files --> file + s
   */

  if (files) { //--case add more image
      //--new images
      // console.log('files--', files);
      files.forEach((img) => {
          imageArr.push(img.filename);
           //console.log('newImages--', img.filename);
      });
  }
  //--old images
  let oldImage = body.pImages.split(',');
  //console.log('oldImage--', oldImage);
  oldImage.forEach(img => {
      if (img) {
          imageArr.push(img);
      }
  });
   //console.log('imageArr--', imageArr);

  pImages_join = imageArr.join(',');
   //console.log('pImages_join--', pImages_join);
  // return;

  // -----------------------

      Product.findById()
          .then(obj => {
              if (!obj) {
                  return res.status(404).send({ message: "Obj Not found." });
              }
              //--update
              obj.pName = body.pName;
              obj.pSlug = body.pSlug;
              obj.pQty = body.pQty;
              obj.pPrice = body.pPrice;
              obj.pPriceSale = body.pPriceSale;
              obj.pDesc = body.pDesc;
              obj.pSize = body.pSize;
              obj.pColor = body.pColor;
              // obj.pStar = body.pStar;
              obj.pImageDefault = body.pImageDefault;
              obj.pImages = pImages_join; //--join all new and old
              obj.pSpecification = body.pSpecification;

              try {
                  obj.save().
                  then(saveData => {
                          res.status(200).send({ data: saveData, message: "Update success!" });
                      })
                      .catch(err => {
                          res.status(500).send({ message: err.message });
                      });

              } catch (error) {
                  res.status(500).send({ message: error.message });
              }
              //-------------
          })
          .catch(err => {
              res.status(500).send({ message: err.message });
          });
});

// Delete a Product with the specified id in the request
router.get('/image/:id/:imagename', (req, res) => {
  if (!ObjectId.isValid(req.params.id))
     return res.status(400).send(`No product with given id : ${req.params.id}`);

  const Id = parseInt(req.params.id);
  const imageDelete = req.params.imagename;

  // console.log('Id--', Id);
  // console.log('imageDelete--', imageDelete);

  let imageArr = [];
  let pImages_join = '';

  // return;

      Product.findById()
          .then(obj => {
              if (!obj) {
                  return res.status(404).send({ message: "Obj Not found." });
              }
              //--old images
              let oldImage = obj.pImages.split(',');
              oldImage.forEach(img => {
                  if (img && img != imageDelete) { //--all old image but not delete image
                      // console.log('img-aa-', img);
                      imageArr.push(img);
                  }
              });
              pImages_join = imageArr.join(',');
              // console.log('imageArr--', imageArr);
              // return;

              //--update images
              obj.pImages = pImages_join; //--only one field
              try {
                  obj.save().
                  then(saveData => {
                          //--remove image
                          const path = `./public/uploads/images/${imageDelete}`;
                          try {
                              fs.unlinkSync(path);
                              console.log(`image ${imageDelete} removed!`);
                              //file removed
                          } catch (err) {
                              console.error(err)
                                  // res.status(500).send({ message: err.message });
                          }
                          //--end remove image

                          res.status(200).send({ data: saveData, message: "Update success!" });
                      })
                      .catch(err => {
                          res.status(500).send({ message: err.message });
                      });

              } catch (error) {
                  res.status(500).send({ message: error.message });
              }
              //-------------
          })
          .catch(err => {
              res.status(500).send({ message: err.message });
          });
});

// Delete One Product from the database.
router.delete('/:id', (req, res) => {
  if (!ObjectId.isValid(req.params.id))
     return res.status(400).send(`No product with given id : ${req.params.id}`);
     
     const Id = parseInt(req.params.id);
  // console.log('Id--', Id);
  // return;
      Product.findById()
          .then(obj => {
              if (!obj) {
                  return res.status(404).send({ message: "Obj Not found." });
              }
              //--old images
              let oldImage = obj.pImages.split(',');
              try {
                  obj.destroy(); //--delete record

                  const path = `./public/uploads/images/`;
                  oldImage.forEach(img => {
                      //--remove image
                      try {
                          fs.unlinkSync(`${path}${img}`);
                          console.log(`image ${img} removed!`);
                      } catch (err) {
                          console.error(err)
                      }
                      //--end remove image
                  });
                  res.status(200).send({ data: '', message: "Delete success!" });
              } catch (error) {
                  res.status(500).send({ message: error.message });
              }
          })
          .catch(err => {
              res.status(500).send({ message: err.message });
          });
  // await jane.destroy();
  // Now this entry was removed from the database
});

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
};

module.exports = router;