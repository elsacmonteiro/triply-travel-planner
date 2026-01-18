// ===============================
// DATA (SOURCE OF TRUTH)
// ===============================

const trips = JSON.parse(localStorage.getItem("trips")) || [];
let currentTrips = [...trips];

// ===============================
// ELEMENTS
// ===============================

const container = document.getElementById("tripsContainer");
const searchInput = document.getElementById("searchInput");
const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");
const sortSelect = document.getElementById("sortSelect");

const applyBtn = document.getElementById("applyFilters");
const clearBtn = document.getElementById("clearFilters");

const modal = document.getElementById("tripModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

const today = new Date();

// ===============================
// HELPERS
// ===============================

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function calculateDays(start, end) {
  return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
}

function monthInRange(start, end, month) {
  const s = new Date(start).getMonth() + 1;
  const e = new Date(end).getMonth() + 1;
  return month >= s && month <= e;
}

function updateClearButton() {
  const hasFilters =
    searchInput.value.trim() !== "" ||
    monthSelect.value !== "" ||
    yearSelect.value !== "";

  clearBtn.disabled = !hasFilters;
}

// ===============================
// RENDER
// ===============================

function renderTrips(list) {
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = "<p>No trips found.</p>";
    return;
  }

  list.forEach((trip, index) => {
    const isPast = new Date(trip.endDate) < today;

    container.innerHTML += `
      <div class="trip-card ${isPast ? "trip-past" : "trip-upcoming"}">
        <div class="trip-header">
          <h3>${trip.destination}</h3>

          <div class="trip-menu">
            <button class="trip-menu-btn">⋯</button>
            <div class="trip-menu-dropdown">
              <button class="delete-trip" data-index="${index}">Delete</button>
            </div>
          </div>
        </div>

        <div class="trip-country">${trip.country}</div>

        <div class="trip-dates">
          ${formatDate(trip.startDate)} – ${formatDate(trip.endDate)}
          · ${calculateDays(trip.startDate, trip.endDate)} days
        </div>

        <span class="trip-badge ${trip.type.toLowerCase()}">${trip.type}</span>

        <div class="trip-action">
          <a href="#" class="view-details" data-index="${index}">
            View Details →
          </a>
        </div>
      </div>
    `;
  });
}

// ===============================
// FILTERS
// ===============================

function applyFilters() {
  const search = searchInput.value.toLowerCase();
  const month = monthSelect.value;
  const year = yearSelect.value;
  const sort = sortSelect.value;

  currentTrips = trips.filter(trip => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    return (
      (trip.destination.toLowerCase().includes(search) ||
       trip.country.toLowerCase().includes(search)) &&
      (month === "" || monthInRange(trip.startDate, trip.endDate, Number(month))) &&
      (year === "" || start.getFullYear() == year || end.getFullYear() == year)
    );
  });

  currentTrips.sort((a, b) =>
    sort === "newest"
      ? new Date(b.startDate) - new Date(a.startDate)
      : new Date(a.startDate) - new Date(b.startDate)
  );

  renderTrips(currentTrips);
  updateClearButton();
}

// ===============================
// EVENTS
// ===============================

applyBtn.addEventListener("click", applyFilters);

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  monthSelect.value = "";
  yearSelect.value = "";
  sortSelect.value = "newest";

  currentTrips = [...trips];
  renderTrips(currentTrips);
  updateClearButton();
});

searchInput.addEventListener("input", updateClearButton);
monthSelect.addEventListener("change", updateClearButton);
yearSelect.addEventListener("change", updateClearButton);

// ===============================
// CARD ACTIONS
// ===============================

container.addEventListener("click", (e) => {

  // MENU ⋯
  if (e.target.classList.contains("trip-menu-btn")) {
    e.target.closest(".trip-menu").classList.toggle("open");
  }

  // DELETE
  if (e.target.classList.contains("delete-trip")) {
    const index = e.target.dataset.index;
    const tripToDelete = currentTrips[index];
    const realIndex = trips.indexOf(tripToDelete);

    if (confirm(`Delete trip to ${tripToDelete.destination}?`)) {
      trips.splice(realIndex, 1);
      localStorage.setItem("trips", JSON.stringify(trips));
      applyFilters();
    }
  }

  // VIEW DETAILS
  if (e.target.classList.contains("view-details")) {
    e.preventDefault();
    const trip = currentTrips[e.target.dataset.index];

    modalContent.innerHTML = `
      <h2>${trip.destination}</h2>
      <p><strong>${trip.country}</strong></p>

      <p>
        ${formatDate(trip.startDate)} – ${formatDate(trip.endDate)}
        · ${calculateDays(trip.startDate, trip.endDate)} days
      </p>

      <h4>Notes</h4>
      <p>${trip.notes || "No notes provided."}</p>

      <h4>Places to visit</h4>
      ${
        trip.placesToVisit.length
          ? `<ul>${trip.placesToVisit.map(p => `<li>${p}</li>`).join("")}</ul>`
          : `<p>No places to visit.</p>`
      }

      <h4>Documents</h4>
      ${
        trip.documents.length
          ? `<ul>${trip.documents.map(d => `<li>${d}</li>`).join("")}</ul>`
          : `<p>No documents.</p>`
      }
    `;

    modal.classList.remove("hidden");
  }
});

// ===============================
// MODAL CLOSE
// ===============================

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// ===============================
// INIT
// ===============================

renderTrips(currentTrips);
updateClearButton();






