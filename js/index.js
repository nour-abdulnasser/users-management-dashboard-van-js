"use strict";
/**
 * Data dependent variables
 */
const url = "https://jsonplaceholder.typicode.com/users";

/**
 * Document content
 */
const headers = [
  {
    title: "Name", // For display purposes
    value: "name", // For population purposes (using adapted data)
  },
  {
    title: "Email",
    value: "email",
  },
  {
    title: "Phone",
    value: "phone",
  },
  {
    title: "Company Name",
    value: "companyName",
  },
];
// let loadingFlag = false;
// let errorFlag = false;

/**
 * API interactive functions
 */
function fetchData(url) {
  updateLoadingState(true);
  updateErrorState(false);
  // Utilizing await --> function must be async
  //   const response = await fetch(url);
  //   const data = await response.json();

  // Using then, etc --> No need for "async" here
  return fetch(url)
    .then((res) => {
      updateErrorState(false);

      return res.json();
    })
    .catch((err) => {
      updateErrorState(true);
      console.error("Error occurred while fetching.", err);

      return null;
    })
    .finally(() => updateLoadingState(false));
}

const adaptedData = (dataArr) => {
  return dataArr.map((dataItem) => ({
    name: dataItem.name,
    email: dataItem.email,
    phone: dataItem.phone,
    companyName: dataItem.company.name,
  }));
};

const extractCompanies = (dataArr) => {
  return dataArr.map((dataItem) => dataItem.company);
};
const extractCompanyNames = (dataArr) => {
  return dataArr.map((dataItem) => dataItem.company.name);
};

const filterBySearchTerm = (arr, term) => {
  return arr.filter((el) => el.name.toLowerCase().includes(term.toLowerCase()));
};
/**
 *
 * Document content functions
 */
function populateTable(table, dataArr) {
  // TODO: "Handle no data to display"

  if (!dataArr) {
    console.error("No data to populate the table.");
    return;
  } else if (!Array.isArray(dataArr)) {
    console.error(
      "Please make sure your data is in the suitable format (Array)."
    );
    return;
  }

  // Adapt data
  dataArr = adaptedData(dataArr);

  const tableHead = table.querySelector("thead");
  const tableBody = table.querySelector("tbody");

  // Clear the table to fill out the data (this function should display/populate data not append it)
  tableHead.innerHTML = "";
  tableBody.innerHTML = "";

  const headerRowElement = document.createElement("tr");
  headers.forEach((header) => {
    const headerElement = document.createElement("th");
    headerElement.textContent = header.title;
    headerRowElement.appendChild(headerElement);
  });
  tableHead.appendChild(headerRowElement);

  dataArr.forEach((dataItem) => {
    // 1. Create row
    const rowElement = document.createElement("tr");
    // 2. Populate row based on headers
    headers.forEach((header) => {
      const dataElement = document.createElement("td");
      dataElement.textContent = dataItem[header.value];
      rowElement.appendChild(dataElement);
    });
    tableBody.appendChild(rowElement);
  });
}
function populateCsvElement(element, arr) {
  // Method 1: We can generate string first, then pop it in text content
  //Using reduce --> Might need clean up (removing last comma)
  //   const str = arr.reduce(
  //     (accString, currentEl) => (accString = currentEl + ","),
  //     ""
  //   );

  // Method 2: Using join
  const str = arr.join(", ");
  element.textContent = str;
}

// Loading message
function updateLoadingState(state) {
  // Update global state
  const loadingLayout = document.getElementById("loadingLayout");
  if (state) {
    loadingLayout.style.display = "block";
  } else {
    loadingLayout.style.display = "none";
  }
}
// Error message
function updateErrorState(state) {
  const errorLayout = document.getElementById("errorLayout");
  if (state) {
    errorLayout.style.display = "block";
  } else {
    errorLayout.style.display = "none";
  }
}

/**
 * Event Listeners
 */


/**
 * Calls
 */
(async () => {
  // Target
  const usersData = await fetchData(url);
  const companyNames = extractCompanyNames(usersData);
  const usersTable = document.getElementById("usersTable");

  const companyNamesCsvElement = document.getElementById("companyNamesCsv");

  //   populateTable(usersTable, usersData);
  populateCsvElement(companyNamesCsvElement, companyNames);

  let searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("onkeydown", (e) => {
    let dataToDisplay = filterBySearchTerm(usersData, e.target.value);
    populateTable(usersTable, dataToDisplay);
  });
})();
