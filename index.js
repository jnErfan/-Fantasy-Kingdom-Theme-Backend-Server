const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

app.use(cors());
app.use(express.json());

// Url Check  First Title
app.get("/", (req, res) => {
  res.send(
    `<h1  style="text-align: center; margin-top:100px;  font-weight: 900; color: blue">Welcome To Fantasy Kingdom Backend Server</h1>`
  );
});

// User Uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qyw7u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect To MongoDb
client.connect((err) => {
  const database = client.db("fantasyData");
  const ridesCollection = database.collection("ridesPackage");
  const customerCollection = database.collection("customerInfo");

  // Get Single Id Rides Package
  app.get("/rides/:id", async (req, res) => {
    const params = req.params.id;
    const query = { _id: ObjectId(params) };
    const result = await ridesCollection.find(query).toArray();
    res.send(result);
  });

  // Get Home Page Limit 8 Items
  app.get("/ridesPackageHome", async (req, res) => {
    const ridePackagesHome = await ridesCollection.find({}).limit(9).toArray();
    res.send(ridePackagesHome);
  });

  // Get All Rides Package
  app.get("/rides", async (req, res) => {
    const ridePackages = await ridesCollection.find({}).toArray();
    res.send(ridePackages);
  });

  // Add Rides Package To Database
  app.post("/rides", async (req, res) => {
    const package = req.body;
    const result = await ridesCollection.insertOne(package);
    res.send(result);
    console.log(result);
  });

  // Rides Package Pagination
  app.get("/pagination", async (req, res) => {
    const ridesUi = ridesCollection.find({});
    const page = req.query.page;
    const size = parseInt(req.query.size);
    let ridesPackage;
    const count = await ridesUi.count();
    if (page) {
      ridesPackage = await ridesUi
        .skip(page * size)
        .limit(size)
        .toArray();
    } else {
      ridesPackage = await ridesUi.toArray();
    }
    res.send({ count, ridesPackage });
  });

  // Customer Information And Rides Package Details Post In Database
  app.post("/orderInfo", async (req, res) => {
    const info = req.body;
    const result = await customerCollection.insertOne(info);
    res.send(result);
  });

  // My Order Page Delete Order To Database
  app.delete("/deleteOrder/:id", async (req, res) => {
    const params = req.params.id;
    const query = { _id: ObjectId(params) };
    const result = await customerCollection.deleteOne(query);
    res.send(result);
    console.log(result);
  });

  // Get All Customer And Package Information
  app.get("/allOrders", async (req, res) => {
    const ridePackages = await customerCollection.find({}).toArray();
    res.send(ridePackages);
  });

  // Update Specific Id Status
  app.put("/orderStatus/:id", async (req, res) => {
    const params = req.params.id;
    const updateId = { _id: ObjectId(params) };
    const query = req.body;
    const updateDoc = {
      $set: {
        status: query.status,
        rejectReason: query.rejectReason,
      },
    };
    const result = await customerCollection.updateOne(updateId, updateDoc);
    res.json(result);
  });

  // Find Ordered Package With LogIn  Customer Email
  app.get("/matchPackage/:email", async (req, res) => {
    const emailMatchPackage = req.params.email;
    const result = await customerCollection
      .find({ email: emailMatchPackage })
      .toArray();
    res.send(result);
  });

  //   Connection Closed
  //   client.close();
});

app.listen(port, () => {
  console.log("Server Is Running With Port", port);
});
