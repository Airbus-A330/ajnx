let savedLength = 999;

function checkInput() {
    const inputField = document.getElementById("autocompleteInput");
    const nextButton = document.getElementById("next-btn");

    nextButton.disabled = inputField.value.trim().length != savedLength;
}

function showGradesSection() {
    document.getElementById("grades-section").style.display = "block";
    document.getElementById("autocompleteInput").disabled = true;
    document.getElementById("next-btn").disabled = true;
    document.getElementById("srcdb").disabled = true;

    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

document.getElementById("next-btn")?.addEventListener("click", () => {
    showGradesSection();
});

function numericInputRestrictor() {
    const numericInputs = document.querySelectorAll(".numeric-input");

    numericInputs.forEach((input) => {
        input.addEventListener("input", function (e) {
            // Remove any non-numeric characters except decimal points
            let value = this.value.replace(/[^0-9.]/g, "");
            // Ensure only one decimal point is allowed
            const parts = value.split(".");
            if (parts.length > 2) {
                value = parts[0] + "." + parts.slice(1).join("");
            }
            // Restrict to four decimal places
            if (parts[1] && parts[1].length > 4) {
                value = parts[0] + "." + parts[1].slice(0, 4);
            }
            this.value = value;
        });

        input.addEventListener("keydown", function (e) {
            // Allow: backspace, delete, tab, escape, enter, ., and number keys
            if (
                [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                // Allow: Ctrl/cmd+A, Ctrl/cmd+C, Ctrl/cmd+X
                (e.keyCode === 65 &&
                    (e.ctrlKey === true || e.metaKey === true)) ||
                (e.keyCode === 67 &&
                    (e.ctrlKey === true || e.metaKey === true)) ||
                (e.keyCode === 88 &&
                    (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)
            ) {
                // Let it happen, don't do anything
                return;
            }
            // Prevent multiple decimal points
            if (
                (e.key === "." || e.key === "Decimal") &&
                this.value.includes(".")
            ) {
                e.preventDefault();
                return;
            }
            // Ensure that it is a number key (both number keys and numpad keys)
            if (
                (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
                (e.keyCode < 96 || e.keyCode > 105)
            ) {
                e.preventDefault();
            }
        });
    });
}

function generateRandomID(length) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters[randomIndex];
    }

    return result;
}

const input = document.getElementById("autocompleteInput");
const autocompleteList = document.getElementById("autocompleteList");

input.addEventListener("input", function () {
    const query = this.value.trim();
    if (query.length > 2) {
        fetchCourses(query);
    } else {
        closeAllLists();
    }
});

function fetchCourses(query) {
    fetch(
        `/api/courses?query=${query}&srcdb=${document.getElementById("srcdb").value}`,
    )
        .then((response) => response.json())
        .then((data) => {
            closeAllLists();

            if (data.length === 0) {
                const item = document.createElement("div");
                item.classList.add("autocomplete-item");
                item.innerHTML = `Couldn't find what you were looking for...<br><span style="font-size:x-small; font-style: italic;">Try a different phrase or keyword.</span>`;
                item.disabled = true;
                item.style = "pointer-events: none; background-color:#ffcc00";
                autocompleteList.appendChild(item);
            }

            const inputRect = input.getBoundingClientRect();
            autocompleteList.style.top = `${inputRect.bottom}px`;
            autocompleteList.style.left = `${inputRect.left}px`;
            autocompleteList.style.width = `${input.offsetWidth}px`;

            data.length = 5;

            data.forEach((course) => {
                const item = document.createElement("div");
                item.classList.add("autocomplete-item");
                item.innerHTML = `<strong>${course.code}</strong> — ${course.name}<br><span style="font-size:x-small; font-style: italic;">${course.lectures > 0 ? `Lectures: ${course.lectures}` : ""} ${course.recitations > 0 ? ` • Recitations: ${course.recitations}` : ""} ${course.labs > 0 ? ` • Labs: ${course.labs}` : ""}</span>`;
                item.addEventListener("click", function () {
                    input.value = `${course.code}`;
                    savedLength = input.value.length;
                    document.getElementById("next-btn").disabled = false;
                    closeAllLists();
                });
                autocompleteList.appendChild(item);
            });
        })
        .catch((error) => {});
}

function closeAllLists() {
    while (autocompleteList.firstChild) {
        autocompleteList.removeChild(autocompleteList.firstChild);
    }
}

document.addEventListener("click", function (e) {
    if (!autocompleteList.contains(e.target) && e.target !== input) {
        closeAllLists();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    document
        .getElementById("closeModalBtn")
        ?.addEventListener("click", function () {
            document.getElementById("modal").style.display = "none";
        });

    window.onclick = function (event) {
        if (event.target == document.getElementById("modal")) {
            modal.style.display = "none";
        }
    };

    const tableBody = document.querySelector("#courseTable tbody");
    const entryButton = document.getElementById("next-btn");

    // Fetch course data when the button is clicked and populate the table
    entryButton.addEventListener("click", function () {
        fetch(
            `/api/course?code=${document.getElementById("autocompleteInput").value}&srcdb=${document.getElementById("srcdb").value}`,
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.status == 404) {
                    document.getElementById(
                        "course-information",
                    ).style.display = "block";
                    document.getElementById(
                        "course-information-loader",
                    ).style.display = "none";
                    document.getElementById("course-information").innerHTML =
                        `<strong>Course not found!</strong><br>Please try again with a different course code.
                    </div>`;
                    document.getElementById("btn-restart").style =
                        "display:block; background-color:#FFCC00; color:black;";
                } else {
                    populateTable(data.sections);
                    document.getElementById("course-info-name").textContent =
                        data.name;
                    document.getElementById("course-info-code").textContent =
                        data.code;
                    document.getElementById("course-info-credits").textContent =
                        data.credits;
                    document.getElementById(
                        "course-info-description",
                    ).textContent = data.description;
                    document.getElementById("course-info-method").textContent =
                        data.instructional_method;
                    document.getElementById("course-info-college").textContent =
                        data.college;
                    document.getElementById("course-info-prereq").innerHTML =
                        data.prerequisites == "none"
                            ? "Pre-requisites: none"
                            : "Pre-requisites: " +
                              data.prerequisites.replaceAll(
                                  "{window.location.origin}",
                                  window.location.origin,
                              );
                    document.getElementById("course-info-coreq").innerHTML =
                        data.corequisites == "none"
                            ? "Co-requisites: none"
                            : "Co-requisites: " +
                              data.corequisites.replaceAll(
                                  "{window.location.origin}",
                                  window.location.origin,
                              );

                    document.getElementById(
                        "course-information",
                    ).style.display = "block";
                    document.getElementById("courseTable").style.display =
                        "table";
                    document.getElementById(
                        "course-information-loader",
                    ).style.display = "none";

                    document.getElementById("btn-restart").style.display =
                        "block";
                    document.getElementById("btn-calendar").style.display =
                        "block";
                    document.getElementById(
                        "btn-copy-course-code",
                    ).style.display = "block";
                    document.getElementById("btn-copy-link").style.display =
                        "block";

                    window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: "smooth",
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching course data:", error);
            });
    });

    // Populate the table with course data
    function populateTable(courses) {
        let counter = 0;
        // Clear the existing table rows
        tableBody.innerHTML = "";

        courses.forEach((course) => {
            counter += 1;

            const row = document.createElement("tr");
            const secCell = document.createElement("td");
            const idCell = document.createElement("td");
            const typeCell = document.createElement("td");
            const instructorCell = document.createElement("td");
            const scheduleCell = document.createElement("td");

            secCell.textContent = course.section;
            secCell.dataset.code = course.section;
            secCell.id = `course-section-${counter}`;

            idCell.textContent = course.crn;
            idCell.dataset.code = course.crn;
            idCell.id = `course-crn-${counter}`;

            typeCell.textContent =
                course.type == "LEC"
                    ? "Lecture"
                    : course.type == "RCT"
                      ? "Recitation"
                      : course.type == "LAB"
                        ? "Lab"
                        : course.type == "CLI"
                          ? "Clinic"
                          : course.type == "SEM"
                            ? "Seminar"
                            : "Other";
            typeCell.dataset.code = course.type;

            instructorCell.textContent = course.instructor;
            instructorCell.dataset.code = course.instructor;

            scheduleCell.textContent = course.meets;
            scheduleCell.dataset.code = course.meets;

            row.appendChild(secCell);
            row.appendChild(idCell);
            row.appendChild(typeCell);
            row.appendChild(instructorCell);
            row.appendChild(scheduleCell);

            tableBody.appendChild(row);
        });
    }

    // Handle table cell clicks
    document
        .getElementById("courseTable")
        .addEventListener("click", function (event) {
            const target = event.target;

            // Ensure the clicked target is a cell in the first column with a course code
            if (target.tagName === "TD" && target.dataset.code) {
                document.getElementById(
                    "section-details-content",
                ).style.display = "none";
                document.getElementById(
                    "section-details-loader",
                ).style.display = "block";

                // Remove 'active' class from all cells
                Array.from(
                    document.querySelectorAll("#courseTable tr"),
                ).forEach((tr) => tr.classList.remove("active"));

                // Add 'active' class to the clicked row
                const row = target.parentNode;
                row.classList.add("active");

                document.getElementById("section-details").style.display =
                    "block";

                populateCourseDetails(
                    document.getElementById("autocompleteInput").value,
                    document.getElementById(`course-section-${row.rowIndex}`)
                        .dataset.code,
                    document.getElementById(`course-crn-${row.rowIndex}`)
                        .dataset.code,
                );

                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                });
            }
        });
});

async function populateCourseDetails(code, section, crn) {
    let f = await fetch(
        `/api/course?code=${code}&srcdb=${document.getElementById("srcdb").value}&crn=${crn}`,
    );
    f = await f.json();

    let meeting_location = f.meeting_location;

    f = f.sections.find((x) => x.section == section);

    let g = await fetch(
        `/api/courses?instructor=${f.instructor}&srcdb=${document.getElementById("srcdb").value}&code=${code}`,
    );
    g = await g.json();

    if (g.message == "Other user input error occured at this time.") {
        document.getElementById("section-details-loader").innerHTML =
            `<strong>This information cannot be loaded.</strong><br><br>We're sorry, but we ran into an internal error. The information you requested cannot be displayed. Please try a different section.`;
        return;
    }

    document.getElementById("details-instructor").textContent = f.instructor;
    document.getElementById("details-instructor-courses-number").textContent =
        `Teaches ${g.length == 0 ? "no" : g.length} other course${g.length == 1 ? "" : "s"}.`;
    document.getElementById("details-instructor-courses").innerHTML =
        g.length == 0
            ? "<br>"
            : `<ul style="font-size:small;"><li>${g.map((x) => `${x.name} (<a href="/?course=${encodeURIComponent(x.code)}&srcdb=${document.getElementById("srcdb").value}">${x.code}</a> • ${x.section}) — ${x.meets}`).join("</li><li>")}</li></ul>`;
    document.getElementById("details-course-location").textContent =
        meeting_location;

    f.start = f.start.split("-");
    f.start.push(f.start.shift());
    f.start = f.start.join("/");

    f.end = f.end.split("-");
    f.end.push(f.end.shift());
    f.end = f.end.join("/");

    document.getElementById("details-course-length").textContent =
        `${f.start} — ${f.end}`;

    if (f.meets == "Does Not Meet") {
        document.getElementById("details-course-schedule").innerHTML =
            `<ul><li>This course does not have a meeting schedule as it does not meet.</li></ul>`;
    } else {
        let meeting_dates = [];

        f.meets.split(";").forEach((x) => {
            let meeting_days = x.trim().split(" ")[0];
            let meeting_times = x.trim().split(" ")[1].split("-");

            meeting_dates.push(
                meeting_days
                    .split("")
                    .map(
                        (x) =>
                            `<li><strong>${x.replace("M", "Monday").replace("T", "Tuesday").replace("W", "Wednesday").replace("R", "Thursday").replace("F", "Friday").replace("S", "Saturday")}s</strong> from <strong>${meeting_times[0].replaceAll("a", "").replaceAll("p", "")}${meeting_times[0].includes(":") ? "" : ":00"}${meeting_times[0].endsWith("a") || meeting_times[0].endsWith("p") ? meeting_times[0].split(/(a|p)/)[1].replaceAll("a", " AM").replaceAll("p", " PM") : meeting_times[1].endsWith("a") ? " AM" : " PM"}</strong> to <strong>${meeting_times[1].replaceAll("a", " AM").replaceAll("p", " PM")}${meeting_times[1].includes(":") ? "" : ":00"}</strong>.</li>`,
                    )
                    .join(""),
            );
        });

        document.getElementById("details-course-schedule").innerHTML =
            `<ul>${meeting_dates.join("")}</ul>`;
    }
    document.getElementById("section-details-content").style.display = "block";
    document.getElementById("section-details-loader").style.display = "none";

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
    });
}

function startOver() {
    savedLength = 999;

    document.getElementById("autocompleteInput").disabled = false;
    document.getElementById("autocompleteInput").value = "";
    document.getElementById("next-btn").disabled = true;
    document.getElementById("srcdb").disabled = false;

    document.getElementById("course-information").style.display = "none";
    document.getElementById("course-information-loader").style.display =
        "block";
    document.getElementById("section-details").style.display = "none";
    document.getElementById("section-details-content").style.display = "none";
    document.getElementById("section-details-loader").style.display = "block";
    document.getElementById("grades-section").style.display = "none";

    document.getElementById("courseTable").style.display = "none";

    document.getElementById("btn-restart").style.display = "none";
    document.getElementById("btn-calendar").style.display = "none";
    document.getElementById("btn-copy-course-code").style.display = "none";
    document.getElementById("btn-copy-link").style.display = "none";

    document.getElementById("autocompleteInput").focus();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function copy(type) {
    if (type == "COURSE_CODE") {
        document.getElementById("btn-copy-course-code").style.backgroundColor =
            "green";
        document.getElementById("btn-copy-course-code").textContent =
            "✅ Copied!";

        navigator.clipboard.writeText(
            document.getElementById("autocompleteInput").value,
        );

        setTimeout(() => {
            document.getElementById(
                "btn-copy-course-code",
            ).style.backgroundColor = null;
            document.getElementById("btn-copy-course-code").textContent =
                "Copy Course Code";
        }, 2 * 1000);
    } else if (type == "COURSE_LINK") {
        document.getElementById("btn-copy-link").style.backgroundColor =
            "green";
        document.getElementById("btn-copy-link").textContent = "✅ Copied!";

        navigator.clipboard.writeText(
            `${window.location.origin}/?course=${encodeURIComponent(document.getElementById("autocompleteInput").value)}&srcdb=${document.getElementById("srcdb").value}`,
        );

        setTimeout(() => {
            document.getElementById("btn-copy-link").style.backgroundColor =
                null;
            document.getElementById("btn-copy-link").textContent = "Share Link";
        }, 2 * 1000);
    }
}

function seeRoom() {
    const room = document.getElementById("details-course-location").textContent;

    document.getElementById("modal").style.display = "block";

    document.getElementById("modal-content-inner").innerHTML =
        `<h3>${room}</h3><em style="font-size:small;">The image may take a while to load, please be patient.</em><br><br><img class="classroom-image" src="/api/classrooms?room=${encodeURIComponent(room)}">`;
}

async function showCalendar(srcdbs) {
    let semester = srcdbs.find(
        (x) => x.id == document.getElementById("srcdb").value,
    ).name;

    document.getElementById("modal").style.display = "block";
    document.getElementById("modal-content-inner").innerHTML =
        `<h3>Academic Calendar for ${semester}</h3><span id="calendar-body"><em style="font-size:small;">The calendar may take a while to load, please be patient.</em></span>`;

    let calendar = await fetch(`/api/calendar?semester=${semester}`);
    calendar = await calendar.json();

    let html = "";

    if (calendar[1].length != 0) {
        html += `<h4>Upcoming Events — ${calendar[1].length}</h4>`;

        events = [];
        for (const event of calendar[1]) {
            events.push(`<div class="event-tile" onclick="window.open('${event.url}', '_blank');">
                <div class="event-date">${new Date(
                    event.timestamp * 1000,
                ).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    timeZone: "America/New_York",
                })}</div>
                <div class="event-title">${event.title}</div>
                <div class="event-description">${event.description ?? "<p>No description.</p>"}</div>
                <div class="event-footer">${event.tags.join(" • ")}</div>
            </div>`);
        }

        html += events.join("");
    }

    if (calendar[0].length != 0) {
        html += `<h4>Past Events — ${calendar[0].length}</h4>`;

        events = [];
        for (const event of calendar[0]) {
            events.push(`<div class="event-tile" onclick="window.open('${event.url}', '_blank');">
                <div class="event-date">${new Date(
                    event.timestamp * 1000,
                ).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    timeZone: "America/New_York",
                })}</div>
                <div class="event-title">${event.title}</div>
                <div class="event-description">${event.description ?? "<p>No description.</p>"}</div>
                <div class="event-footer">${event.tags.join(" • ")}</div>
            </div>`);
        }

        html += events.join("");
    }

    document.getElementById("calendar-body").innerHTML = html;
}
