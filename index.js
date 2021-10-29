const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient } = require("mongodb");
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
    app.get('/rides' , async (req,res)=>{
        const ridePackages = await ridesCollection.find({}).toArray();
        res.send(ridePackages)
    })
//   client.close();
});

  

app.listen(port, ()=>{console.log('Server Is Running With Port', port)})