let carsData = []; // Variable to store all car data

// Function to fetch car data from the API
async function fetchCarData() {
  const response = await fetch("https://myfakeapi.com/api/cars/");
  const data = await response.json();
  const cars = data.cars;
  carsData = cars; // Store all car data
  localStorage.setItem("cars", JSON.stringify(cars)); // Store cars in local storage
  return cars;
}

// Function to create a table row for a car
function createTableRow(car) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${car.car}</td>
    <td>${car.car_model}</td>
        <td>${car.car_vin}</td>
        <td>${car.car_color}</td>
        <td>${car.car_model_year}</td>
        <td>${car.price}</td>
        <td>${car.availability}</td>
    <td>
      <select class="actionsDropdown">
        <option value="">Actions</option>
        <option value="edit">Edit</option>
        <option value="delete">Delete</option>
      </select>
    </td>
  `;

  const actionsDropdown = row.querySelector(".actionsDropdown");
  actionsDropdown.addEventListener("change", handleActionChange);

  return row;
}

// Function to handle the change event of the actions dropdown
function handleActionChange(event) {
  const selectedAction = event.target.value;
  const row = event.target.closest("tr");
  const carData = Array.from(row.children).map((cell) => cell.textContent);

  if (selectedAction === "edit") {
    openEditModal(carData);
  } else if (selectedAction === "delete") {
    openDeleteModal(carData);
  }

  // Reset the dropdown to the default option
  event.target.value = "";
}

// Function to render the pagination links
function renderPagination() {
  const paginationContainer = document.querySelector("#pagination");
  const totalPages = Math.ceil(carsData.length / 10);

  let paginationHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `<button class="page-link">${i}</button>`;
  }
  paginationContainer.innerHTML = paginationHTML;

  const pageLinks = document.querySelectorAll(".page-link");
  pageLinks.forEach((link) => {
    link.addEventListener("click", handlePageClick);
  });
}

// Function to populate the table with car data for the specified page
function populateTable(page) {
  const tableBody = document.querySelector("#carTable tbody");
  const startIndex = (page - 1) * 10;
  const endIndex = startIndex + 10;
  const currentPageCars = carsData.slice(startIndex, endIndex);

  tableBody.innerHTML = "";
  currentPageCars.forEach((car) => {
    const row = createTableRow(car);
    tableBody.appendChild(row);
  });
}

function getCurrentPage() {
  const activePage = document.querySelector(".page-link.active");
  return parseInt(activePage.textContent);
}

// Function to handle the search functionality
function handleSearch(event) {
  const searchQuery = event.target.value.toLowerCase();
  const filteredCars = carsData.filter((car) => {
    const carData = Object.values(car).map((value) =>
      value.toString().toLowerCase()
    );
    return carData.some((data) => data.includes(searchQuery));
  });

  populateTableWithSearchResults(filteredCars);
}

// Function to populate the table with search results
function populateTableWithSearchResults(filteredCars) {
  const tableBody = document.querySelector("#carTable tbody");
  tableBody.innerHTML = "";

  filteredCars.forEach((car) => {
    const row = createTableRow(car);
    tableBody.appendChild(row);
  });
}

// Function to handle page clicks
function handlePageClick(event) {
  const page = parseInt(event.target.textContent);
  populateTable(page);
}

// Function to initialize the page
function initializePage() {
  const searchInput = document.querySelector("#searchInput");
  const addCarBtn = document.querySelector("#addCarBtn");

  searchInput.addEventListener("input", handleSearch);
  addCarBtn.addEventListener("click", handleAddCarButtonClick);

  const storedCars = localStorage.getItem("cars");

  if (storedCars) {
    carsData = JSON.parse(storedCars);
    populateTable(1); // Show first page initially
    renderPagination();
  } else {
    fetchCarData()
      .then((cars) => {
        populateTable(1); // Show first page initially
        renderPagination();
      })
      .catch((error) => {
        console.error("Error fetching car data:", error);
      });
  }
}

// Function to retrieve cars from local storage or API
function getCarsFromLocalStorage() {
  const storedCars = localStorage.getItem("cars");
  return storedCars ? JSON.parse(storedCars) : [];
}

// Function to open the edit modal
function openEditModal(carData) {
  // Get the edit modal element
  const editModal = document.getElementById("editModal");

  // Remove the "hidden" class from the edit modal
  editModal.classList.remove("hidden");

  // Get the modal form fields
  const companyInput = editModal.querySelector("#editCompany");
  const modelInput = editModal.querySelector("#editModel");
  const VINInput = editModal.querySelector("#editVIN");
  const colorInput = editModal.querySelector("#editColor");
  const yearInput = editModal.querySelector("#editYear");
  const priceInput = editModal.querySelector("#editPrice");
  const availabilityInput = editModal.querySelector("#editAvailability");

  // Populate the modal form fields with car data
  companyInput.value = carData[0];
  modelInput.value = carData[1];
  VINInput.value = carData[2];
  colorInput.value = carData[3];
  yearInput.value = carData[4];
  priceInput.value = carData[5];
  availabilityInput.value = carData[6];
}

// Function to handle the Save button click in the edit form
function handleEditButtonClick() {
  // Get the edit modal element
  const editModal = document.getElementById("editModal");

  // Get the modal form fields
  const companyInput = editModal.querySelector("#editCompany");
  const modelInput = editModal.querySelector("#editModel");
  const VINInput = editModal.querySelector("#editVIN");
  const colorInput = editModal.querySelector("#editColor");
  const yearInput = editModal.querySelector("#editYear");
  const priceInput = editModal.querySelector("#editPrice");
  const availabilityInput = editModal.querySelector("#editAvailability");

  // Get the updated values from the form fields
  const updatedCompany = companyInput.value;
  const updatedModel = modelInput.value;
  const updatedVIN = VINInput.value;
  const updatedColor = colorInput.value;
  const updatedYear = yearInput.value;
  const updatedPrice = priceInput.value;
  const updatedAvailability = availabilityInput.value;

  // Find the car in the data array based on the VIN
  const carIndex = carsData.findIndex((car) => car.car_vin === updatedVIN);

  // If the car is found, update its information
  if (carIndex !== -1) {
    carsData[carIndex].car_color = updatedColor;
    carsData[carIndex].price = updatedPrice;
    carsData[carIndex].availability = updatedAvailability;

    // Update the car data in local storage
    localStorage.setItem("cars", JSON.stringify(carsData));
  }

  // Hide the edit modal
  editModal.classList.add("hidden");

  // Repopulate the table with the updated car data
  populateTable(currentPage);
}

// Attach event listener to the Save button in the edit form
const editButton = document.getElementById("editButton");
editButton.addEventListener("click", handleEditButtonClick);

// Function to open the delete modal
function openDeleteModal(carData) {
  // Get the edit modal element
  const deleteModal = document.getElementById("deleteModal");
  deleteModal.classList.remove("hidden");

  // Get the modal form fields
  const companyInput = deleteModal.querySelector("#deleteCompany");
  const modelInput = deleteModal.querySelector("#deleteModel");
  const VINInput = deleteModal.querySelector("#deleteVIN");
  const colorInput = deleteModal.querySelector("#deleteColor");
  const yearInput = deleteModal.querySelector("#deleteYear");
  const priceInput = deleteModal.querySelector("#deletePrice");
  const availabilityInput = deleteModal.querySelector("#deleteAvailability");

  // Populate the modal form fields with car data
  companyInput.value = carData[0];
  modelInput.value = carData[1];
  VINInput.value = carData[2];
  colorInput.value = carData[3];
  yearInput.value = carData[4];
  priceInput.value = carData[5];
  availabilityInput.value = carData[6];

  const confirmDeleteButton = document.getElementById("confirmDeleteButton");
  const cancelDeleteButton = document.getElementById("cancelDeleteButton");

  confirmDeleteButton.addEventListener("click", () => {
    const currentPage = getCurrentPage(); // Get the current page number
    deleteCar(carData, currentPage);
    deleteModal.classList.add("hidden");
  });

  cancelDeleteButton.addEventListener("click", () => {
    deleteModal.classList.add("hidden");
  });
}

// Function to delete car information
function deleteCar(carData, currentPage) {
  const carVIN = carData[2];

  // Find the car in the data array based on the VIN
  const carIndex = carsData.findIndex((car) => car.car_vin === carVIN);

  // If the car is found, remove it from the array
  if (carIndex !== -1) {
    carsData.splice(carIndex, 1);

    // Update the car data in local storage
    localStorage.setItem("cars", JSON.stringify(carsData));

    // Repopulate the table with the updated car data
    populateTable(currentPage);
  }
}

// Attach event listener to the Confirm Delete button in the Delete form
const confirmDeleteButton = document.getElementById("confirmDeleteButton");
confirmDeleteButton.addEventListener("click", deleteCar);

// Function to handle the "Add Car" button click
function handleAddCarButtonClick() {
  // Code for handling the "Add Car" button click goes here
}

// Call the initializePage function when the DOM is ready
document.addEventListener("DOMContentLoaded", initializePage);
