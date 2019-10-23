'use strict';
const { Node , architect } = require('neataptic');
const fs = require("fs");

class NeuralNetwork{

    constructor(node_json , conn_json , type){
        this.prepareData(type);
        this.build(node_json , conn_json);
    }

    prepareData(type){
        if(type == 1){
            this.trainingData = fs.readFileSync('./dataset/inputTestPlayerOnly.json');
            this.validData = fs.readFileSync('./dataset/validTestPlayerOnly.json');
        }else if(type == 2){
            this.trainingData = fs.readFileSync('./dataset/inputTestWithTeam.json');
            this.validData = fs.readFileSync('./dataset/validTestWithTeam.json');
        }else if(type == 3){
            this.trainingData = fs.readFileSync('./dataset/inputTestWithTeamAndPos.json');
            this.validData = fs.readFileSync('./dataset/validTestWithTeamAndPos.json');
        }else{
            console.log("unknown type");
        }   
    }

    backprop(){
        let propagate = true;
        let input = JSON.parse(this.trainingData)
        let opt = {
            log: 100,
            error: 0,
            iterations: 11000,
            rate: 0.001,
            
        }
        this.network.train(input,opt,propagate);

    }

    valid(){
        let propagate = false;
        let input = JSON.parse(this.validData)
        let opt = {
            log: 1,
            error: 0,
            iterations: 1,
            rate: 0.0001,
            
        }
        this.network.train(input,opt,propagate);
    }

    build(node_json , conn_json){
        // Get node_data from file
        let contents = fs.readFileSync(node_json);
        // Define to JSON type
        this.node_data = JSON.parse(contents);
        

        //count total nodes
        this.node_count = 0;
        for(let i in this.node_data){
            this.node_count++;
        }
        
        
        //define node object based on node_data 
        this.nodes = Array(this.node_count);
        for(let i = 0 ; i < this.nodes.length ; i++){
            //console.log(this.node_data[i].key)
            this.nodes[i] = new Node(this.node_data[i].type , this.node_data[i].key , this.node_data[i].bias)
        }


        // Get conn_data from file
        contents = fs.readFileSync(conn_json);
        // Define to JSON type
        this.conn_data = JSON.parse(contents);
        
   
        //connect node object to another node object based on conn_data
        for(let i in this.conn_data){
            for(let j = 0 ; j < this.nodes.length ; j++){
                if(this.conn_data[i].from == this.nodes[j].key){
                    for(let h = 0 ; h < this.nodes.length ; h++){
                        if(this.conn_data[i].to == this.nodes[h].key){
                            if(j != h){
                                this.nodes[j].connect(this.nodes[h] , this.conn_data[i].weight);
                            }
                            
                        }
                    }
                }
            }
        }
        
        
        
        
            //to do : sort the nodes
        //console.log(this.nodes[0].key)
        //console.log(this.nodes[0].connections.out[0].to)
        // let arr = [];
        // for(let i = 0 ; i < this.node_count ; i++){
        //     let distance = 0;
        //     if(this.nodes == 'input'){
        //         this.nodes[i].distance = -100;
        //     }
        //     else if(this.nodes[i].type == 'hidden'){
        //         for(let j = 0 ; j < this.nodes[i].connections.out.length ; j++){
        //             if(this.nodes[i].connections.out[j].to.type != 'output'){
        //                 arr.push(this.nodes[i].connections.out[j].to.key);
        //             }
                    
        //         }
        //     }
            
        // }

        //let unique = [... new Set(arr)];
        //console.log(arr)
        
        
        

        
        
        
        
        


       
        
        this.network = architect.Construct(this.nodes);
        let feature = [0.63107692307692, 0.633, 0.642, 0.592, 0.612, 0.691, 0.623, 0.657, 0.625, 0.667, 0.633, 0.586, 0.72376923076923, 0.662, 0.758, 0.741, 0.745, 0.692, 0.91, 0.764, 0.713, 0.716, 0.708, 0.764];
        //this.predict(feature);
        //this.backprop(false);
        //this.predict(feature);
        //this.valid();
        this.backprop();
        this.valid();


        
       
        

    }

    predict(feature){
        console.log(this.network.activate(feature , false));
    }

   
    


}

module.exports = NeuralNetwork;