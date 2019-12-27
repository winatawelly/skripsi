'use strict';
const fs = require("fs");
const NeuralNetwork = require('./NeuralNetwork.js');
const { Node , Group , architect  , Network} = require('neataptic');








let NN = new NeuralNetwork("./config/test3-config4-afterBackpropMomentum-node_data.json" , "./config/test3-config4-afterBackpropMomentum-conn_data.json" , 3, 'totalEncode' );
//console.log(NN.totalEncode('DMC'))
//NN.backprop(30000,0.0000001)
NN.valid();
//NN.save('test3-config4-afterBackpropMomentum')
//NN.valid(true);
//NN.realLifeTestAverageWeight(true);
//NN.realLifeTestAverage(true);
//NN.realLifeTestRealRating(true , 0);
//NN.getPlayerRatingAll(24444);
//NN.valid(true);



