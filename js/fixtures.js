// Fixtures page scripts - owned by the person assigned in README.md
function showMatches(type) {

    const matches = document.querySelectorAll(".match-card");
    const buttons = document.querySelectorAll(".filter-btn");

    // Remove active state from all buttons
    buttons.forEach(button => {
        button.classList.remove("active");
    });

    // Add active state to clicked button
    if (type === "all") {
        buttons[0].classList.add("active");
    }

    if (type === "upcoming") {
        buttons[1].classList.add("active");
    }

    if (type === "results") {
        buttons[2].classList.add("active");
    }


    matches.forEach(match => {

        if (type === "all") {
            match.style.display = "grid";
        }

        else if (type === "results") {

            if (match.classList.contains("result")) {
                match.style.display = "grid";
            } else {
                match.style.display = "none";
            }

        }

        else if (type === "upcoming") {

            if (match.classList.contains("upcoming")) {
                match.style.display = "grid";
            } else {
                match.style.display = "none";
            }

        }

    });
}