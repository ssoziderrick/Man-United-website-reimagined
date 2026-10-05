document.addEventListener("DOMContentLoaded", function () {

    // ===============================
    // TIMELINE READ MORE BUTTONS
    // ===============================

    const timelineButtons = document.querySelectorAll(".timeline-btn");

    timelineButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const timelineItem = button.closest(".timeline-item");

            if (timelineItem) {

                timelineItem.classList.toggle("expanded");

                if (timelineItem.classList.contains("expanded")) {
                    button.textContent = "Show Less";
                } else {
                    button.textContent = "Read More";
                }

            }

        });

    });


    // ===============================
    // TIMELINE SCROLL ANIMATION
    // ===============================

    const timelineItems = document.querySelectorAll(".timeline-item");

    const observer = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }

            });

        },
        {
            threshold: 0.2
        }
    );


    timelineItems.forEach(function (item) {
        observer.observe(item);
    });


    // ===============================
    // COPYRIGHT YEAR
    // ===============================

    const copyright = document.querySelector(".copyright");

    if (copyright) {

        const currentYear = new Date().getFullYear();

        copyright.innerHTML =
            "&copy; " +
            currentYear +
            " Manchester United Practice Website. " +
            "This is a student practice project.";

    }

});