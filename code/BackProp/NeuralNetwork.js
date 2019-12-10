'use strict';
const { Node , architect , Network } = require('neataptic');
const fs = require("fs");
//4448
class NeuralNetwork{

    constructor(node_json , conn_json , type , encodingType){
        //prepare the data
        this.prepareData(type , encodingType);
        //build the network
        this.network = this.build(node_json,conn_json)
    }

    test(){
        let dataset;
        for(let i = 0 ; i < 3 ; i++){
            if(i == 0){
                dataset = JSON.parse(fs.readFileSync('./dataset/rating1415.json'));
            }else if (i == 2){
                dataset = JSON.parse(fs.readFileSync('./dataset/rating1516.json'));
            }else{
                dataset = JSON.parse(fs.readFileSync('./dataset/rating1617.json'));
            }
            for(let i in dataset){
                console.log(i);
            }
        }
    }

    prepareData(type , encodingType){
        this.depth = 5;
        this.dataset = JSON.parse(fs    .readFileSync('./dataset/datasetFinale.json'));
        this.datasetRealLife = JSON.parse(fs.readFileSync('./dataset/realLifeTest.json'))
        if(type == 1){
            this.trainingData = JSON.parse(fs.readFileSync('./dataset/inputTestPlayerOnly.json'));
            this.validData = JSON.parse(fs.readFileSync('./dataset/validTestPlayerOnly.json'));
        }else if(type == 2){
            this.trainingData = JSON.parse(fs.readFileSync('./dataset/inputTestWithTeam.json'));
            this.validData = JSON.parse(fs.readFileSync('./dataset/validTestWithTeam.json'));
        }else if(type == 3){
            if(encodingType == 'label'){
                this.trainingData = JSON.parse(fs.readFileSync('./dataset/inputTestWithTeamAndPosLabel.json'));
                this.validData = fs.readFileSync('./dataset/validTestWithTeamAndPosLabel.json');

            }else if(encodingType == 'oneHot'){
                this.trainingData = JSON.parse(fs.readFileSync('./dataset/inputTestWithTeamAndPosOneHot.json'));
                this.validData = JSON.parse(fs.readFileSync('./dataset/validTestWithTeamAndPosOneHot.json'));
            }else if(encodingType == 'binary'){
                this.trainingData = JSON.parse(fs.readFileSync('./dataset/inputTestWithTeamAndPosBinary.json'));
                this.validData = JSON.parse(fs.readFileSync('./dataset/validTestWithTeamAndPosBinary.json'));
            }   
        }else if(type == 4){
            //type 4 is rating predictor network
            this.trainingData = JSON.parse(fs.readFileSync('./dataset/inputRatingDataset.json'));
            this.validData = JSON.parse(fs.readFileSync('./dataset/validRatingDataset.json'));
        }
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

        return architect.Construct(this.nodes , 'NEAT');
    }

    backprop(iteration,learningRate,dataset){
        //the dataset must be parsed first!
        console.log("Training....\n")
        let propagate = true;
        let input;
        if(dataset == undefined){
            input = this.trainingData;
        }else{
            input = dataset;
        }
        
        let opt = {
            log: 1,
            error: 0,
            iterations: iteration,
            rate: learningRate,
            
        }
        let res = this.network.train(input,opt,propagate);
        console.log("--------------\n");
        return res;
    }

    valid(showOutput,dataset){
        console.log("Validating....\n");
        let input;
        if(dataset == undefined){
            input = this.validData;
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
        this.network.train(input,opt,propagate,showOutput);
        console.log("--------------\n")
    }

    // constructor(node_json , conn_json , type , encodingType){
    //     this.depth = 5;
    //     this.prepareData(type , encodingType);
    //     this.netwrok = this.build(node_json , conn_json);
    //     // this.backprop(this.netwrok,1000,this.trainingData);
    //     // this.valid(this.netwrok)
    //     this.ratingNetwork = this.build('./config/rating-config1-node_data.json', './config/rating-config1-conn_data.json');
    //     this.validRating = JSON.parse(fs.readFileSync('./dataset/validRatingDataset.json'));
        
    //     this.backprop(this.ratingNetwork,10000,fs.readFileSync('./dataset/inputRatingDataset.json'))
    //     this.valid(this.ratingNetwork, this.validRating)
    //     // this.valid();
    //     // this.backprop(100000);
    //     // this.valid();        
    //     // this.save("test3-config1--afterBackprop");
    //     //this.functoba();
    //     //this.valid(this.datasetRealLife);
    //     //this.valid();
    //     // for(let i = 0 ; i < 1000 ; i++){
    //     //     this.valid(this.datasetRealLife);
    //     //     this.backprop(1000);
    //     //     this.valid(this.datasetRealLife);
    //     // }
        
    //     //this.datasetSortMatchId();
    //     //this.functoba();
    //     //this.checkDate();
    //     //this.createDataset();
    //     //this.valid();
    //     //this.sortDataset('./dataset/season1718.json','./dataset/season1718Sorted.json')
    //     //this.checkDate('./dataset/season1718Sorted.json')
    //     // console.log(this.labelEncode("GK"))
    //     //this.createRatingText();
    //     //this.convertDatasetBETA();
    // }

    convertDatasetBETA(){
        let dataset = JSON.parse(fs.readFileSync('./dataset/rating1415.json'));
        let arr = [];
        for(let id in dataset){
            let obj = {};
            obj['input'] = dataset[id]['input'];
            obj['output'] = dataset[id]['output'];
            arr.push(obj);
        }
        dataset = JSON.parse(fs.readFileSync('./dataset/rating1516.json'));
        for(let id in dataset){
            let obj = {};
            obj['input'] = dataset[id]['input'];
            obj['output'] = dataset[id]['output'];
            arr.push(obj);
        }
        dataset = JSON.parse(fs.readFileSync('./dataset/rating1617.json'));
        for(let id in dataset){
            let obj = {};
            obj['input'] = dataset[id]['input'];
            obj['output'] = dataset[id]['output'];
            arr.push(obj);
        }
        this.writeJson(arr,'./dataset/inputRatingDataset.json');
        arr = [];
        dataset = JSON.parse(fs.readFileSync('./dataset/rating1718.json'));
        for(let id in dataset){
            let obj = {};
            obj['input'] = dataset[id]['input'];
            obj['output'] = dataset[id]['output'];
            arr.push(obj);
        }
        this.writeJson(arr,'./dataset/validRatingDataset.json');
        
        
    }

    createRatingTextBETA(){
        let dataset = JSON.parse(fs.readFileSync('./dataset/rating1415.json'));
        for(let id in dataset){
            console.log(id);
        }
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
            let arr = [];
            let found = false;
            for(let teamId in this.dataset[matchId]){
                arr.push(teamId);
            }
            for(let teamId in this.dataset[matchId]){
                if(this.dataset[matchId][teamId]['team_details']['matchday'] > 10){
                    let matchday = this.dataset[matchId][teamId]['team_details']['matchday'];
                    for(let player in this.dataset[matchId][teamId]['Player_stats']){
                        if(this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_position_info'] != 'Sub'){
                            found = teamId;
                            let output = [];
                            let input = [];
                            let playerId = this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_id'];
                            output.push(parseFloat(this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating']));
                            input = this.getRatingData(playerId,matchday);
                            if(input != false){
                                console.log(player);
                                if(arr[0] == found){
                                    input.push(this.getTeamRating(arr[0],matchday));
                                    input.push(this.getTeamRating(arr[1],matchday));
                                }else if(arr[1] == found){
                                    input.push(this.getTeamRating(arr[1],matchday));
                                    input.push(this.getTeamRating(arr[0],matchday));
                                }
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

    getData(pid , md){
        let dataset = this.dataset
        let data = {};
        let count = 0;
        for(let matchId in dataset){
            let arr = [];
            let found = false;
            for(let teamId in dataset[matchId]){
                arr.push(teamId);
            }
            for(let teamId in dataset[matchId]){
                if(dataset[matchId][teamId]['team_details']['matchday'] == md){
                    let matchday = dataset[matchId][teamId]['team_details']['matchday'];
                    for(let player in dataset[matchId][teamId]['Player_stats']){
                        if(dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_position_info'] != 'Sub' && dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_id'] == pid ){
                            found = teamId;
                            let output = [];
                            let input = [];
                            let playerId = dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_id'];
                            output.push(parseFloat(dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating']));
                            input = this.getRatingData(playerId,md);
                            if(input != false){
                                if(arr[0] == found){
                                    input.push(this.getTeamRating(arr[0],matchday));
                                    input.push(this.getTeamRating(arr[1],matchday));
                                }else if(arr[1] == found){
                                    input.push(this.getTeamRating(arr[1],matchday));
                                    input.push(this.getTeamRating(arr[0],matchday));
                                }
                                data[count] = {};
                                data[count]['input'] = input;
                                data[count]['output'] = output;
                                //console.log(data);
                                count++;
                            }
                            //console.log(input);
                            //console.log(input)
                            //console.log(input)
                            //console.log(input)
                            return input;
                        }
                        
                        
                    }
                }

            }
        }
        
        //this.writeJson(data,'./dataset/rating1718.json');


    }

    getRatingData(playerId,matchday){
        let dataset = this.dataset
        let sum = 0;
        let count = 0;
        let rating = 0;
        let result = [];
        for(let i = 379 ; i >= 0 ; i--){
            let matchId = '_'+i;
            let data = {};
            let currTeam = 0;
            let found = false;
            let arrTeam = [];
            for(let teamId in dataset[matchId]){
                arrTeam.push(teamId);
                if(dataset[matchId][teamId]['team_details']['matchday'] < matchday){
                    for(let player in dataset[matchId][teamId]['Player_stats']){
                        if(playerId == dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_id'] && dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating'] != '0'){
                            
                            found = teamId;
                            data[teamId] = {};
                            data[teamId]['player_rating'] = parseFloat(dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating']) / 10;
                            data[teamId]['team_rating'] = parseFloat(dataset[matchId][teamId]['team_details']['team_rating']) / 10;
                            if(dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_position_info'] != 'Sub'){
                                data[teamId]['pos'] =  this.labelEncode(dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_position_info']) /10;
                            }else{
                                data[teamId]['pos'] =  0;
                            }
                            
                            //console.log(this.labelEncode(dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_position_info']))
                            //console.log(dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_name'] , dataset[matchId][teamId]['team_details']['matchday'])
                            //sum+= parseFloat(dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating']);
                            //data[currTeam]['player_rating'] = dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating'];
                            count++;
                            
                        }
                    }
                }
                currTeam++;
                
                
            }
            if(found != false){
                data['enemy'] = {};
                if(arrTeam[0] == found){
                   
                    //console.log(parseFloat(dataset[matchId][teamId]['team_details']['team_rating']))
                    data['enemy']['team_rating'] = parseFloat(dataset[matchId][arrTeam[1]]['team_details']['team_rating']) /10;
                    
                }else{
                    
                    //console.log(parseFloat(dataset[matchId][teamId]['team_details']['team_rating']))
                    data['enemy']['team_rating'] = parseFloat(dataset[matchId][arrTeam[0]]['team_details']['team_rating']) /10;
                }
                //console.log(data);
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
        fs.writeFileSync(path, jsonString, err => {
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

    getTeamRating(team , matchday){
        let sum = 0;
        let count = 0;
        for(let i = 379 ; i >= 0 ; i--){
            let matchId = '_'+i;
            for(let teamId in this.dataset[matchId]){
                if((teamId == team || this.dataset[matchId][teamId]['team_details']['team_id'] == team) && this.dataset[matchId][teamId]['team_details']['matchday'] < matchday){
                    //console.log(this.dataset[matchId][teamId]['team_details']['team_name'] , this.dataset[matchId][teamId]['team_details']['team_rating']);
                    sum += parseFloat(this.dataset[matchId][teamId]['team_details']['team_rating']);
                    count++;
                }
            }
            if(count == this.depth){
                return (sum/count)/10;
            }       
        }
        return (sum/count)/10;
    }

    getPlayerRatingAverage(playerId , matchday){
        let dataset = this.dataset
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
            return 0.55
        }else{
            return (sum/count)/10;
        }
        

    }

    getPlayerRatingBeta(playerId , matchday){
        let dataset = this.dataset//JSON.parse(fs.readFileSync("./dataset/datasetFinale.json"))
        let sum = 0;
        let count = 0;
        let rating = 0;
        for(let i = 379 ; i >= 0 ; i--){
            let matchId = '_'+i;
            let data = {};
            let currTeam = 0;
            let found = false;
            let arrTeam = [];
            for(let teamId in dataset[matchId]){
                arrTeam.push(teamId);
                if(dataset[matchId][teamId]['team_details']['matchday'] < matchday){
                    for(let player in dataset[matchId][teamId]['Player_stats']){
                        if(playerId == dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_id'] && dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_position_info'] != 'Sub'){
                            found = teamId;
                            data[teamId] = {};
                            data[teamId]['player_rating'] = parseFloat(dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating']) / 10;
                            data[teamId]['team_rating'] = parseFloat(dataset[matchId][teamId]['team_details']['team_rating']) / 10; 

                            //console.log(dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_name'] , dataset[matchId][teamId]['team_details']['matchday'])
                            //sum+= parseFloat(dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating']);
                            //data[currTeam]['player_rating'] = dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating'];
                            count++;
                        }
                    }
                }
                currTeam++;
                
                
            }
            if(found != false){
                data['enemy'] = {};
                if(arrTeam[0] == found){
                    //console.log(parseFloat(dataset[matchId][teamId]['team_details']['team_rating']))
                    data['enemy']['team_rating'] = parseFloat(dataset[matchId][arrTeam[1]]['team_details']['team_rating']) /10;
                    
                }else{
                    //console.log(parseFloat(dataset[matchId][teamId]['team_details']['team_rating']))
                    data['enemy']['team_rating'] = parseFloat(dataset[matchId][arrTeam[0]]['team_details']['team_rating']) /10;
                }
                rating += data[found]['player_rating'] * data['enemy']['team_rating'] / data[found]['team_rating']
                //console.log(data);
                //console.log("rating = ", data[found]['player_rating'] * data['enemy']['team_rating']/data[found]['team_rating'])
            }
            if(count == this.depth){
                return (rating/count);
            }
        }

        if(count == 0){
            return 0.6
        }else{
            return (rating/count);
        }
        

    }

    realLifeTestNN(ratingNetwork , start){
        if(start == undefined){
            start = 10;
        }
        let dataset = this.dataset
        let input = [];
        let output = [];
        let obj = {};
        let data = [];
        let count = 0;
        let prediction_correct = 0;
        let score_correct = 0;
        for(let matchId in dataset){
            obj = {};
            input = [];
            output = [];
            let matchday = 0;
            let home = true;
            for(let teamId in dataset[matchId]){
                if(dataset[matchId][teamId]['team_details']['matchday'] > start){
                    matchday = dataset[matchId][teamId]['team_details']['matchday'];
                    let team = dataset[matchId][teamId]['team_details']['team_id'];
                    //let teamRating = dataset[matchId][teamId]['team_details']['team_rating']/10;
                    console.log(dataset[matchId][teamId]['team_details']['team_name']);
                    let teamRating = this.getTeamRating(team,matchday);
                    input.push(teamRating);
                    console.log(teamRating)
                    
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
                                //let rating = this.getPlayerRatingBeta(playerId,matchday);
                                let rating = ratingNetwork.activate(this.getData(playerId,matchday))
                                //rating += 0.05;
                               
                                input.push(rating[0]/10);
                            }else{
                                let rating = ratingNetwork.activate(this.getData(playerId,matchday))
                              
                                input.push(rating[0]/10);
                            }                           
                        }
                        
                    }
                    home = false;
                }
                    
            }
            if(matchday > start ){
                console.log(matchId);
                let result = this.predict(input);
                console.log(input)
                result[0] = Math.round(result[0]);
                result[1] = Math.round(result[1]);
                console.log("result =",result,"real = ",output,"\n");
                if(result[0] > result[1] && output[0] > output[1]){
                    prediction_correct++;
                    console.log("prediction Correct !",prediction_correct);
                   
                }else if(result[0] == result[1] && output[0] == output[1]){
                    prediction_correct++;
                    console.log("prediction Correct !",prediction_correct);
                    
                }else if(result[0] < result[1] && output[0] < output[1]){
                    prediction_correct++;
                    console.log("prediction Correct !",prediction_correct);
                   
                }
                if(result[0] == output[0] && result[1] == output[1]){
                    score_correct++;
                    console.log("score Correct!",score_correct);
                   
                }
                count++;
                console.log("prediction accuracy = ", prediction_correct/count * 100)
                console.log("score accuracy = ", score_correct/count * 100)
                console.log("\n")
                
            }
            
           
            
            
            
            //data.push(obj);
            //countdData++;
            
        }
        console.log("prediction Correct =",prediction_correct);
        console.log("score Correct =",score_correct)
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

    predict(input , output){
        return this.network.activate(input , false);
    }

    realLifeTestAverage(showDetails , start){
        let prediction_correct = 0;
        let score_correct = 0;
        if(start == undefined){
            start = 10;
        }
        for(let matchId in this.dataset){
            let input = [];
            let output = [];
            let matchday = 0;
            for(let teamId in this.dataset[matchId]){
                if(this.dataset[matchId][teamId]['team_details']['matchday'] > start){
                    matchday = this.dataset[matchId][teamId]['team_details']['matchday'];
                    let team = this.dataset[matchId][teamId]['team_details']['team_id'];
                    let teamName = this.dataset[matchId][teamId]['team_details']['team_name'];
                    let teamRating = this.getTeamRating(team,matchday);
                    input.push(teamRating);
                    if(!this.dataset[matchId][teamId]['aggregate_stats'].hasOwnProperty('goals')){
                        output.push(0);
                    }else{
                        output.push(this.dataset[matchId][teamId]['aggregate_stats']['goals']);
                    }
                    if(showDetails){
                        console.log(teamName , teamRating);    
                    }
                    
                    for(let player in this.dataset[matchId][teamId]['Player_stats']){
                        if(this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_position_info'] != 'Sub'){
                            let playerId = this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_id']
                            let rating = this.getPlayerRatingAverage(playerId,matchday);
                            input.push(rating);
                            if(showDetails){
                                console.log(player,rating);
                            }
                            
                        }
                    }
                    console.log("\n")
                }
               
            }
            if(matchday > start){
                let result = this.predict(input);
                result[0] = Math.round(result[0]);
                result[1] = Math.round(result[1]);
                console.log("result =",result,"real = ",output);
                if(result[0] > result[1] && output[0] > output[1]){
                    prediction_correct++;
                    console.log("Prediction Correct !",prediction_correct);
                   
                }else if(result[0] == result[1] && output[0] == output[1]){
                    prediction_correct++;
                    console.log("Prediction Correct !",prediction_correct);
                    
                }else if(result[0] < result[1] && output[0] < output[1]){
                    prediction_correct++;
                    console.log("Prediction Correct !",prediction_correct);
                   
                }
                if(result[0] == output[0] && result[1] == output[1]){
                    score_correct++;
                    console.log("Score Correct!",score_correct);
                }
                console.log("\n")                    
            }
            
        }
        console.log("Prediction Correct =",prediction_correct)
        console.log("Score Correct =",score_correct)
        
    }

    realLifeTestAverageWeight(showDetails , start){
        let prediction_correct = 0;
        let score_correct = 0;
        if(start == undefined){
            start = 10;
        }
        for(let matchId in this.dataset){
            let input = [];
            let output = [];
            let matchday = 0;
            for(let teamId in this.dataset[matchId]){
                if(this.dataset[matchId][teamId]['team_details']['matchday'] > start){
                    matchday = this.dataset[matchId][teamId]['team_details']['matchday'];
                    let team = this.dataset[matchId][teamId]['team_details']['team_id'];
                    let teamName = this.dataset[matchId][teamId]['team_details']['team_name'];
                    let teamRating = this.getTeamRating(team,matchday);
                    input.push(teamRating);
                    if(!this.dataset[matchId][teamId]['aggregate_stats'].hasOwnProperty('goals')){
                        output.push(0);
                    }else{
                        output.push(this.dataset[matchId][teamId]['aggregate_stats']['goals']);
                    }
                    if(showDetails){
                        console.log(teamName , teamRating);    
                    }
                    
                    for(let player in this.dataset[matchId][teamId]['Player_stats']){
                        if(this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_position_info'] != 'Sub'){
                            let playerId = this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_id']
                            let rating = this.getPlayerRatingBeta(playerId,matchday);
                            input.push(rating);
                            if(showDetails){
                                console.log(player,rating);
                            }
                            
                        }
                    }
                    console.log("\n")
                }
               
            }
            if(matchday > start){
                let result = this.predict(input);
                result[0] = Math.round(result[0]);
                result[1] = Math.round(result[1]);
                console.log("result =",result,"real = ",output);
                if(result[0] > result[1] && output[0] > output[1]){
                    prediction_correct++;
                    console.log("Prediction Correct !",prediction_correct);
                   
                }else if(result[0] == result[1] && output[0] == output[1]){
                    prediction_correct++;
                    console.log("Prediction Correct !",prediction_correct);
                    
                }else if(result[0] < result[1] && output[0] < output[1]){
                    prediction_correct++;
                    console.log("Prediction Correct !",prediction_correct);
                   
                }
                if(result[0] == output[0] && result[1] == output[1]){
                    score_correct++;
                    console.log("Score Correct!",score_correct);
                }
                console.log("\n")                    
            }
            
        }
        console.log("Prediction Correct =",prediction_correct)
        console.log("Score Correct =",score_correct)
        
    }

    realLifeTestRealRating(showDetails , start){
        let returnData = [];
        let prediction_correct = 0;
        let score_correct = 0;
        if(start == undefined){
            start = 10;
        }
        for(let matchId in this.dataset){
            if(matchId != '_19'){
                continue;
            }
            let returnObj = {};
            returnObj['Home'] = {};
            returnObj['Away'] = {};
            let input = [];
            let output = [];
            let matchday = 0;
            let count = 0;
            for(let teamId in this.dataset[matchId]){
                if(this.dataset[matchId][teamId]['team_details']['matchday'] > start){
                    matchday = this.dataset[matchId][teamId]['team_details']['matchday'];
                    let team = this.dataset[matchId][teamId]['team_details']['team_id'];
                    let teamName = this.dataset[matchId][teamId]['team_details']['team_name'];
                    let teamRating = this.dataset[matchId][teamId]['team_details']['team_rating'] / 10;
                    input.push(teamRating);
                    if(!this.dataset[matchId][teamId]['aggregate_stats'].hasOwnProperty('goals')){
                        output.push(0);
                    }else{
                        output.push(this.dataset[matchId][teamId]['aggregate_stats']['goals']);
                    }
                    if(showDetails){
                        console.log(teamName , teamRating);    
                    }
                    if(count == 0){
                        returnObj['_Team_Home'] = teamName;
                        returnObj['_Team_Home_Rating'] = teamRating;
                        
                    }else{
                        returnObj['_Team_Away'] = teamName;
                        returnObj['_Team_Away_Rating'] = teamRating;
                    }
                    
                    
                   
                    
                    for(let player in this.dataset[matchId][teamId]['Player_stats']){
                        if(this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_position_info'] != 'Sub'){
                            let playerId = this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_id']
                            let rating = this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating'] / 10
                            input.push(rating);
                            if(showDetails){
                                console.log(player,rating);
                            }
                            if(count == 0){
                                returnObj['Home']['_'+player] = rating;
                            }else{
                                returnObj['Away']['_'+player] = rating;
                            }
                            
                            
                            
                        }
                    }
                    count++;
                    console.log("\n")
                }
               
            }
            if(matchday > start){
                console.log(input)
                let result = this.predict(input);
                result[0] = Math.round(result[0]);
                result[1] = Math.round(result[1]);
                returnObj['_real_result'] = `${output[0]} - ${output[1]}`;
                returnObj['_predicted_result'] = `${result[0]} - ${result[1]}`;
                returnData.push(returnObj);
                console.log("result =",result,"real = ",output);
                if(result[0] > result[1] && output[0] > output[1]){
                    prediction_correct++;
                    console.log("Prediction Correct !",prediction_correct);
                   
                }else if(result[0] == result[1] && output[0] == output[1]){
                    prediction_correct++;
                    console.log("Prediction Correct !",prediction_correct);
                    
                }else if(result[0] < result[1] && output[0] < output[1]){
                    prediction_correct++;
                    console.log("Prediction Correct !",prediction_correct);
                   
                }
                if(result[0] == output[0] && result[1] == output[1]){
                    score_correct++;
                    console.log("Score Correct!",score_correct);
                }
                console.log("\n")                    
            }
            
        }
        console.log("Prediction Correct =",prediction_correct)
        console.log("Score Correct =",score_correct)
        this.writeJson(returnData,'testingResultReal.json')
        
    }

    getPlayerRatingAll(playerId){
        for(let matchId in this.dataset){
            for(let teamId in this.dataset[matchId]){
                for(let player in this.dataset[matchId][teamId]['Player_stats']){
                    if(playerId == this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_id']){
                        console.log(this.dataset[matchId][teamId]['Player_stats'][player]['player_details']['player_rating'])
                    }
                }
            }
        }
    }
   
    


}

module.exports = NeuralNetwork;