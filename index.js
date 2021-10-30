const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`<h1  style="text-align: center; margin-top:100px;  font-weight: 900; color: blue">Welcome To Fantasy Kingdom Backend Server</h1>`)
})
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qyw7u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const database = client.db('fantasyData');
    const ridesCollection = database.collection('ridesPackage');
    const customerCollection = database.collection('customerInfo');

    app.get('/ridesPackageHome' , async (req,res)=>{
            const ridePackagesHome = await ridesCollection.find({}).limit(9).toArray();
            res.send(ridePackagesHome);
    })


    // Get Single Id Package 
    app.get("/rides/:id", async (req, res) => {
        const params = req.params.id;
        const query = {_id:ObjectId(params)};
        const result = await ridesCollection.find(query).toArray();
        res.send(result);
    }) 

    app.get('/rides' , async (req,res)=>{
        const ridePackages = await ridesCollection.find({}).toArray();
        res.send(ridePackages)
    })



    // Buyer Information Post 
    app.post("/orderInfo", async (req,res)=>{
        const info = req.body;
        const result = await customerCollection.insertOne(info);
        res.send(result);
        console.log(result);
    })
    app.get('/allOrders' , async (req,res)=>{
        const ridePackages = await customerCollection.find({}).toArray();
        res.send(ridePackages)
    })
    app.get('/matchPackage/:email', async (req, res) => {
        const emailMatchPackage =  req.params.email;
      const result = await customerCollection.find({email: emailMatchPackage}).toArray();
      res.send(result)
      });
//   client.close();
});

  

app.listen(port, ()=>{console.log('Server Is Running With Port', port)})