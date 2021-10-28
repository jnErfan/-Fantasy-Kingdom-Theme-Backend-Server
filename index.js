const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`<h1  style="text-align: center; margin-top:100px;  font-weight: 900; color: blue">Welcome To Fantasy Kingdom Backend Server</h1>`)
})


app.listen(port, ()=>{console.log('Server Is Running With Port', port)})