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

    // Filter out hidden rows (only sort the visible ones)
    let visibleRows = rows.filter(row => !row.classList.contains("hidden-info"));
    let hiddenRows = rows.filter(row => row.classList.contains("hidden-info"));

    // Sort the visible rows based on the selected column and type
    visibleRows.sort((rowA, rowB) => {
        // Extract the text content from the specified column (n) and trim extra whitespace
        let x = rowA.cells[n].textContent.trim();
        let y = rowB.cells[n].textContent.trim();

        // Handle sorting for 'stock' type columns, where values are predefined (Full, Half Full, Empty)
        if (type === "stock") {
            // Map stock status values to a numerical order (Full: 1, Half Full: 2, Empty: 3)
            // Assign a default value of 999 for undefined stock statuses
            x = stockOrder[x] || 999;
            y = stockOrder[y] || 999;
        } 
        // Handle sorting for 'num' type columns (e.g., prices or numeric values)
        else if (type === "num") {
            // Remove any dollar signs or commas from the string, and convert the result to a float
            // If the conversion fails, use 0 as the default value
            x = parseFloat(x.replace(/[$,]/g, "")) || 0;
            y = parseFloat(y.replace(/[$,]/g, "")) || 0;
        } 
        // For all other types (e.g., string-based columns), normalize the text to lowercase
        else {
            x = x.toLowerCase();
            y = y.toLowerCase();
        }

        // Compare the two values (x and y) based on the current sorting direction (ascending or descending)
        // If sorting direction is ascending ('asc'), return 1 if x > y, otherwise -1
        // If sorting direction is descending ('desc'), return 1 if x < y, otherwise -1
        return dir === "asc" ? (x > y ? 1 : -1) : (x < y ? 1 : -1);
    });


    // Clear the table body (only for visible rows)
    tbody.innerHTML = "";

    // Rebuild table with sorted visible rows and append hidden rows 
    // afterward, preserving their display state.
    // The triple periods ... are known as the spread syntax in JavaScript. 
    // It allows you to expand or unpack elements of an array (or other 
    // iterable objects) into individual elements.
    [...visibleRows, ...hiddenRows].forEach(row => {
        tbody.appendChild(row);
    });
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
    let tableBody = document.querySelector("tbody");

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
    });
}

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

// Clear table and insert new rows on page load
window.onload = function() {
    clearTable();        // Clears existing table rows
    fetch('./start.json')
        .then(response => response.json())  // Parse JSON response
        .then(data => {
            insertTableRows(data); // Call the function with the fetched data
        })
        .catch(error => console.error('Error loading JSON:', error));  // Errors if can't fetch JSON file
};
