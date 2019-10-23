'use strict';
const { Node , architect } = require('neataptic');
const fs = require("fs");

class NeuralNetwork{

    constructor(node_json , conn_json , type){
        this.prepareData(type);
        this.build(node_json , conn_json);
        //this.backprop(5000);
        //this.valid();
        //console.log(this.getRatings('David Silva'));
        this.getTeamRating("asd")
        //this.getPlayerRating("asd");    
    }

    realLifeTest(){
        for(let matchId in this.datasetRealLife){
            for(let teamId in this.datasetRealLife[matchId]){
                for(let teamData in this.datasetRealLife[matchId][teamId]){
                    if(teamData == 'Player_stats'){
                        for(let player in this.datasetRealLife[matchId][teamId][teamData]){
                            
                        }
                    }
                }
            }
        }

    }

    getTeamRating(teamName){
        let rating = 0;
        let count = 0;
        
        for(let matchId in this.datasetRealLife){
            
        }
        
        
        if(count > 0){
            return rating/count;
        }else{
            return 6.0
        }

    }

    getPlayerRating(playerName){
        // console.log(this.dataset[1190174])
        let rating = 0;
        let count = 0;
        for(let matchId in this.dataset){
            for(let teamId in this.dataset[matchId]){
                for(let teamData in this.dataset[matchId][teamId]){
                    if(teamData == 'Player_stats'){
                        for(let player in this.dataset[matchId][teamId][teamData]){
                            if(player == playerName){
                                for(let playerData in this.dataset[matchId][teamId][teamData][player]){
                                    if(playerData == 'player_details'){
                                        for(let stat in this.dataset[matchId][teamId][teamData][player][playerData]){
                                            if(stat == 'player_rating'){
                                                let prate = parseInt(this.dataset[matchId][teamId][teamData][player][playerData][stat]);
                                                if(prate != 0){
                                                    rating += prate
                                                    count++;
                                                }
                                                
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        if(count > 0){
            return rating/count;
        }else{
            return 6.0
        }

    }

    prepareData(type){
        this.dataset = JSON.parse(fs.readFileSync('./dataset/dataset.json'));
        this.datasetRealLife = JSON.parse(fs.readFileSync('./dataset/datasetRealLife.json'))
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

    backprop(iteration){
        let propagate = true;
        let input = JSON.parse(this.trainingData)
        let opt = {
            log: 100,
            error: 0,
            iterations: iteration,
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

    }

    predict(feature){
        console.log(this.network.activate(feature , false));
    }

   
    


}

module.exports = NeuralNetwork;