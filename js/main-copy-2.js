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