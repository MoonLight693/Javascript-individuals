
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content
from https://www.w3schools.com/howto/howto_js_dropdown.asp */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
//from https://www.w3schools.com/howto/howto_js_dropdown.asp
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

 /** function for sorting table
  *  adapted from https://www.w3schools.com/howto/howto_js_sort_table.asp
  * 
  * @param {boolean} order signifies whether to sort prices numerically ascending or descending
  */
  function sortTable(order) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("myTable");
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[2];
        y = rows[i + 1].getElementsByTagName("TD")[2];
        //check if the two rows should switch place:
        //do we want to sort lowest to highest?
        if(order == 0) {
            if (Number(x.innerHTML) > Number(y.innerHTML)) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        //do we want to sort highest to lowest?
        if(order == 1) {
            if (Number(x.innerHTML) < Number(y.innerHTML)) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
                }
        }

      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }
  
  //declare sorting_preferences variable
  //local storage key is "sorting_preferences"
  let sorting_preferences = localStorage.getItem("sorting_preferences");

  //connect leastExpensiveSort and mostExpensiveSort variables to their respective buttons
  var leastExpensiveSort = document.getElementById("Least Expensive");
  var mostExpensiveSort = document.getElementById("Most Expensive");

  //lines for debugging
  console.log(mostExpensiveSort);
  console.log(leastExpensiveSort);

  //if "Least Expensive" button is clicked
  //"sorting_preferences" holds value ""
  leastExpensiveSort.addEventListener("click", function() {
    localStorage.setItem("sorting_preferences", "");
    sorting_preferences = localStorage.getItem("sorting_preferences");
    console.log(Boolean(sorting_preferences));
  })

  //if "Most Expensive" button is clicked
  //"sorting_preferences" holds value 1
  mostExpensiveSort.addEventListener("click", function() {
    localStorage.setItem("sorting_preferences", 1);
    sorting_preferences = localStorage.getItem("sorting_preferences");
    console.log(Boolean(sorting_preferences));
  })

  //whenever the webpage is loaded
  //sort table based on the latest value that "sorting_preferences holds"
  window.onload = function() {
    sortTable(Boolean(sorting_preferences));
    console.log(sorting_preferences);
  }
     

 

