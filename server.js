const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
var checkoutcontroller = require('./app/controllers/checkout.controller');
var productcontroller = require('./app/controllers/product.controller')
const app = express();

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });
 
app.use(express.static('./public'))
app.get("/", (req, res) => {
  res.sendFile(__dirname + './index.html');
});
app.get("/product", (req, res) => {
    res.sendFile(__dirname + './product.html');
});


// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
//require("./app/routes/product.routes")(app);
require("./app/routes/sysUpload.routes")(app);
//require("./app/routes/checkout.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.use('/checkouts', checkoutcontroller);
app.use('/api/product', productcontroller);

