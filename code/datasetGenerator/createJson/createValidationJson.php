<?php

$data = file_get_contents("../dataset/datafile/season17-18/season_stats.json");
$data = json_decode($data,true);

$fInput = array();
$fOutput = array();
$readCount = 0;
$jsonObj = array();

echo "Reading file...";
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
                        //array_push($input,$values4/10);
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
                                    //echo $key6.' = '.$values6.'<br>';
                                }
                            }
                            //echo "<br>";
                        }
                    }
                }
            }
            
        }   
    }
    
   
    array_push($jsonObj,array('input' => $input , 'output' => $output));
    
}


$myfile = fopen("validTestPlayerOnly.json", "w") or die("Unable to open file!");
fwrite($myfile,json_encode($jsonObj))




?>