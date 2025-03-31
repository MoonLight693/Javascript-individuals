// Track sorting direction (Load from localStorage if available)
let sortDirections = JSON.parse(localStorage.getItem("sortDirections")) || { 0: "desc" };

// Save sort directions to localStorage
function saveSortDirections() {
    localStorage.setItem("sortDirections", JSON.stringify(sortDirections));
}

// Sort table function
function sortTable(n, type) {
    let table = document.getElementById("myTable");
    let tbody = table.querySelector("tbody");
    let rows = Array.from(tbody.querySelectorAll("tr"));

    const stockOrder = { "Full": 1, "Half Full": 2, "Empty": 3 };

    sortDirections[n] = sortDirections[n] === "asc" ? "desc" : "asc";
    let dir = sortDirections[n];
    saveSortDirections();

    let groupedRows = [];
    for (let i = 0; i < rows.length; i++) {
        if (!rows[i].classList.contains("hidden-info")) {
            let group = [rows[i]];
            if (i + 1 < rows.length && rows[i + 1].classList.contains("hidden-info")) {
                group.push(rows[i + 1]);
            }
            groupedRows.push(group);
        }
    }

    groupedRows.sort((groupA, groupB) => {
        let rowA = groupA[0], rowB = groupB[0];
        let x = rowA.cells[n].textContent.trim();
        let y = rowB.cells[n].textContent.trim();

        if (type === "stock") {
            x = stockOrder[x] || 999;
            y = stockOrder[y] || 999;
        } else if (type === "num") {
            x = parseFloat(x.replace(/[$,]/g, "")) || 0;
            y = parseFloat(y.replace(/[$,]/g, "")) || 0;
        } else {
            x = x.toLowerCase();
            y = y.toLowerCase();
        }

        return dir === "asc" ? (x > y ? 1 : -1) : (x < y ? 1 : -1);
    });

    tbody.innerHTML = "";
    groupedRows.forEach(group => group.forEach(row => tbody.appendChild(row)));

    saveTableData();
}

// Function to toggle row visibility and persist open state
function toggleRow(event) {
    let clickedRow = event.currentTarget;
    let nextRow = clickedRow.nextElementSibling;

    if (nextRow && nextRow.classList.contains("hidden-info")) {
        nextRow.style.display = nextRow.style.display === "table-row" ? "none" : "table-row";
        saveTableData();
    }
}

// Clears the table
function clearTable() {
    document.querySelector("#myTable tbody").innerHTML = "";
}

// Function to insert table rows and apply hover effect
function insertTableRows(data) {
    let tableBody = document.querySelector("#myTable tbody");
    if (!tableBody) return;

    data.forEach(item => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${item.name}</td><td>${item.stock}</td><td>${item.price}</td>`;
        row.onclick = toggleRow;

        let hiddenRow = document.createElement("tr");
        hiddenRow.classList.add("hidden-info");
        hiddenRow.style.display = "none";
        hiddenRow.innerHTML = `<td colspan="3" class="text-start">${item.details}</td>`;

        tableBody.appendChild(row);
        tableBody.appendChild(hiddenRow);
        addHoverEffect(row);
    });

    saveTableData();
}

// Restore hover effect (properly apply to all `<td>` elements)
function addHoverEffect(row) {
    row.addEventListener("mouseenter", function() {
        row.style.backgroundColor = "rgb(197, 197, 197)";
        row.querySelectorAll('td').forEach(td => td.style.backgroundColor = "rgb(197, 197, 197)");
    });

    row.addEventListener("mouseleave", function() {
        row.style.backgroundColor = "";
        row.querySelectorAll('td').forEach(td => td.style.backgroundColor = "");
    });
}

// Save table state to localStorage
function saveTableData() {
    let tableHTML = document.querySelector("#myTable tbody").innerHTML;
    localStorage.setItem("tableData", tableHTML);
}

// Load table state from localStorage
document.addEventListener("DOMContentLoaded", function () {
    let tableData = localStorage.getItem("tableData");
    if (tableData) {
        document.querySelector("#myTable tbody").innerHTML = tableData;
    }
});

// Dummy data index persistence
let currentIndex = parseInt(localStorage.getItem("currentIndex")) || 0;
document.addEventListener("DOMContentLoaded", function () {
    let addButton = document.getElementById("addDataButton");

    addButton.addEventListener("click", function () {
        fetch('./dummy.json')
            .then(response => response.json())
            .then(data => {
                if (currentIndex < data.length) {
                    insertTableRows([data[currentIndex]]);
                    currentIndex++;
                    localStorage.setItem("currentIndex", currentIndex);
                }
                if (currentIndex >= data.length) {
                    addButton.disabled = true;
                }
            })
            .catch(error => console.error('Error loading JSON:', error));
    });

    // Enable the button if dummy data is still available
    fetch('./dummy.json')
        .then(response => response.json())
        .then(data => {
            if (currentIndex < data.length) {
                addButton.disabled = false;
            } else {
                addButton.disabled = true;
            }
        })
        .catch(error => console.error('Error loading dummy JSON:', error));
});

// Persist details open/close state
const details = document.querySelector("#partsDetails");
document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("detailsOpen") === "true") {
        details.setAttribute("open", true);
    }
    details.addEventListener("toggle", function () {
        localStorage.setItem("detailsOpen", details.open.toString());
    });
});

// Ensure table loads all data on refresh
window.onload = function() {
    clearTable();
    let storedData = localStorage.getItem("tableData");

    if (storedData) {
        document.querySelector("#myTable tbody").innerHTML = storedData;

        // Reapply hover effect and row clickability
        document.querySelectorAll("#myTable tbody tr").forEach((row, index, allRows) => {
            if (!row.classList.contains("hidden-info")) {
                row.onclick = toggleRow;
                addHoverEffect(row);
            }
        });
    } else {
        fetch('./start.json')
            .then(response => response.json())
            .then(data => {
                insertTableRows(data);
                localStorage.setItem("tableData", JSON.stringify(data));
            })
            .catch(error => console.error('Error loading start.json:', error));
    }
};
