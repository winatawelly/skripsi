'use strict';
const NeuralNetwork = require('./NeuralNetwork.js');
const { Node , Group , architect  , Network} = require('neataptic');
const fs = require("fs");

function chunkArray(myArray, chunk_size){
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
        let myChunk = myArray.slice(index, index+chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }

    return tempArray;
}




let ratingNN = new NeuralNetwork('./config/rating-config1-node_data.json' , './config/rating-config1-conn_data.json' , 4 );
//ratingNN.convertDatasetBETA();


let myNetwork = new architect.Perceptron(22,10,5,1);

let trainingData = JSON.parse(fs.readFileSync('./dataset/inputRatingDataset.json'));
let validData = JSON.parse(fs.readFileSync('./dataset/validRatingDataset.json'));


let opt = {
    log: 1,
    error: 0,
    iterations: 2000,
    rate: 0.00001
}

for(let i = 0 ; i < 100 ; i++){
    myNetwork.train(trainingData , opt , true)
    let jsonFile = myNetwork.toJSON();
    ratingNN.writeJson(jsonFile,`./dataset/perceptronData-${i}.json`);
}










//let nn = new NeuralNetwork("./config/test2-config3-afterBackprop-node_data.json" , "./config/test2-config3-afterBackprop-conn_data.json" , 2 );



