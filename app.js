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
