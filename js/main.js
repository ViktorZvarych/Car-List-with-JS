let carsData = []; // Variable to store all car data

// Function to fetch car data from the API
async function fetchCarData() {
  try {
    const response = await fetch("https://myfakeapi.com/api/cars/");
    const data = await response.json();
    const cars = data.cars;
    carsData = cars; // Store all car data
    localStorage.setItem("cars", JSON.stringify(cars)); // Store cars in local storage
    return cars;
  } catch (error) {
    console.error("Error fetching car data:", error);
    return [];
  }
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

const paginationContainer = document.querySelector("#pagination"); //Container for pagination

let currentPage = 1; // Variable for current page
let activePage = null; // Variable for active page link


// Function to render the pagination links
function renderPagination() {
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

  let activePage = paginationContainer.querySelector(
    `.page-link:nth-child(${currentPage})`
  );

  if (activePage) {
    activePage.classList.add("active");
  }
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

  const paginationLinks = document.querySelectorAll(".page-link");
  paginationLinks.forEach((link) => {
    link.classList.remove("active");
  });

  const activePage = document.querySelector(`.page-link:nth-child(${page})`);
  activePage.classList.add("active");
}

// Function to get the currently active page number
function getCurrentPage() {
  activePage = document.querySelector(".page-link.active");
  return activePage ? parseInt(activePage.textContent) : 1;
}

// Function to handle page clicks
function handlePageClick(event) {
  const page = parseInt(event.target.textContent);
  currentPage = page; // Update the currentPage variable
  populateTable(currentPage);
}

// Function to handle the search functionality
function handleSearch(event) {
  const searchQuery = event.target.value.toLowerCase();
  if (searchQuery === "") {
    // If the search field is empty, display the first page
    initializePage();
  } else {
    const filteredCars = carsData.filter((car) => {
      const carData = Object.values(car).map((value) =>
        value.toString().toLowerCase()
      );
      return carData.some((data) => data.includes(searchQuery));
    });

    populateTableWithSearchResults(filteredCars);
  }
}

// Function to populate the table with search results
function populateTableWithSearchResults(filteredCars) {
  const tableBody = document.querySelector("#carTable tbody");
  tableBody.innerHTML = "";
  paginationContainer.innerHTML = "";

  filteredCars.forEach((car) => {
    const row = createTableRow(car);
    tableBody.appendChild(row);
  });
}

// Function to initialize the page
function initializePage() {
  const searchInput = document.querySelector("#searchInput");
  //   const addCarBtn = document.querySelector("#addCarBtn");

  searchInput.addEventListener("input", handleSearch);
  //   addCarBtn.addEventListener("click", handleAddCarButtonClick);

  const storedCars = localStorage.getItem("cars");

  if (storedCars) {
    carsData = JSON.parse(storedCars);
    currentPage = 1; // Show first page initially
    renderPagination(); // Render pagination links first
    populateTable(currentPage);
  } else {
    fetchCarData()
      .then((cars) => {
        currentPage = 1; // Show first page initially
        renderPagination(); // Render pagination links first
        populateTable(currentPage);
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

const editModal = document.getElementById("editModal"); // The edit modal element

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
function handleSaveEditButtonClick() {
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
    // Repopulate the table with the updated car data
      console.log(currentPage);
      populateTable(currentPage);
      console.log(currentPage);
      
  }

  // Hide the edit modal
  editModal.classList.add("hidden");
}

// Attach event listener to the Save button in the edit form
const saveEditButton = document.getElementById("saveEditButton");
saveEditButton.addEventListener("click", handleSaveEditButtonClick);

// Attach event listener to the Close button in the edit form
const closeEditButton = document.getElementById("closeEditButton");
// Hide the edit modal
closeEditButton.addEventListener("click", handleCloseEditButtonClick);

// Function to handle the Save button click in the edit form
function handleCloseEditButtonClick() {
  editModal.classList.add("hidden");
}

// #region Delete Modal

// Function to open the delete modal

  // Get the edit modal element
const deleteModal = document.getElementById("deleteModal");

function openDeleteModal(carData) {
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
    currentPage = getCurrentPage(); // Get the current page number
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

// #endregion

// #region Add Modal

// Get the Add modal element
const addModal = document.getElementById("addModal");

// Function to handle the Open Add button click
function handleOpenAddButtonClick() {
  addModal.classList.remove("hidden");
}

// Attach event listener to the Open Add Car button
const openAddButton = document.getElementById("openAddBtn");
// Hide the edit modal
openAddButton.addEventListener("click", handleOpenAddButtonClick);

// Function to handle the Add Car form submission
function handleAddCarConfirm(event) {
  event.preventDefault();

  // Get the form input values
  const companyInput = document.querySelector("#addCompany");
  const modelInput = document.querySelector("#addModel");
  const VINInput = document.querySelector("#addVIN");
  const colorInput = document.querySelector("#addColor");
  const yearInput = document.querySelector("#addYear");
  const priceInput = document.querySelector("#addPrice");
  const availabilityInput = document.querySelector("#addAvailability");

  console.log(availabilityInput);
  console.log(typeof(availabilityInput));

  // Validate the form inputs
  if (
    companyInput.value === "" ||
    modelInput.value === "" ||
    VINInput.value === "" ||
    colorInput.value === "" ||
    yearInput.value === "" ||
    priceInput.value === "" ||
    availabilityInput.value === ""
  ) {
    alert("Please fill in all the fields.");
    return;
  }

  // Retrieve the values from the input fields
  const company = companyInput.value;
  const model = modelInput.value;
  const VIN = VINInput.value;
  const color = colorInput.value;
  const year = yearInput.value;
  const price = priceInput.value;
  const availability = availabilityInput.value;

  // Create a new car object
  const newCar = {
    car: company,
    car_model: model,
    car_vin: VIN,
    car_color: color,
    car_model_year: year,
    price: price,
    availability: availability,
  };

  // Add the new car object to the carsData array
  carsData.unshift(newCar);

  // Update the car data in local storage
  localStorage.setItem("cars", JSON.stringify(carsData));

  // Reset the form inputs
  document.getElementById("addForm").reset();

  // Repopulate the table with the updated car data
  currentPage = getCurrentPage();
  populateTable(currentPage);

  // Hide the Add modal
  addModal.classList.add("hidden");
}

// Attach event listener to the Add form submit event
const confirmAddButton = document.getElementById("confirmAddButton");
confirmAddButton.addEventListener("click", handleAddCarConfirm);

// Function to handle the Save button click in the edit form
function handleCloseAddButtonClick() {
  addModal.classList.add("hidden");
}

// Attach event listener to the Close button in the Add form
const closeAddButton = document.getElementById("closeAddButton");
// Hide the Add modal
closeAddButton.addEventListener("click", handleCloseAddButtonClick);

// #endregion

const closeEditModalBtn = document.getElementById("closeEditModalBtn");
closeEditModalBtn.addEventListener("click", handleCloseEditModalBtn);

function handleCloseEditModalBtn() {
    editModal.classList.add("hidden");
}
    
  // Call the initializePage function when the DOM is ready
  document.addEventListener("DOMContentLoaded", initializePage);
