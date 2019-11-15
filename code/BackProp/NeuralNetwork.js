'use strict';
const { Node , architect , Network } = require('neataptic');
const fs = require("fs");
//4448
class NeuralNetwork{

    constructor(node_json , conn_json , type , encodingType){
        this.depth = 5;
        this.prepareData(type , encodingType);
        this.build(node_json , conn_json);
        // this.valid();
        // this.backprop(100000);
        // this.valid();        
        // this.save("test3-config1--afterBackprop");
        //this.functoba();
        //this.valid(this.datasetRealLife);
        //this.valid();
        // for(let i = 0 ; i < 1000 ; i++){
        //     this.valid(this.datasetRealLife);
        //     this.backprop(1000);
        //     this.valid(this.datasetRealLife);
        // }
        
        //this.datasetSortMatchId();
        //this.functoba();
        //this.checkDate();
        //this.createDataset();
        //this.valid();
        //this.sortDataset('./dataset/season1718.json','./dataset/season1718Sorted.json')
        //this.checkDate('./dataset/season1718Sorted.json')
        // console.log(this.labelEncode("GK"))
        this.createRatingText();
    }

    createRatingText(){
        let dataset = JSON.parse(fs.readFileSync('./dataset/rating1415.json'));
        for(let id in dataset){
            console.log(id);
        }
    }

    prepareData(type , encodingType){
        this.dataset = JSON.parse(fs.readFileSync('./dataset/season1718Sorted.json'));
        this.datasetRealLife = JSON.parse(fs.readFileSync('./dataset/realLifeTest.json'))
        // if(type == 1){
        //     this.trainingData = fs.readFileSync('./dataset/inputTestPlayerOnly.json');
        //     this.validData = fs.readFileSync('./dataset/validTestPlayerOnly.json');
        // }else if(type == 2){
        //     this.trainingData = fs.readFileSync('./dataset/inputTestWithTeam.json');
        //     this.validData = fs.readFileSync('./dataset/validTestWithTeam.json');
        // }else if(type == 3){
        //     if(encodingType == 'label'){
        //         this.trainingData = fs.readFileSync('./dataset/inputTestWithTeamAndPosLabel.json');
        //         this.validData = fs.readFileSync('./dataset/validTestWithTeamAndPosLabel.json');

        //     }else if(encodingType == 'oneHot'){
        //         this.trainingData = fs.readFileSync('./dataset/inputTestWithTeamAndPosOneHot.json');
        //         this.validData = fs.readFileSync('./dataset/validTestWithTeamAndPosOneHot.json');
        //     }else if(encodingType == 'binary'){
        //         this.trainingData = fs.readFileSync('./dataset/inputTestWithTeamAndPosBinary.json');
        //         this.validData = fs.readFileSync('./dataset/validTestWithTeamAndPosBinary.json');
        //     }
            
        // }else{
        //     console.log("unknown type");
        // }   
    }

    labelEncode(playerPos){
        let pos = ["GK","DC","DR","DL","DMC","ML","MR","MC","FW","AMC","AMR","AML","FWL","FWR","DMR","DML"];
        let index = pos.indexOf(playerPos);
        //console.log(index)
        return index/15;
    }

    createRatingDataset(){
        //let dataset = JSON.parse(fs.readFileSync('./dataset/season1415Sorted.json'));
        let data = {};
        let count = 0;
        for(let matchId in this.dataset){
            for(let teamId in this.dataset[matchId]){
                if(this.dataset[matchId][teamId]['team_details']['matchday'] > 10){
                    let matchday = this.dataset[matchId][teamId]['team_details']['matchday'];
                    
                    
                    for(let player in this.dataset[matchId][teamId]['Player_stats']){
                        if(this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_position_info'] != 'Sub'){
                            console.log(player);
                            let output = [];
                            let input = [];
                            let playerId = this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_id'];
                            output.push(parseFloat(this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating']));
                            input = this.getRatingData(playerId,matchday);
                            if(input != false){
                                data[count] = {};
                                data[count]['input'] = input;
                                data[count]['output'] = output;
                                //console.log(data);
                                count++;
                            }
                            
                        }
                        
                    }
                }

            }
        }
        
        this.writeJson(data,'./dataset/rating1718.json');


    }

    getRatingData(playerId,matchday){
        //let dataset = JSON.parse(fs.readFileSync('./dataset/datasetFinale.json'));
        let sum = 0;
        let count = 0;
        let rating = 0;
        let result = [];
        for(let i = 379 ; i >= 0 ; i--){
            let matchId = '_'+i;
            let data = {};
            let currTeam = 0;
            let found = false;
            for(let teamId in this.dataset[matchId]){
                if(this.dataset[matchId][teamId]['team_details']['matchday'] < matchday){
                    for(let player in this.dataset[matchId][teamId]['Player_stats']){
                        if(playerId == this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_id'] && this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_position_info'] != 'Sub'){
                            found = teamId;
                            data[teamId] = {};
                            data[teamId]['player_rating'] = parseFloat(this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating']) / 10;
                            data[teamId]['team_rating'] = parseFloat(this.dataset[matchId][teamId]['team_details']['team_rating']) / 10;
                            data[teamId]['pos'] =  this.labelEncode(this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_position_info']) /10;
                            //console.log(this.labelEncode(this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_position_info']))

                            //console.log(this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_name'] , this.dataset[matchId][teamId]['team_details']['matchday'])
                            //sum+= parseFloat(this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating']);
                            //data[currTeam]['player_rating'] = this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating'];
                            count++;
                        }else{
                            data['enemy'] = {};
                            //console.log(parseFloat(this.dataset[matchId][teamId]['team_details']['team_rating']))
                            data['enemy']['team_rating'] = parseFloat(this.dataset[matchId][teamId]['team_details']['team_rating']) /10;
                        }
                    }
                }
                currTeam++;
                
                
            }
            if(found != false){
                result.push(data[found]['player_rating']);
                result.push(data[found]['team_rating']);
                result.push(data[found]['pos']);
                result.push(data['enemy']['team_rating']);
            }
            if(count == this.depth){
                return result;
            }
        }

        return false;

    }

    checkDate(datasetPath){
        let dataset = JSON.parse(fs.readFileSync(datasetPath));
        for(let matchId in dataset){
            for(let teamId in dataset[matchId]){
                console.log(dataset[matchId][teamId]['team_details']['date']);
            }
        }
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

    datasetSortMatchId(){
        let dataset = JSON.parse(fs.readFileSync('./dataset/season1415.json'));
        for(let matchId in dataset){
            console.log(matchId);
        }
        //this.writeJson(dataset,'./dataset/season1415sorted');

    }

    sortDataset(datasetPath , savePath){
        let matchCount = 0;
        let teamList = [];
        let notIncluded = [];
        let tCount = 0;
        let datasetRealLife = JSON.parse(fs.readFileSync(datasetPath));
        let matchDay = {};

      
        //console.log("he");
        let count = 0;
        let temp;
        for(let a = 0 ; a < 10000 ; a++){
            let sorting = 0;
            for(let i = 0 ; i < 379 ; i++){
                let thisMatch = '_'+i;
                let nextMatch = '_'+(i+1);
                let thisDate;
                let nextDate;

                for(let teamId in datasetRealLife[thisMatch]){
                    thisDate = datasetRealLife[thisMatch][teamId]['team_details']['date'];
                }

                for(let teamId in datasetRealLife[nextMatch]){
                    nextDate = datasetRealLife[nextMatch][teamId]['team_details']['date'];
                }
                
                nextDate = nextDate.replace(/\\/g, '');
                thisDate = thisDate.replace(/\\/g, '');
                thisDate = thisDate.split("/");
                nextDate = nextDate.split("/");
                
                
                
                thisDate = new Date(thisDate[2] , thisDate[1] , thisDate[0]);
                nextDate = new Date(nextDate[2] , nextDate[1] , nextDate[0]);
                if(thisDate > nextDate){
                    sorting++;
                    console.log("sorting");
                    let temp = datasetRealLife[thisMatch];
                    datasetRealLife[thisMatch] = datasetRealLife[nextMatch];
                    datasetRealLife[nextMatch] = temp;
                }else{
                }
            }
            console.log(sorting);
            if(sorting == 0){
                break;
            }
            
        }

        for(let matchId in datasetRealLife){
            for(let teamId in datasetRealLife[matchId]){
                matchDay[datasetRealLife[matchId][teamId]['team_details']['team_name']] = 0;
            }
            console.log("\n");
         }
         for(let matchId in datasetRealLife){
             for(let teamId in datasetRealLife[matchId]){
                 matchDay[datasetRealLife[matchId][teamId]['team_details']['team_name']]++;
                 datasetRealLife[matchId][teamId]['team_details']['matchday'] = matchDay[datasetRealLife[matchId][teamId]['team_details']['team_name']];
             }
             console.log("\n");
         }
         
        this.writeJson(datasetRealLife,savePath);
    }

    realLifeTest(){
        let dataset = this.createRealLifeDataset()
        this.valid(dataset);
    }

    getTeamRating(team , matchday){
        let dataset = JSON.parse(fs.readFileSync('./dataset/datasetFinale.json'));
        let sum = 0;
        let count = 0;
        for(let i = 379 ; i >= 0 ; i--){
            let matchId = '_'+i;
            for(let teamId in dataset[matchId]){
                if(dataset[matchId][teamId]['team_details']['team_id'] == team && dataset[matchId][teamId]['team_details']['matchday'] < matchday){
                    //console.log(dataset[matchId][teamId]['team_details']['team_rating'] , dataset[matchId][teamId]['team_details']['matchday']);
                    sum += parseFloat(dataset[matchId][teamId]['team_details']['team_rating']);
                    count++;
                }
            }
            if(count == this.depth){
                return (sum/count)/10;
            }       
        }
        return (sum/count)/10;
    }

    getPlayerRating(playerId , matchday){
        let dataset = JSON.parse(fs.readFileSync('./dataset/datasetFinale.json'));
        let sum = 0;
        let count = 0;
        for(let i = 379 ; i >= 0 ; i--){
            let matchId = '_'+i;
            for(let teamId in dataset[matchId]){
                if(dataset[matchId][teamId]['team_details']['matchday'] < matchday){
                    for(let player in dataset[matchId][teamId]['Player_stats']){
                        if(playerId == dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_id'] && dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_position_info'] != 'Sub'){
                            //console.log(dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_name'] , dataset[matchId][teamId]['team_details']['matchday'])
                            sum+= parseFloat(dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating']);
                            count++;
                        }
                    }
                }
                
            }
            if(count == this.depth){
                return (sum/count)/10;
            }
        }

        if(count == 0){
            return 0.6
        }else{
            return (sum/count)/10;
        }
        

    }

    getPlayerRatingBeta(playerId , matchday){
        let dataset = JSON.parse(fs.readFileSync('./dataset/datasetFinale.json'));
        let sum = 0;
        let count = 0;
        let rating = 0;
        for(let i = 379 ; i >= 0 ; i--){
            let matchId = '_'+i;
            let data = {};
            let currTeam = 0;
            let found = false;
            for(let teamId in dataset[matchId]){
                if(dataset[matchId][teamId]['team_details']['matchday'] < matchday){
                    for(let player in dataset[matchId][teamId]['Player_stats']){
                        if(playerId == dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_id'] && dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_position_info'] != 'Sub'){
                            found = teamId;
                            data[teamId] = {};
                            data[teamId]['player_rating'] = parseFloat(dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating']);
                            data[teamId]['team_rating'] = parseFloat(dataset[matchId][teamId]['team_details']['team_rating']); 

                            //console.log(dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_name'] , dataset[matchId][teamId]['team_details']['matchday'])
                            //sum+= parseFloat(dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating']);
                            //data[currTeam]['player_rating'] = dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating'];
                            count++;
                        }else{
                            data['enemy'] = {};
                            //console.log(parseFloat(dataset[matchId][teamId]['team_details']['team_rating']))
                            data['enemy']['team_rating'] = parseFloat(dataset[matchId][teamId]['team_details']['team_rating']);
                        }
                    }
                }
                currTeam++;
                
                
            }
            if(found != false){
                rating += data[found]['player_rating'] * data[found]['team_rating'] / data['enemy']['team_rating']
                console.log(data);
                //console.log("rating = ", data[found]['player_rating'] * data['enemy']['team_rating']/data[found]['team_rating'])
            }
            if(count == this.depth){
                return (rating/count)/10;
            }
        }

        if(count == 0){
            return 0.6
        }else{
            return (rating/count)/10;
        }
        

    }

    createDataset(){
        this.getPlayerRatingBeta(37204,10)
        return;
        let dataset = JSON.parse(fs.readFileSync('./dataset/datasetFinale.json'));
        let input = [];
        let output = [];
        let obj = {};
        let data = [];
        let count = 0;
        let winner_correct = 0;
        let prediction_correct = 0;
        for(let matchId in dataset){
            obj = {};
            input = [];
            output = [];
            let matchday = 0;
            let home = true;
            for(let teamId in dataset[matchId]){
                if(dataset[matchId][teamId]['team_details']['matchday'] > 5){
                    matchday = dataset[matchId][teamId]['team_details']['matchday'];
                    let team = dataset[matchId][teamId]['team_details']['team_id'];
                    let teamRating = dataset[matchId][teamId]['team_details']['team_rating']/10;
                    console.log(dataset[matchId][teamId]['team_details']['team_name']);
                    if(home){
                        let teamRating = this.getTeamRating(team,matchday);
                        //teamRating += 0.05;
                        input.push(teamRating);
                    }else{
                        input.push(this.getTeamRating(team,matchday));
                    }
                    //input.push(teamRating);
                    

                    if(!dataset[matchId][teamId]['aggregate_stats'].hasOwnProperty('goals')){
                        output.push(0);
                    }else{
                        output.push(dataset[matchId][teamId]['aggregate_stats']['goals']);
                    }

                    for(let player in dataset[matchId][teamId]['Player_stats']){
                        if(dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_position_info'] != 'Sub'){
                            let playerId = dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_id'];
                            if(home){
                                let rating = this.getPlayerRatingBeta(playerId,matchday);
                                //rating += 0.05;
                                input.push(rating);
                            }else{
                                input.push(this.getPlayerRating(playerId,matchday));
                            }

                            // let playerRating = dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating'] / 10;
                            // input.push(playerRating);

                            
                            //console.log(dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_name'] , this.getPlayerRating(playerId,matchday));
                           
                        }
                        
                    }
                    home = false;
                }
                    
            }
            if(matchday > 5){
                let result = this.predict(input);
                result[0] = Math.round(result[0]);
                result[1] = Math.round(result[1]);
                console.log("result =",result,"real = ",output,"\n");
                if(result[0] > result[1] && output[0] > output[1]){
                    winner_correct++;
                    console.log("Winner Correct !",winner_correct);
                   
                }else if(result[0] == result[1] && output[0] == output[1]){
                    winner_correct++;
                    console.log("Winner Correct !",winner_correct);
                    
                }else if(result[0] < result[1] && output[0] < output[1]){
                    winner_correct++;
                    console.log("Winner Correct !",winner_correct);
                   
                }
                if(result[0] == output[0] && result[1] == output[1]){
                    prediction_correct++;
                    console.log("Prection Correct!",prediction_correct);
                   
                }
                count++;
                console.log("winner accuracy = ", winner_correct/count * 100)
                console.log("score accuracy = ", prediction_correct/count * 100)
                console.log("\n")
            }
            
           
            
            
            
            //data.push(obj);
            //countdData++;
            
        }
        console.log("Winner Correct =",winner_correct);
        console.log("Prediction Correct =",prediction_correct)
        //this.writeJson(data ,'./dataset/realLifeTestDepth3');
    }

    createRealLifeDataset(){
        let dataset = []
        let empty = false;
        let countdData = 0;
        let obj = {};
        let input = [];
        let output = [];
        for(let matchId in this.datasetRealLife){
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
        this.network.train(input,opt,propagate, true);
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

    predict(input , output){
        return this.network.activate(input , false);
    }

   
    


}

module.exports = NeuralNetwork;