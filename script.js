let selectedVehicleType = "";
let selectedParkingArea = "";
let pwdSlotsOccupied = { B1: false, B2: false };

let alreadyLogin = false;

$(function () {
  getRecords();
  if (sessionStorage.getItem("isLoggedIn")) {
    $("#login-screen").removeClass("active");
    $("#welcome-screen").addClass("active");
  }
});

// Define slot configurations for each area
const slotConfigurations = {
  "SC Grounds": {
    Car: [
      "PWD1",
      "PWD2",
      "A1",
      "A2",
      "A3",
      "B1",
      "B2",
      "B3",
      "B4",
      "C1",
      "C2",
      "C3",
    ],
    Motorcycle: ["E1", "E2", "E3", "E4", "E5", "E6"],
  },
};

// Update the PWD slot availability display
function checkPWDSlots() {
  const pwdStatus = Object.values(pwdSlotsOccupied).every((status) => status)
    ? "Occupied"
    : "Available";
  $("#pwd-status")
    .text(pwdStatus)
    .attr("class", pwdStatus === "Available" ? "available" : "occupied");
}

// Display the next screen by ID
function nextScreen(screenId) {
  $(".screen").removeClass("active");
  $(`#${screenId}`).addClass("active");
  if (screenId == "vehicle-type-screen") {
    pwdStatus();
  }
}

// Choose vehicle type and navigate to the parking area selection screen
function chooseVehicleType(type) {
  selectedVehicleType = type;
  nextScreen("parking-area-screen");
  checkPWDSlots();
}

// Choose parking area and navigate to the parking slots screen
function chooseParkingArea(area) {
  fetchParkingSlotData();
  selectedParkingArea = area;
  $("#parking-area-name").text(
    `${selectedVehicleType} - ${selectedParkingArea}`
  );
  renderSlots();
  displayNearestAvailableSlot();
  nextScreen("parking-system-screen");
}

// Display the nearest available parking slot
function displayNearestAvailableSlot() {
  const $availableSlot = $(".slot")
    .not(".occupied") // Exclude occupied slots
    .filter(function () {
      return $(this).text() !== "PWD1" && $(this).text() !== "PWD2";
    })
    .first();
  $("#nearest-slot").text(
    $availableSlot.length
      ? `Nearest available slot: ${$availableSlot.text()}`
      : "No slots available"
  );
}

// Display thank you message on Proceed button click
function showThankYouMessage() {
  alert("Thank you for using Vehicle Parking System");
}

$("#login").click(function () {
  const username = $('input[type="text"]').val();
  const password = $('input[type="password"]').val();

  // Check if fields are not empty
  if (username && password) {
    if (username === "admin" && password === "admin123") {
      // Set session storage
      sessionStorage.setItem("isLoggedIn", true);

      // Show the welcome screen
      $("#login-screen").removeClass("active");
      $("#welcome-screen").addClass("active");
    } else {
      alert("Incorrect login credentials");
    }
  } else {
    alert("Please fill in both Username and Password fields.");
  }
});

// Logout button click
$("#logout").click(function () {
  // Clear session storage
  sessionStorage.removeItem("isLoggedIn");

  // Show the login screen
  $("#welcome-screen").removeClass("active");
  $("#login-screen").addClass("active");
});

function fetchParkingSlotData() {
  $.ajax({
    url: "parking-system/index.php",
    method: "GET",
    dataType: "json",
    success: function (data) {
      const slots =
        selectedVehicleType === "Car"
          ? slotConfigurations["SC Grounds"].Car
          : slotConfigurations["SC Grounds"].Motorcycle;

      slots.forEach((slotId, index) => {
        // Map slot index to response data keys
        const slotKey =
          selectedVehicleType === "Car"
            ? `slot${index + 1}`
            : `slot${index + 13}`;

        const $slot = $(`.slot:contains(${slotId})`);

        if (data[slotKey] === 1) {
          $slot.removeClass("occupied").addClass("available");
        } else if (data[slotKey] === 0) {
          $slot.removeClass("available").addClass("occupied");
        }
      });

      // Update nearest available slot display
      displayNearestAvailableSlot();
    },
    error: function (xhr, status, error) {
      console.error("Error fetching parking data:", status, error);
    },
  });
}

function renderSlots() {
  const slots = slotConfigurations["SC Grounds"][selectedVehicleType];
  const $parkingSlotsContainer = $("#parking-slots");
  $parkingSlotsContainer.empty(); // Clear previous slots

  slots.forEach((slotId) => {
    const $slot = $("<div>").addClass("slot available").text(slotId);

    $slot.on("click", () => {
      $slot.toggleClass("occupied");
      pwdSlotsOccupied[slotId] = $slot.hasClass("occupied");
      displayNearestAvailableSlot();
      checkPWDSlots();
    });

    $parkingSlotsContainer.append($slot);
  });
}

function refresh() {
  fetchParkingSlotData();
  renderSlots();
  displayNearestAvailableSlot();
}

function pwdStatus() {
  $.ajax({
    url: "parking-system/index.php",
    method: "GET",
    dataType: "json",
    success: function (data) {
      data["slot1"] == 1
        ? $("#pwd1").addClass("pwd-available")
        : $("#pwd1").addClass("pwd-not-available");

      data["slot2"] == 1
        ? $("#pwd2").addClass("pwd-available")
        : $("#pwd2").addClass("pwd-not-available");
    },
    error: function (xhr, status, error) {
      console.error("Error fetching parking data:", status, error);
    },
  });
}

// function postTest() {
//   const data = "1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,";
//   $.ajax({
//     url: "parking-system/post.php",
//     method: "POST",
//     data: { data: data },
//     dataType: "json",
//     success: function (data) {
//       console.log(data);
//     },
//     error: function (xhr, status, error) {
//       console.error("Error fetching parking data:", status, error);
//     },
//   });
// }

function getRecords() {
  $.ajax({
    url: "parking-system/getRecords.php",
    method: "GET",
    dataType: "json",
    success: function (data) {
      const timestamp = data["timestamp"];
      // Remove the fractional seconds part to make it a valid date string
      const cleanedTimestamp = timestamp.split(".")[0];

      // Create a Date object
      const date = new Date(cleanedTimestamp);

      // Format the date into Month Date, Year
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = date.toLocaleDateString("en-US", options);
      $("#date").text(formattedDate);
      $("#entered_count").text(data["coming_in"]);
      $("#exit_count").text(data["going_out"]);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching parking data:", status, error);
    },
  });
}
