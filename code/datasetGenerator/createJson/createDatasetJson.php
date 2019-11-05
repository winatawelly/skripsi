<?php

$data = file_get_contents("../dataset/datafile/season14-15/season_stats.json");
$data1 = file_get_contents("../dataset/datafile/season15-16/season_stats.json");
$data2 = file_get_contents("../dataset/datafile/season16-17/season_stats.json");
#$dataValid = file_get_contents("dataset/datafile/season17-18/season_stats.json");
//$data = file_get_contents("dataset/test.json");
$data = json_decode($data,true);
$data1 = json_decode($data1,true);
$data2 = json_decode($data2,true);
#$dataValid = json_decode($dataValid,true);

$fInput = array();
$fOutput = array();
$readCount = 0;
$jsonObj = array();

echo "Reading file...";
foreach($data as $key => $values){
    
    /*
    if($readCount == 50){
        break;
    }
    */
    
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
    
    /*
    echo "<br>";
    $input_str = '';
    for($i = 0 ; $i < count($input) ; $i++){
        if($i == 0){
            $input_str = $input_str.'[';

        }
        $input_str = $input_str.$input[$i].', ';
        if($i == count($input)-1){
            $input_str = $input_str.']';
        }
       
        
    }
    echo $input_str;
    */
    array_push($jsonObj,array('input' => $input , 'output' => $output));
    //array_push($fInput,$input);
    //array_push($fOutput,$output);
}

foreach($data1 as $key => $values){
    
    /*
    if($readCount == 50){
        break;
    }
    */
    
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
    
    /*
    echo "<br>";
    $input_str = '';
    for($i = 0 ; $i < count($input) ; $i++){
        if($i == 0){
            $input_str = $input_str.'[';

        }
        $input_str = $input_str.$input[$i].', ';
        if($i == count($input)-1){
            $input_str = $input_str.']';
        }
       
        
    }
    echo $input_str;
    */
    array_push($jsonObj,array('input' => $input , 'output' => $output));
    //array_push($fInput,$input);
    //array_push($fOutput,$output);
}

foreach($data2 as $key => $values){
    
    /*
    if($readCount == 50){
        break;
    }
    */
    
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
    
    /*
    echo "<br>";
    $input_str = '';
    for($i = 0 ; $i < count($input) ; $i++){
        if($i == 0){
            $input_str = $input_str.'[';

        }
        $input_str = $input_str.$input[$i].', ';
        if($i == count($input)-1){
            $input_str = $input_str.']';
        }
       
        
    }
    echo $input_str;
    */
    array_push($jsonObj,array('input' => $input , 'output' => $output));
    //array_push($fInput,$input);
    //array_push($fOutput,$output);
}







//print("<pre>".print_r($fInput,true)."</pre>");
//print("<pre>".print_r($fOutput,true)."</pre>");

// $input_str = '[';
// $inputCount = 0;
// $outputCount = 0;

// foreach($fInput as $key => $values){
//     $inputCount++;
//     $input_str =  $input_str.'(';
//     foreach($values as $key2 => $values2){
//         $input_str = $input_str.$values2.', ';
//     }
//     $input_str =  $input_str.'),';
    
// }

// $input_str =  $input_str.']';

// $output_str = '[';

// foreach($fOutput as $key => $values){
//     $outputCount++;
//     $output_str =  $output_str.'(';
//     foreach($values as $key2 => $values2){
//         $output_str = $output_str.$values2.', ';
//     }
//     $output_str =  $output_str.'),';
    
// }

// $output_str =  $output_str.']';
$myfile = fopen("inputTestPlayerOnly.json", "w") or die("Unable to open file!");
fwrite($myfile,json_encode($jsonObj))

// fwrite($myfile, $input_str);
// $myfile = fopen("OutputTest.txt", "w") or die("Unable to open file!");
// fwrite($myfile, $output_str);
// echo "<br>Done!";
// echo $inputCount."<br>";
// echo $outputCount."<br>";
// echo json_encode($jsonObj)
//echo $input_str."<br>";
//echo $output_str;




?>