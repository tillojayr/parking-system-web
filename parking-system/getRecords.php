<?php

// Output the data as JSON
// header('Content-Type: application/json');

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

if($_SERVER['REQUEST_METHOD'] == 'GET'){

    $today = date('Y-m-d');
    $checkRecordSql = "SELECT * FROM records WHERE DATE(timestamp) = '$today'";
    $result = $conn->query($checkRecordSql);

    if ($result->num_rows > 0) {
        // Record exists for today, update it
        $row = $result->fetch_assoc();
        echo json_encode($row);
    }

}
$conn->close();
