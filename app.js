// Scuber App - Version 1


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


    document.getElementById("main-app")
    .classList.remove("hidden");

}
function showRiderDashboard() {

    console.log("Rider Dashboard function is running");

    document.getElementById("rider-dashboard").classList.remove("hidden");

    document.getElementById("driver-screen").classList.add("hidden");
    document.getElementById("schedule-screen").classList.add("hidden");
    document.getElementById("trip-screen").classList.add("hidden");

}
function showDriverScreen() {

    document.getElementById("main-app")
    .classList.add("hidden");


    document.getElementById("driver-screen")
    .classList.remove("hidden");

}

function showDriverDashboard() {

    document.getElementById("main-app").classList.add("hidden");

    document.getElementById("rider-dashboard").classList.add("hidden");

    document.getElementById("driver-dashboard").classList.remove("hidden");

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
function requestRide(){

    document.getElementById("ride-request-screen")
    .classList.remove("hidden");

}


function findDriver(){

    let pickup = document.getElementById("now-pickup").value;
    let destination = document.getElementById("now-destination").value;


    let driverFound = "Alex";


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

}



function acceptRide(){

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


    document.getElementById("trip-screen")
    .classList.remove("hidden");

}



function startTrip(){

    alert(
        "Trip Started!\n\n" +
        "Scuber navigation is active."
    );

}



function completeTrip(){

    alert(
        "Trip Completed!\n\n" +
        "Thank you for riding with Scuber."
    );

}
