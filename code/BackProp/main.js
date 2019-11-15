'use strict';
// const { Node } = require('neataptic');
// const fs = require("fs");
const NeuralNetwork = require('./NeuralNetwork.js');

let nn = new NeuralNetwork("./config/test2-config3-afterBackprop-node_data.json" , "./config/test2-config3-afterBackprop-conn_data.json" , 2 );
let ratingNN = new NeuralNetwork('./config/rating-config1-node_data.json' , './config/rating-config1-conn_data.json' , 4 );

