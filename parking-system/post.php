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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = $_POST['data'];

    if ($postData) {
        $data = explode(',', $postData);

        // Handle records table
        $today = date('Y-m-d');
        $checkRecordSql = "SELECT * FROM records WHERE DATE(timestamp) = '$today'";
        $result = $conn->query($checkRecordSql);

        $newComingIn = 0;
        $newGoingOut = 0;

        if ($result->num_rows > 0) {
            // Record exists for today, update it
            $row = $result->fetch_assoc();

            // Calculate changes
            $prev = "SELECT * FROM parking";
            $row1 = $conn->query($prev);
            $slots = $row1->fetch_assoc();
            $previousData = array_slice($slots, 1, 18); // Get slot1-slot18 from database
            $comingInCount = 0;
            $goingOutCount = 0;

            for ($i = 0; $i < count($data) - 1; $i++) {
                if ($previousData["slot" . ($i + 1)] == 1 && $data[$i] == 0) {
                    $comingInCount++; // Car moved into a slot
                } elseif ($previousData["slot" . ($i + 1)] == 0 && $data[$i] == 1) {
                    $goingOutCount++; // Car vacated a slot
                }
            }

            $newComingIn = $row['coming_in'] + $comingInCount;
            $newGoingOut = $row['going_out'] + $goingOutCount;

            // Update today's record
            $updateRecordSql = "UPDATE records SET 
                coming_in = '$newComingIn', 
                going_out = '$newGoingOut', 
                timestamp = NOW()
            WHERE DATE(timestamp) = '$today'";
            $conn->query($updateRecordSql);
        } else {
            // No record for today, create a new one
            $newRecordSql = "INSERT INTO records (coming_in, going_out, timestamp) VALUES (0, 0, NOW())";
            $conn->query($newRecordSql);
        }

        // Update parking table
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

        $conn->query($sql);

        echo json_encode([
            "status" => "success",
            "coming_in" => $newComingIn,
            "going_out" => $newGoingOut,
        ]);
    }
}

$conn->close();
?>
