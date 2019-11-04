'use strict';
const { Node , architect , Network } = require('neataptic');
const fs = require("fs");
//4448
class NeuralNetwork{

    constructor(node_json , conn_json , type , encodingType){
        this.prepareData(type , encodingType);
        this.build(node_json , conn_json);
        this.valid();
        this.backprop(100000);
        this.valid();        
        this.save("test3-config1--afterBackprop");
        
    }

    save(name){
        let nodes = [];
        let conns = [];
        for(let node of this.nodes){
            //nodes
            let nodeObj = {};
            nodeObj['key'] = node.key;
            nodeObj['bias'] = node.bias;
            if(node.type == 'input'){
                nodeObj['activation'] = '';
            }else{
                nodeObj['activation'] = 'relu';
            }
            nodeObj['type'] = node.type;
            nodes.push(nodeObj);

            //conn
            for(let conn of node.connections.out){
                let connObj = {};
                connObj['from'] = conn.from.key;
                connObj['to'] = conn.to.key;
                connObj['weight'] = conn.weight;
                conns.push(connObj);
            }

        }

        this.writeJson(nodes,'./config/'+name+'-node_data'+'.json');
        this.writeJson(conns,'./config/'+name+'-conn_data'+'.json');


    }

    writeJson(obj , path){
        let jsonString = JSON.stringify(obj)
        fs.writeFile(path, jsonString, err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Successfully wrote file')
            }
        })
    }

    functoba(){
        let matchCount = 0;
        let teamList = [];
        let datasetRealLife = this.datasetRealLife;

        for(let matchId in datasetRealLife){
            if(matchCount > 100){
                teamList.push(datasetRealLife[matchId]);
            }
            matchCount++;
           
        }


        const jsonString = JSON.stringify(teamList)
        fs.writeFile('./validationReal.json', jsonString, err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Successfully wrote file')
            }
        })
            
            
        //console.log(teamCount)
    }

    realLifeTest(){
        let dataset = this.createRealLifeDataset()
        this.valid(dataset);
    }

    getPlayerRatingId(id){
        let ratings = 0;
        let dataCount = 0;
        for(let matchId in this.dataset){
            for(let teamId in this.dataset[matchId]){
                for(let player in this.dataset[matchId][teamId]['Player_stats']){
                    
                   if(this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_id'] == id){
                        console.log(player);
                       if(this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating'] != '0'){
                        ratings += parseFloat(this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating'])
                        dataCount++;
                       }
                   } 
                }

            }
        }

        if(dataCount != 0){
            return (ratings/dataCount)/10;
        }else{
            this.emptyPlayer++;
            return 0.6;
        }

       


    }

    createRealLifeDataset(){
        let dataset = []
        let empty = false;
        let countdData = 0;
        let obj = {};
        let input = [];
        let output = [];
        for(let matchId in this.datasetRealLife){
            if(matchId != '1190418'){
                continue;
            }
            console.log(matchId);
            obj = {};
            input = [];
            output = [];
            for(let teamId in this.datasetRealLife[matchId]){ 
                //console.log(this.datasetRealLife[matchId][teamId]['team_details']['date']);   
                input.push(this.getTeamRating(this.datasetRealLife[matchId][teamId]['team_details']['team_name']));
                if(!this.datasetRealLife[matchId][teamId]['aggregate_stats'].hasOwnProperty('goals')){
                    output.push(0);
                }else{
                    output.push(this.datasetRealLife[matchId][teamId]['aggregate_stats']['goals']);
                }
                
                for(let teamData in this.datasetRealLife[matchId][teamId]){
                    if(teamData == 'Player_stats'){
                        for(let player in this.datasetRealLife[matchId][teamId][teamData]){
                            if(this.datasetRealLife[matchId][teamId][teamData][player]['player_details']['player_position_info'] != 'Sub'){
                                    input.push(this.getPlayerRatingId(this.datasetRealLife[matchId][teamId][teamData][player]['player_details']['player_id']));
                                    //input.push(this.getPlayerRating(player));
                            }
                            
                            
                        }
                    }
                }
            }
            
            //console.log("hey");
            obj['input'] = input;
            obj['output'] = output;
            dataset.push(obj);
            countdData++;
            
            
            break;
            
        }
        console.log(dataset);
        //console.log(countdData)
        return dataset;
    }

    getTeamRating(teamName){
        let rating = 0;
        let matchCount = 0;
        let count = 0;
        
        for(let matchId in this.dataset){
            for(let teamId in this.dataset[matchId]){
                if(this.dataset[matchId][teamId]['team_details']['team_name'] == teamName){
                    if(matchCount >= 28){
                        //console.log(parseFloat(this.dataset[matchId][teamId]['team_details']['team_rating']))
                        //console.log(this.dataset[matchId][teamId]['team_details']['team_rating']);
                        rating += parseFloat(this.dataset[matchId][teamId]['team_details']['team_rating'])
                        count++
                    }
                    matchCount++;
                   
                }
            }
            
        }
        //console.log(rating);
        if(count > 0){
            return (rating/count)/10;
        }else{
            return 0.6
        }

    }

    getPlayerRating(playerName){
        let depth = 10;
        // console.log(this.dataset[1190174])
        let rating = 0;
        let count = 0;
        let arr = [];
        let matchCount = 0;
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
                                                let prate = parseFloat(this.dataset[matchId][teamId][teamData][player][playerData][stat]);
                                                if(prate != 0){
                                                    arr.push(prate);
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
        //console.log(arr);
        let i;
        if(arr.length >= depth){
            i = arr.length-depth;
        }else{
            i = 1;
        }

        let output = 0;

        if(count == 0){
            this.emptyPlayer += 1;
            return 0.6;
        }
        if(i != 0){
            for(i ; i <arr.length;i++){
                output+=arr[i];
                matchCount++;
            }
        }else{
            output = 0;
        }
       
        //console.log(output)
        if(output != 0){
            return (output/matchCount)/10;
        }else{
            return 0.6
            this.emptyPlayer += 1;
        }

    }

    prepareData(type , encodingType){
        this.dataset = JSON.parse(fs.readFileSync('./dataset/dataset.json'));
        this.datasetRealLife = JSON.parse(fs.readFileSync('./dataset/datasetRealLife.json'))
        if(type == 1){
            this.trainingData = fs.readFileSync('./dataset/inputTestPlayerOnly.json');
            this.validData = fs.readFileSync('./dataset/validTestPlayerOnly.json');
        }else if(type == 2){
            this.trainingData = fs.readFileSync('./dataset/inputTestWithTeam.json');
            this.validData = fs.readFileSync('./dataset/validTestWithTeam.json');
        }else if(type == 3){
            if(encodingType == 'label'){
                this.trainingData = fs.readFileSync('./dataset/inputTestWithTeamAndPosLabel.json');
                this.validData = fs.readFileSync('./dataset/validTestWithTeamAndPosLabel.json');

            }else if(encodingType == 'oneHot'){
                this.trainingData = fs.readFileSync('./dataset/inputTestWithTeamAndPosOneHot.json');
                this.validData = fs.readFileSync('./dataset/validTestWithTeamAndPosOneHot.json');
            }else if(encodingType == 'binary'){
                this.trainingData = fs.readFileSync('./dataset/inputTestWithTeamAndPosBinary.json');
                this.validData = fs.readFileSync('./dataset/validTestWithTeamAndPosBinary.json');
            }
            
        }else{
            console.log("unknown type");
        }   
    }

    backprop(iteration){
        console.log("Training....\n")
        let propagate = true;
        let input = JSON.parse(this.trainingData)
        let opt = {
            log: 1000,
            error: 0,
            iterations: iteration,
            rate: 0.0001,
            
        }
        let res = this.network.train(input,opt,propagate);
        console.log("--------------\n");
        return res;


    }

    valid(dataset){
        console.log("Validating....\n");
        let input;
        if(dataset == undefined){
            input = JSON.parse(this.validData);
        }else{
            input = dataset;
        }
        let propagate = false;
        let opt = {
            log: 1,
            error: 0,
            iterations: 1,
            rate: 0.0001,
            
        }
        this.network.train(input,opt,propagate, false);
        console.log("--------------\n")
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

        this.network = architect.Construct(this.nodes);
        
                

    }

    predict(feature){
        console.log(this.network.activate(feature , false));
    }

   
    


}

module.exports = NeuralNetwork;