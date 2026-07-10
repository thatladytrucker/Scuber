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
