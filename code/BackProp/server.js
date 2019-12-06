const express = require('express')
const app = express()
const port = 3000
'use strict';
const fs = require("fs");
const NeuralNetwork = require('./NeuralNetwork.js');
const { Node , Group , architect  , Network} = require('neataptic');
let NN = new NeuralNetwork("./config/test2-config3-afterBackprop-node_data.json" , "./config/test2-config3-afterBackprop-conn_data.json" , 2 );

app.get('/testingResult', (req, res) => {
   let data = NN.realLifeTestRealRating(true , 35);
   res.send(data);
   
})

app.listen(port, () => console.log(`Backend listening on port ${port}!`))