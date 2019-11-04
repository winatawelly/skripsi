'use strict';
// const { Node } = require('neataptic');
// const fs = require("fs");
const NeuralNetwork = require('./NeuralNetwork.js');

//let nn = new NeuralNetwork("./config/test3-config1-node_data.json" , "./config/test3-config1-conn_data.json" , 3 , 'oneHot');
let nn = new NeuralNetwork("./config/test3-config1-afterBackprop-node_data.json" , "./config/test3-config1-afterBackprop-conn_data.json" , 3 , 'oneHot');
//let nn = new NeuralNetwork("./config/node-test2-config1.json" , "./config/conn-test2-config1.json" , 2);


/*
// Get content from file
let contents = fs.readFileSync("node_data.json");
// Define to JSON type
let node_data = JSON.parse(contents);
// Get Value from JSON
//console.log(node_data)
let count = 0;
for(i in node_data){
    count++;
}
let nodes = Array(count);
for(let i = 0 ; i < nodes.length ; i++){
    if(node_data[i].bias == 0){
        nodes[i] = new Node('input', node_data[i].key , 0);
    }else{
        nodes[i] = new Node('nonInput', node_data[i].key , node_data[i].bias);
    }
}
*/