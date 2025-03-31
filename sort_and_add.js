// Track the direction of the sort for each column
let sortDirections = {
    0: "desc"  // Column 0 is currently sorted in descending order
};

// Sort table function with minor fixes to handle hidden rows
function sortTable(n, type) {
    let table = document.getElementById("myTable");
    let tbody = table.querySelector("tbody");
    let rows = Array.from(tbody.querySelectorAll("tr"));

    // Define custom order for stock statuses
    const stockOrder = { "Full": 1, "Half Full": 2, "Empty": 3 };

    // Toggle sorting direction
    sortDirections[n] = sortDirections[n] === "asc" ? "desc" : "asc";
    let dir = sortDirections[n];

    // Group visible rows with their hidden rows
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

    // Sort the grouped rows based on the selected column and type
    groupedRows.sort((groupA, groupB) => {
        let rowA = groupA[0];
        let rowB = groupB[0];
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

    // Clear the table body and rebuild it with sorted rows
    tbody.innerHTML = "";
    groupedRows.forEach(group => group.forEach(row => tbody.appendChild(row)));
}

// Function to toggle row visibility
function toggleRow(event) {
    let nextRow = event.currentTarget.nextElementSibling;
    if (nextRow && nextRow.classList.contains("hidden-info")) {
        // Toggle the display state between table-row and none
        nextRow.style.display = nextRow.style.display === "table-row" ? "none" : "table-row";
    }
}

// Clears the table that is defined in the html before inserting new rows
function clearTable() {
    let tableBody = document.querySelector("tbody");
    tableBody.innerHTML = ""; // Removes all existing rows
}

// Function to insert table rows (main and hidden rows)
function insertTableRows(data) {
    let tableBody = document.querySelector("#myTable tbody"); // Ensure correct tbody is targeted

    if (!tableBody) {
        console.error("Table body not found!");
        return;
    }

    data.forEach(item => {
        // Create main row
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.stock}</td>
            <td>${item.price}</td>
        `;
        row.onclick = toggleRow; // Attach click event

        // Create hidden info row
        let hiddenRow = document.createElement("tr");
        hiddenRow.classList.add("hidden-info");
        hiddenRow.style.display = "none"; // Hidden by default
        hiddenRow.innerHTML = `<td colspan="3" class="text-start">${item.details}</td>`;

        // Append rows to table body
        tableBody.appendChild(row);
        tableBody.appendChild(hiddenRow);

        // Reapply hover effect after rows are inserted
        addHoverEffect(row); // Apply hover effect to the newly added row
    });
}

// Function to apply hover effect to the row
function addHoverEffect(row) {
    row.addEventListener("mouseenter", function() {
        this.style.backgroundColor = "rgb(197, 197, 197)"; // Color on hover
        this.querySelectorAll('td').forEach(td => {
            td.style.backgroundColor = "rgb(197, 197, 197)"; // Apply the color to the entire row
        });
    });

    row.addEventListener("mouseleave", function() {
        this.style.backgroundColor = ""; // Reset background color on mouse leave
        this.querySelectorAll('td').forEach(td => {
            td.style.backgroundColor = ""; // Reset background color for each td
        });
    });
}

// Add event listener to the details element
document.addEventListener("DOMContentLoaded", function () {
    const details = document.querySelector("details");
    details.addEventListener("toggle", (event) => {
        if (details.open) {
            clearTable();        // Clears existing table rows
            fetch('./start.json')
                .then(response => response.json())  // Parse JSON response
                .then(data => {
                    insertTableRows(data); // Call the function with the fetched data
                })
                .catch(error => console.error('Error loading JSON:', error));  // Handle fetch errors
        }
    });
}); 

let currentIndex = 0; // Track the current index of dummy data being added

// Function to add one item from the JSON data
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("addDataButton").addEventListener("click", function() {
        fetch('./dummy.json')  // Fetch the JSON data from the file
        .then(response => response.json())  // Parse JSON response
        .then(data => {
            if (currentIndex < data.length) { // Check if there are more items to add
                insertTableRows([data[currentIndex]]); // Pass a single item as an array
                currentIndex++;  // Move to the next item
            } else {
                console.log('All data has been added!');
                // Disable the button after all have been added
                document.getElementById("addDataButton").disabled = true;
            }
        })
        .catch(error => console.error('Error loading JSON:', error));  // Errors if can't fetch JSON file
    });
});

document.addEventListener("DOMContentLoaded", function () {
    let tableData = localStorage.getItem("tableData");
    if (tableData) {
        document.querySelector("#myTable tbody").innerHTML = tableData;
    }
});

document.getElementById("addDataButton").addEventListener("click", function () {
    let table = document.querySelector("#myTable tbody");
    let newRow = "<tr><td>New Part</td><td>Full</td><td>$49.99</td></tr>";
    table.innerHTML += newRow;
    localStorage.setItem("tableData", table.innerHTML);
});

// Get the details element
const details = document.querySelector("#partsDetails");

// Load the open state from local storage when the page loads
document.addEventListener("DOMContentLoaded", function () {
    // Initialize the key in local storage if it doesn't exist
    if (localStorage.getItem("detailsOpen") === null) {
        localStorage.setItem("detailsOpen", "false");  // Set the default value to false
    }

    // Retrieve the saved state and set the details element accordingly
    const isOpen = localStorage.getItem("detailsOpen");

    // If the state is open, set the details element to open
    if (isOpen === "true") {
        details.setAttribute("open", true);
    }

    // Add event listener to track changes to the details element
    details.addEventListener("toggle", function () {
        // Save the open state to local storage
        localStorage.setItem("detailsOpen", details.open.toString());
    });
});

window.onload = function() {
    clearTable(); // Clears existing table rows

    // Check if data exists in localStorage
    let storedData = localStorage.getItem("tableData");

    if (storedData) {
        // Load data from localStorage
        insertTableRows(JSON.parse(storedData));
    } else {
        // Fetch data from start.json if no localStorage data is available
        fetch('./start.json')
            .then(response => response.json())
            .then(data => {
                insertTableRows(data);
                localStorage.setItem("tableData", JSON.stringify(data)); // Store in localStorage
            })
            .catch(error => console.error('Error loading JSON:', error));
    }
};
