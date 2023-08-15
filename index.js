const express = require('express')
const bodyParser = require('body-parser')


const app = express();

//middleware
app.use(bodyParser.json())

const port = 3000;


app.listen(3000, ()=>{
    console.log(`server is running on http://localhost:3000`);
})