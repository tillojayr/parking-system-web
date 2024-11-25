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

$sql = "SELECT * FROM parking";
$result = $conn->query($sql);

// Fetch all rows as an associative array
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Cast numeric values to integers
        foreach ($row as $key => $value) {
            if (is_numeric($value)) {
                $row[$key] = (int)$value;
            }
        }
        echo json_encode($row);
    }
}

$conn->close();