'use strict';
const express = require('express')
const app = express()
const port = 3000
const fs = require("fs");
const { Node , Group , architect  , Network} = require('neataptic');
const NeuralNetwork = require('./NeuralNetwork.js');
let NN = new NeuralNetwork("./config/test3-config4-afterBackpropMomentum-node_data.json" , "./config/test3-config4-afterBackpropMomentum-conn_data.json" , 3, 'totalEncode' );


let bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/testAPI', (req, res) => {
   res.send("WORKING !!!");
   
})

app.post('/predict' , (req,res)=>{
   let data = req.body;
   let ratings = [];
   ratings.push(parseFloat(data['teamHome']) / 10);
   for(let i = 0 ; i < 14 ; i++){
      ratings.push(parseFloat(data['playerHome'+i]) / 10);
   }

   ratings.push(parseFloat(data['teamAway']) / 10);
   for(let i = 0 ; i < 14 ; i++){
      ratings.push(parseFloat(data['playerAway'+i]) / 10);
   }
   let reply = NN.predict(ratings);
   reply[0] = Math.round(reply[0])
   reply[1] = Math.round(reply[1])
   res.send(reply);
})

app.listen(port, () => console.log(`Backend listening on port ${port}!`))