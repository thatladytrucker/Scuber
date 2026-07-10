// Scuber App - Version 1

const rideButton = document.querySelector(".ride");
const scheduleButton = document.querySelector(".schedule");
const recurringButton = document.querySelector(".recurring");


rideButton.addEventListener("click", function() {
    alert("Finding available drivers near you...");
});


scheduleButton.addEventListener("click", function() {
    alert("Let's schedule your ride.");
});


recurringButton.addEventListener("click", function() {
    alert("Let's set up your recurring rides.");
});
