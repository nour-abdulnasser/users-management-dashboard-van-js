"use strict";

const url = "https://jsonplaceholder.typicode.com/users";

let loadingFlag = false;
let errorFlag = false;

function fetchData(url) {
  loadingFlag = true;

  // Utilizing await --> function must be async
  //   const response = await fetch(url);
  //   const data = await response.json();

  // Using then, etc --> No need for "async" here
  return fetch(url)
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      errorFlag = true;
      console.error("Error occurred while fetching.", err);
      return null;
    })
    .finally(() => (loadingFlag = false));

  //   console.log(data);
}
const headers = ["name", "email", "phone", "companyName"];

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
function populateTable(table, dataArr) {
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

  //   const tableHead = table.querySelector("thead");
  const tableBody = table.querySelector("tbody");

  // Clear the table to fill out the data (this function should display/populate data not append it)
  tableBody.innerHTML = "";

  dataArr.forEach((dataItem) => {
    // 1. Create row
    const rowElement = document.createElement("tr");
    // 2. Populate row based on headers
    headers.forEach((header) => {
      const dataElement = document.createElement("td");
      dataElement.textContent = dataItem[header];
      rowElement.appendChild(dataElement);
    });
    tableBody.appendChild(rowElement);
  });
}

(async () => {
  // Target
  const usersData = await fetchData(url);
  const usersTable = document.getElementById("usersTable");
  populateTable(usersTable, usersData);
})();
