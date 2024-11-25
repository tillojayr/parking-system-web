let selectedVehicleType = "";
let selectedParkingArea = "";
let pwdSlotsOccupied = { B1: false, B2: false };

// Define slot configurations for each area
const slotConfigurations = {
  "SC Grounds": {
    Car: [
      "A1",
      "A2",
      "A3",
      "B1",
      "B2",
      "C1",
      "C2",
      "C3",
      "D1",
      "D2",
      "D3",
      "D4",
    ],
    Motorcycle: ["E1", "E2", "E3", "E4", "E5", "E6"],
  },
  "SB Grounds": {
    Car: [
      "Slot 1",
      "Slot 2",
      "Slot 3",
      "Slot 4",
      "Slot 5",
      "Slot 6",
      "Slot 7",
      "Slot 8",
      "Slot 9",
      "Slot 10",
    ],
    Motorcycle: [
      "Slot 1",
      "Slot 2",
      "Slot 3",
      "Slot 4",
      "Slot 5",
      "Slot 6",
      "Slot 7",
      "Slot 8",
    ],
  },
  "LSU - IS": {
    Car: [
      "Slot 1",
      "Slot 2",
      "Slot 3",
      "Slot 4",
      "Slot 5",
      "Slot 6",
      "Slot 7",
      "Slot 8",
      "Slot 9",
      "Slot 10",
      "Slot 11",
      "Slot 12",
    ],
    Motorcycle: ["Slot 1", "Slot 2", "Slot 3", "Slot 4", "Slot 5", "Slot 6"],
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
}

// Choose vehicle type and navigate to the parking area selection screen
function chooseVehicleType(type) {
  selectedVehicleType = type;
  nextScreen("parking-area-screen");
  checkPWDSlots();
}

// Choose parking area and navigate to the parking slots screen
function chooseParkingArea(area) {
  selectedParkingArea = area;
  $("#parking-area-name").text(
    `${selectedVehicleType} - ${selectedParkingArea}`
  );
  renderSlots();
  displayNearestAvailableSlot();
  nextScreen("parking-system-screen");
}

// Render parking slots based on selected area and vehicle type
function renderSlots() {
  const slots = slotConfigurations[selectedParkingArea][selectedVehicleType];
  const $parkingSlotsContainer = $("#parking-slots");
  $parkingSlotsContainer.empty(); // Clear previous slots

  slots.forEach((slotId) => {
    const $slot = $("<div>").addClass("slot").text(slotId);
    if (slotId === "B1" || slotId === "B2") $slot.addClass("pwd");

    $slot.on("click", () => {
      $slot.toggleClass("occupied");
      pwdSlotsOccupied[slotId] = $slot.hasClass("occupied");
      displayNearestAvailableSlot();
      checkPWDSlots();
    });

    $parkingSlotsContainer.append($slot);
  });
}

// Display the nearest available parking slot
function displayNearestAvailableSlot() {
  const $availableSlot = $(".slot").not(".occupied").first();
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
      $("#login-screen").removeClass("active");
      $("#welcome-screen").addClass("active");
    } else {
      alert("Incorrect login credentials");
    }
  } else {
    alert("Please fill in both Username and Password fields.");
  }
});
