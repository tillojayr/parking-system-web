<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "parking-system";

    // Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if($_SERVER['REQUEST_METHOD'] === 'POST'){

    $postData = $_POST['data'];
    
    if($postData){
         $data = explode(',', $postData);

        $sql = "UPDATE parking SET 
            slot1 = '$data[0]', 
            slot2 = '$data[1]', 
            slot3 = '$data[2]', 
            slot4 = '$data[3]', 
            slot5 = '$data[4]', 
            slot6 = '$data[5]', 
            slot7 = '$data[6]', 
            slot8 = '$data[7]', 
            slot9 = '$data[8]', 
            slot10 = '$data[9]', 
            slot11 = '$data[10]', 
            slot12 = '$data[11]', 
            slot13 = '$data[12]', 
            slot14 = '$data[13]', 
            slot15 = '$data[14]', 
            slot16 = '$data[15]', 
            slot17 = '$data[16]', 
            slot18 = '$data[17]' 
        WHERE id = 1";
    
        $response = $conn->query($sql);
    
        echo json_encode($response);
    }
}
