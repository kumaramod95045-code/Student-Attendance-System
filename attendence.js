

const students = [
    { id: 1, roll: "101", name: "Rahul Kumar" },
    { id: 2, roll: "102", name: "Aman Kumar" },
    { id: 3, roll: "103", name: "Ravi Kumar" },
    { id: 4, roll: "104", name: "Suman Kumar" },
    { id: 5, roll: "105", name: "Mohit Kumar" },
    { id: 6, roll: "106", name: "Rohit Kumar" },
    { id: 7, roll: "107", name: "Ankit Kumar" },
    { id: 8, roll: "108", name: "Priya Kumari" },
    { id: 9, roll: "109", name: "Neha Kumari" },
    { id: 10, roll: "110", name: "Pankaj Kumar" }
];




function getToday() {

    const date = new Date();

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}



let attendance =
    JSON.parse(localStorage.getItem("attendance")) || {};


function saveData() {

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );
}



const dashboardDate =
    document.querySelector("#dashboard-date");

const attendanceDate =
    document.querySelector("#attendance-date");


dashboardDate.value = getToday();

attendanceDate.value = getToday();



const sidebarButtons =
    document.querySelectorAll(".common");


const pageSections =
    document.querySelectorAll(".page-section");


function showPage(pageName) {

    pageSections.forEach(section => {

        section.classList.add("hidden");

    });


    const selectedPage =
        document.querySelector(`#${pageName}-page`);

    if (selectedPage) {

        selectedPage.classList.remove("hidden");

    }


    sidebarButtons.forEach(button => {

        button.classList.remove("active");

        if (button.dataset.page === pageName) {

            button.classList.add("active");

        }

    });


    if (pageName === "dashboard") {

        updateDashboard();

    }

    if (pageName === "attendance") {

        loadAttendance();

    }

    if (pageName === "students") {

        loadStudents();

    }

    if (pageName === "reports") {

        loadReports();

    }

    if (pageName === "low") {

        loadLowAttendance();

    }
}




sidebarButtons.forEach(button => {

    button.addEventListener("click", function () {

        showPage(this.dataset.page);

    });

});




document.querySelectorAll("[data-page]").forEach(button => {

    button.addEventListener("click", function () {

        showPage(this.dataset.page);

    });

});




function getDateAttendance(date) {

    return attendance[date] || {};

}




function updateDashboard() {

    const date = dashboardDate.value;

    const data = getDateAttendance(date);


    const total =
        students.length;


    let present = 0;


    students.forEach(student => {

        if (data[student.id] === true) {

            present++;

        }

    });


    const absent =
        total > 0 ? total - present : 0;


    document.querySelector("#total-students").textContent =
        total;


    document.querySelector("#present-count").textContent =
        present;


    document.querySelector("#absent-count").textContent =
        absent;


    const marked =
        Object.keys(data).length;


    let percentage = 0;


    if (marked > 0) {

        percentage =
            Math.round((present / total) * 100);

    }


    document.querySelector("#today-percentage").textContent =
        percentage + "%";


    const message =
        document.querySelector("#attendance-message");


    if (marked === 0) {

        message.textContent =
            "No attendance marked for this date.";

    }
    else {

        message.textContent =
            `${present} out of ${total} students are present.`;

    }


    loadLowAttendance();

}




dashboardDate.addEventListener("change", function () {

    updateDashboard();

});




function loadAttendance() {

    const date =
        attendanceDate.value;

    const data =
        getDateAttendance(date);


    const list =
        document.querySelector("#attendance-list");


    list.innerHTML = "";


    students.forEach(student => {

        const row =
            document.createElement("div");

        row.className =
            "attendance-row";


        let status =
            data[student.id];


        row.innerHTML = `

            <span>${student.roll}</span>

            <span>${student.name}</span>

            <div class="status-buttons">

                <button
                    class="status-btn present ${status === true ? "selected" : ""}"
                    data-id="${student.id}"
                    data-status="present">
                    Present
                </button>

                <button
                    class="status-btn absent ${status === false ? "selected" : ""}"
                    data-id="${student.id}"
                    data-status="absent">
                    Absent
                </button>

            </div>

        `;


        list.appendChild(row);

    });


    addStatusEvents();

}




function addStatusEvents() {

    const buttons =
        document.querySelectorAll(".status-btn");


    buttons.forEach(button => {

        button.addEventListener("click", function () {

            const id =
                Number(this.dataset.id);

            const status =
                this.dataset.status;


            const parent =
                this.parentElement;


            parent
                .querySelectorAll(".status-btn")
                .forEach(btn => {

                    btn.classList.remove("selected");

                });


            this.classList.add("selected");


            if (!attendance[attendanceDate.value]) {

                attendance[attendanceDate.value] = {};

            }


            if (status === "present") {

                attendance[attendanceDate.value][id] =
                    true;

            }
            else {

                attendance[attendanceDate.value][id] =
                    false;

            }

        });

    });

}


/* =========================================
   ATTENDANCE DATE CHANGE
========================================= */

attendanceDate.addEventListener("change", function () {

    loadAttendance();

});



document
    .querySelector("#save-attendance")
    .addEventListener("click", function () {

        const date =
            attendanceDate.value;


        if (!date) {

            alert("Please select a date.");

            return;

        }


        if (!attendance[date]) {

            attendance[date] = {};

        }


        const marked =
            Object.keys(attendance[date]).length;


        if (marked !== students.length) {

            alert("Please mark attendance for every student.");

            return;

        }


        saveData();


        document.querySelector("#save-message").textContent =
            "Attendance saved successfully!";


        updateDashboard();

    });


/* =========================================
   CALCULATE STUDENT ATTENDANCE
========================================= */

function getStudentStats(studentId) {

    let total = 0;

    let present = 0;


    Object.values(attendance).forEach(day => {

        if (day[studentId] !== undefined) {

            total++;

            if (day[studentId] === true) {

                present++;

            }

        }

    });


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round((present / total) * 100);

    }


    return {

        total,
        present,
        percentage

    };

}



function loadStudents(searchText = "") {

    const list =
        document.querySelector("#student-list");


    list.innerHTML = "";


    students
        .filter(student =>
            student.name
                .toLowerCase()
                .includes(searchText.toLowerCase())
        )
        .forEach(student => {

            const stats =
                getStudentStats(student.id);


            const row =
                document.createElement("div");


            row.className =
                "student-row";


            row.innerHTML = `

                <span>${student.roll}</span>

                <span>${student.name}</span>

                <span class="${stats.percentage < 75 ? "low" : "good"}">
                    ${stats.percentage}%
                </span>

            `;


            list.appendChild(row);

        });

}


/* =========================================
   STUDENT SEARCH
========================================= */

document
    .querySelector("#student-search")
    .addEventListener("input", function () {

        loadStudents(this.value);

    });




function loadReports() {

    const list =
        document.querySelector("#report-list");


    list.innerHTML = "";


    let totalPercentage = 0;


    students.forEach(student => {

        const stats =
            getStudentStats(student.id);


        totalPercentage +=
            stats.percentage;


        const row =
            document.createElement("div");


        row.className =
            "student-row";


        row.style.gridTemplateColumns =
            "1fr 2fr 1.5fr 1fr";


        row.innerHTML = `

            <span>${student.roll}</span>

            <span>${student.name}</span>

            <span>
                ${stats.present} / ${stats.total}
            </span>

            <span class="${stats.percentage < 75 ? "low" : "good"}">
                ${stats.percentage}%
            </span>

        `;


        list.appendChild(row);

    });


    const average =
        students.length > 0
            ? Math.round(totalPercentage / students.length)
            : 0;


    document.querySelector("#report-total").textContent =
        students.length;


    document.querySelector("#average-attendance").textContent =
        average + "%";

}




function loadLowAttendance() {

    const threshold =
        Number(
            document.querySelector("#threshold").value
        );


    document.querySelector("#threshold-display").textContent =
        threshold;


    const lowStudents =
        students.filter(student => {

            const stats =
                getStudentStats(student.id);

            return stats.total > 0 &&
                   stats.percentage < threshold;

        });


    document.querySelector("#low-count").textContent =
        lowStudents.length;


    const list =
        document.querySelector("#low-list");


    if (!list) return;


    list.innerHTML = "";


    lowStudents.forEach(student => {

        const stats =
            getStudentStats(student.id);


        const row =
            document.createElement("div");


        row.className =
            "student-row";


        row.innerHTML = `

            <span>${student.roll}</span>

            <span>${student.name}</span>

            <span class="low">
                ${stats.percentage}%
            </span>

        `;


        list.appendChild(row);

    });


    if (lowStudents.length === 0) {

        list.innerHTML = `

            <div class="student-row">

                <span></span>

                <span>
                    No students are below the threshold.
                </span>

                <span>✓</span>

            </div>

        `;

    }

}




document
    .querySelector("#threshold")
    .addEventListener("input", function () {

        loadLowAttendance();

    });




document
    .querySelector("#teacher")
    .addEventListener("change", function () {

        const teacher =
            this.value;


        if (teacher) {

            document.querySelector(".welcome h1").textContent =
                `Welcome, ${teacher}! 👋`;

        }

    });




updateDashboard();