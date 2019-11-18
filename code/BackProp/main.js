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



// let myNetwork = Network.fromJSON(JSON.parse(fs.readFileSync('./dataset/perceptronData14.json')))//new architect.Perceptron(22,10,5,1);
// let ratingNN = new NeuralNetwork('./config/rating-config1-node_data.json' , './config/rating-config1-conn_data.json' , 4 );
// console.log(myNetwork.activate(ratingNN.getData(331924,33)));

// //ratingNN.convertDatasetBETA();

// return;
// let myNetwork = Network.fromJSON(JSON.parse(fs.readFileSync('./dataset/perceptronData14.json')))//new architect.Perceptron(22,10,5,1);

// let trainingData = JSON.parse(fs.readFileSync('./dataset/inputRatingDataset.json'));
// let validData = JSON.parse(fs.readFileSync('./dataset/validRatingDataset.json'));


// let opt = {
//     log: 1,
//     error: 0,
//     iterations: 2000,
//     rate: 0.00001,
// }

// let optTrain = {
//     log: 1,
//     error: 0,
//     iterations: 1,
//     rate: 0.00001
// }

// //myNetwork.train(validData,optTrain,false , true);

// for(let i = 15 ; i < 100 ; i++){
//     myNetwork.train(trainingData , opt , true)
//     let jsonFile = myNetwork.toJSON();
//     ratingNN.writeJson(jsonFile, `./dataset/perceptronData${i}.json`);
// }










let NN = new NeuralNetwork("./config/test2-config3-afterBackprop-node_data.json" , "./config/test2-config3-afterBackprop-conn_data.json" , 2 );
let ratingNN = Network.fromJSON(JSON.parse(fs.readFileSync('./dataset/perceptronData14.json')))//new architect.Perceptron(22,10,5,1);
//console.log(ratingNN.activate(NN.getData(24444,38)));
//console.log(NN.getData(6755,38))    
//NN.realLifeTestNN(ratingNN);
//NN.realLifeTestAverageWeight(true);
//NN.realLifeTestAverage(true);
//NN.realLifeTestRealRating(true);
NN.getPlayerRatingAll(24444);
//NN.valid(true);

// let rating = NN.getData(6755,6);
// let temp = [];
// temp[0] = rating[20];
// temp[1] = rating[21];
// let newRating  =[];
// for(let i = 19 ; i >= 0 ; i--){
//     newRating.push(rating[i]);
// }
// newRating.push(temp[0])
// newRating.push(temp[1])
// console.log(newRating);

