'use strict';
const fs = require("fs");
const NeuralNetwork = require('./NeuralNetwork.js');
const { Node , Group , architect  , Network} = require('neataptic');








let NN = new NeuralNetwork("./config/test2-config3-afterBackprop-node_data.json" , "./config/test2-config3-afterBackprop-conn_data.json" , 2 );
//NN.realLifeTestAverageWeight(true);
//NN.realLifeTestAverage(true);
NN.realLifeTestRealRating(true , 0);
//NN.getPlayerRatingAll(24444);
//NN.valid(true);



