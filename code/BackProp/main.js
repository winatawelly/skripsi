'use strict';
// const { Node } = require('neataptic');
// const fs = require("fs");
const NeuralNetwork = require('./NeuralNetwork.js');


let nn = new NeuralNetwork("node_data1.json" , "conn_data.json");

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