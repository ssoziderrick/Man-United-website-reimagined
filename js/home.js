// Home page scripts - owned by the person assigned in README.md
// Home page scripts
// Owned by the person assigned to the Home page.

document.addEventListener("DOMContentLoaded", function () {

  console.log("MUFC Practice Home page loaded successfully.");

  // Sample next-match date and time.
  const matchDate =
    new Date("October 10, 2026 15:00:00").getTime();

  const daysElement =
    document.getElementById("days");

  const hoursElement =
    document.getElementById("hours");

  const minutesElement =
    document.getElementById("minutes");

  const secondsElement =
    document.getElementById("seconds");


  function updateCountdown() {

    const now = new Date().getTime();

    const difference =
      matchDate - now;


    // Match has already started.
    if (difference <= 0) {

      daysElement.textContent = "00";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";

      return;
    }


    const days =
      Math.floor(
        difference /
        (1000 * 60 * 60 * 24)
      );


    const hours =
      Math.floor(
        (difference %
          (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
      );


    const minutes =
      Math.floor(
        (difference %
          (1000 * 60 * 60)) /
        (1000 * 60)
      );


    const seconds =
      Math.floor(
        (difference %
          (1000 * 60)) /
        1000
      );


    daysElement.textContent =
      String(days).padStart(2, "0");

    hoursElement.textContent =
      String(hours).padStart(2, "0");

    minutesElement.textContent =
      String(minutes).padStart(2, "0");

    secondsElement.textContent =
      String(seconds).padStart(2, "0");
  }


  updateCountdown();

  setInterval(updateCountdown, 1000);

});