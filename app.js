// ===========================================
// DRIVER FUNCTIONS
// ===========================================// Scuber App - Version 1


// ===========================================
// SCHEDULE FUNCTIONS
// ===========================================

function openSchedule() {

    document.getElementById("schedule-screen")
    .classList.remove("hidden");

}


function confirmRide() {

    let pickup = document.getElementById("pickup").value;
    let destination = document.getElementById("destination").value;
    let date = document.getElementById("ride-date").value;
    let time = document.getElementById("ride-time").value;


    alert(
        "Ride Scheduled!\n\n" +
        "Pickup: " + pickup +
        "\nDestination: " + destination +
        "\nDate: " + date +
        "\nTime: " + time
    );

}


function openRecurring() {

    document.getElementById("recurring-screen")
    .classList.remove("hidden");

}


function confirmRecurring() {

    let pickup = document.getElementById("repeat-pickup").value;
    let destination = document.getElementById("repeat-destination").value;
    let day = document.getElementById("repeat-day").value;
    let time = document.getElementById("repeat-time").value;


    alert(
        "Recurring Ride Saved!\n\n" +
        "Pickup: " + pickup +
        "\nDestination: " + destination +
        "\nEvery: " + day +
        "\nTime: " + time
    );

}
// ===========================================
// ACCOUNT FUNCTIONS
// ===========================================
function createAccount(type) {

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;


    if(name === "" || email === "") {

        alert("Please enter your name and email.");

        return;
    }


    alert(
        "Welcome to Scuber, " + name + "!\n\n" +
        "Account Type: " + type
    );


    document.getElementById("account-screen")
    .classList.add("hidden");


    // Dashboard opens after account selection

}
// ===========================================
// RIDER FUNCTIONS
// ===========================================
function showRideHistory(){

    document.getElementById("rider-dashboard")
    .classList.add("hidden");

    document.getElementById("ride-history-screen")
    .classList.remove("hidden");


    let historyList = document.getElementById("ride-history-list");

    if(rideHistory.length === 0){

        historyList.innerHTML = "<p>No completed rides yet.</p>";

        return;
    }


    historyList.innerHTML = "";


    rideHistory.forEach(function(ride){

        historyList.innerHTML += `

        <div class="ride-card">

            <p><strong>Driver:</strong> ${ride.driver}</p>

            <p><strong>Pickup:</strong> ${ride.pickup}</p>

            <p><strong>Destination:</strong> ${ride.destination}</p>

            <p><strong>Fare:</strong> $${ride.fare}</p>

            <p><strong>Status:</strong> ${ride.status}</p>

        </div>

        `;

    });

}
function showRiderDashboard() {

    console.log("Rider Dashboard function is running");

    document.getElementById("rider-dashboard").classList.remove("hidden");

    document.getElementById("ride-request-screen").classList.add("hidden");
    document.getElementById("driver-screen").classList.add("hidden");
    document.getElementById("schedule-screen").classList.add("hidden");
    document.getElementById("driver-trip-screen").classList.add("hidden");
    document.getElementById("rider-trip-screen").classList.add("hidden");
    document.getElementById("ride-history-screen").classList.add("hidden");
    document.getElementById("recurring-screen").classList.add("hidden");

}
// ===========================================
// DRIVER FUNCTIONS
// ===========================================
function showDriverScreen() {

    document.getElementById("main-app")
    .classList.add("hidden");


    document.getElementById("driver-screen")
    .classList.remove("hidden");

}

function showDriverDashboard() {
    
    
    document.getElementById("account-screen")
    .classList.add("hidden");

    document.getElementById("rider-dashboard")
    .classList.add("hidden");

    document.getElementById("driver-trip-screen")
    .classList.add("hidden");

    document.getElementById("rider-trip-screen")
    .classList.add("hidden");

    document.getElementById("driver-screen")
    .classList.add("hidden");

    document.getElementById("driver-request-screen")
    .classList.add("hidden");

    document.getElementById("driver-dashboard")
    .classList.remove("hidden");

}
function saveAvailability() {

    let day = document.getElementById("driver-day").value;
    let start = document.getElementById("driver-start").value;
    let end = document.getElementById("driver-end").value;


    alert(
        "Availability Saved!\n\n" +
        "Day: " + day +
        "\nTime: " + start +
        " - " + end
    );

}
// ===========================================
// SHARED RIDE FUNCTIONS
// ===========================================

// ===========================================
// CURRENT RIDE DATA
// ===========================================

let currentRide = {
    rider: "",
    driver: "",
    pickup: "",
    destination: "",
    status: "NO_RIDE",
    eta: 0,
    fare: 0
};
// ===========================================
// RIDE HISTORY
// ===========================================

let rideHistory = [];
function requestRide(){

    document.getElementById("ride-request-screen")
    .classList.remove("hidden");

}


function findDriver(){

    let pickup = document.getElementById("now-pickup").value;
    let destination = document.getElementById("now-destination").value;

let driverFound = "Alex";

currentRide.rider = "Toya";
currentRide.driver = driverFound;
currentRide.pickup = pickup;
currentRide.destination = destination;
currentRide.status = "WAITING_FOR_DRIVER_ACCEPTANCE";
currentRide.eta = 8;
currentRide.fare = 18.00;

    alert(
        "Driver Found!\n\n" +
        "Driver: " + driverFound +
        "\nPickup: " + pickup +
        "\nDestination: " + destination
    );
    
showDriverRequest();
    
}
function showDriverRequest(){

    document.getElementById("main-app")
    .classList.add("hidden");


    document.getElementById("driver-request-screen")
    .classList.remove("hidden");


    if(currentRide){

        document.getElementById("request-rider").textContent = currentRide.rider;

        document.getElementById("request-pickup").textContent = currentRide.pickup;

        document.getElementById("request-destination").textContent = currentRide.destination;

    }

}



function acceptRide(){

    if(currentRide){

        currentRide.status = "DRIVER_ACCEPTED";
        currentRide.driver = "Alex";

        document.getElementById("rider-driver").textContent = currentRide.driver;

        document.getElementById("rider-status").textContent = currentRide.status;

    }
showRiderTripScreen();

    alert(
        "Ride Accepted!\n\n" +
        "Navigation started."
    );

}


function declineRide(){

    alert(
        "Ride Declined.\n\n" +
        "Searching for another driver."
    );

}
function showTripScreen(){

    document.getElementById("main-app")
    .classList.add("hidden");


    document.getElementById("driver-trip-screen")
    .classList.remove("hidden");

}

function showRiderTripScreen(){

    document.getElementById("main-app")
    .classList.remove("hidden");

    document.getElementById("rider-trip-screen")
    .classList.remove("hidden");

}

function startTrip(){

    currentRide.status = "TRIP_STARTED";

    document.getElementById("rider-status").textContent = currentRide.status;

    alert(
        "Trip Started!\n\n" +
        "Scuber navigation is active."
    );

}

function completeTrip(){

    currentRide.status = "TRIP_COMPLETED";

    rideHistory.push({
        rider: currentRide.rider,
        driver: currentRide.driver,
        pickup: currentRide.pickup,
        destination: currentRide.destination,
        fare: currentRide.fare,
        status: currentRide.status
    });

    document.getElementById("rider-status").textContent = currentRide.status;

    alert(
        "Trip Completed!\n\n" +
        "Thank you for driving with Scuber."
    );

}
