<?php

$fInput = array();
$fOutput = array();
$readCount = 0;
$count = 0;
$jsonObj = array();


set_time_limit(300);


function oneHotEncode($item){
    $pos = array("GK","DC","DR","DL","DMC","ML","MR","MC","FW","AMC","AMR","AML","FWL","FWR","DMR","DML");
    for($i = 0 ; $i < 16 ; $i++){
        if($pos[$i] == $item){
            $encoded = array_fill(0, 16, 0);
            $encoded[$i] = 1;
        }
    }

    return $encoded;

}


oneHotEncode('GK');
echo "Reading file...";

for($i = 0 ; $i < 3 ; $i++){
    if($i == 0){
        $data = json_decode(file_get_contents("../dataset/datafile/season14-15/season_stats.json"),true);
    }else if($i == 1){
        $data = json_decode(file_get_contents("../dataset/datafile/season15-16/season_stats.json"),true);
    }else if($i == 2){
        $data = json_decode(file_get_contents("../dataset/datafile/season16-17/season_stats.json"),true);

    }

    foreach($data as $key => $values){    
        $input = array();
        $output = array();
        $readCount++;
        foreach($values as $key2 => $values2){
            //echo "<br><br>";
            foreach($values2 as $key3 => $values3){
                if($key3 == 'team_details'){
                    foreach($values3 as $key4 => $values4){
                        if($key4 == 'team_rating'){
                            //team name and team rating
                            //echo $key4." = ".$values4."<br>";
                            array_push($input,$values4/10);
                        }
                        
                    }
                }
                if($key3 == 'aggregate_stats'){
                    $noGoal = false;
                    foreach($values3 as $key4 => $values4){
                        if($key4 == 'goals'){
                            //goal(s) scored
                            //echo $key4." = ".$values4."<br>";
                            array_push($output,(int)$values4);
                            $noGoal = true;
                        }
                        
                    }
                    if($noGoal == false){
                        array_push($output,0);
                    }
                    //echo "<br>";
                }
                if($key3 == 'Player_stats'){
                    foreach($values3 as $key4 => $values4){
                        //player name
                        //echo $key4."<br>";
                        foreach($values4 as $key5 => $values5){
                            if($key5 == 'player_details'){
                                //player name, position, and rating
                                foreach($values5 as $key6 => $values6){
                                    if($key6 == 'player_position_info' || $key6 == 'player_rating' ){
                                        if($values6 == 'Sub'){
                                            break;
                                        }else if($key6 == 'player_rating'){
                                            array_push($input,$values6/10);
                                        }
                                        else if($key6 == 'player_position_info'){
                                            $encoded = oneHotEncode($values6);
                                            for($j = 0 ; $j < 16 ; $j++){
                                                array_push($input,$encoded[$j]);
                                            }
    
                                        }
                                        
                                    }
                                }
                                //echo "<br>";
                            }
                        }
                    }
                }
                
            }   
        }
        
        //print_r($input);
        
        array_push($jsonObj,array('input' => $input , 'output' => $output));
    }
}


$myfile = fopen("inputTestWithTeamAndPos.json", "w") or die("Unable to open file!");
fwrite($myfile, json_encode($jsonObj));

//echo $input_str."<br>";
//echo $output_str;




?>