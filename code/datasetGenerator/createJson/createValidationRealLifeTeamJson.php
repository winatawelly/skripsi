<?php
$first100 = file_get_contents("../dataset/first100.json");
$first100 = json_decode($first100,true);

$fInput = array();
$fOutput = array();
$readCount = 0;
$jsonObj = array();





getTeamRating(167);
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

//$myfile = fopen("validTestWithTeam.json", "w") or die("Unable to open file!");
//fwrite($myfile, json_encode($jsonObj));
// $myfile = fopen("validOutputTest.txt", "w") or die("Unable to open file!");
// fwrite($myfile, $output_str);
// echo "<br>Done!";
// echo $inputCount."<br>";
// echo $outputCount."<br>";
//echo $input_str."<br>";
//echo $output_str;

?>