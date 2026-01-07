// ===============================
// DATA
// ===============================

const trips = [
  {
    destination: "Paris",
    country: "France",
    startDate: "2025-03-10",
    endDate: "2026-03-15",
    type: "Business",
    notes: "Visit museums"
  },
  {
    destination: "Tokyo",
    country: "Japan",
    startDate: "2024-11-05",
    endDate: "2024-11-12",
    type: "Adventure",
    notes: ""
  },
  {
    destination: "Kyoto",
    country: "Japan",
    startDate: "2024-04-01",
    endDate: "2024-04-10",
    type: "Vacation",
    notes: "Visit Fushimi Inari Shrine early morning."
  }
];

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
// RENDER TRIPS
// ===============================

function renderTrips(list) {
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No trips found.</p>";
    return;
  }

  list.forEach(trip => {
    const endDate = new Date(trip.endDate);
    const isPast = endDate < today;

    const card = document.createElement("div");
    card.className = `trip-card ${isPast ? "trip-past" : "trip-upcoming"}`;

    card.innerHTML = `
      <div class="trip-header">
        <h3>
          ${trip.destination}
          ${isPast ? "✔" : ""}
        </h3>
        <span class="trip-badge ${trip.type.toLowerCase()}">${trip.type}</span>
      </div>

      <div class="trip-country">${trip.country}</div>
      <div class="trip-dates">${trip.startDate} — ${trip.endDate}</div>

      ${trip.notes ? `<div class="trip-notes">"${trip.notes}"</div>` : ""}

      <div class="trip-action">
        <a href="#" class="view-details">View Details →</a>
      </div>
    `;

    container.appendChild(card);
  });
}

// ===============================
// FILTER + SORT
// ===============================

function applyFilters() {
  const search = searchInput.value.toLowerCase();
  const month = monthSelect.value;
  const year = yearSelect.value;
  const sort = sortSelect.value;

  let filtered = trips.filter(trip => {
    const date = new Date(trip.startDate);

    return (
      (trip.destination.toLowerCase().includes(search) ||
       trip.country.toLowerCase().includes(search)) &&
      (month === "" || date.getMonth() + 1 == month) &&
      (year === "" || date.getFullYear() == year)
    );
  });

  // SORT BY DATE
  filtered.sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);

    return sort === "newest"
      ? dateB - dateA
      : dateA - dateB;
  });

  renderTrips(filtered);
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

  renderTrips(trips);
});

// Modal (View Details)
container.addEventListener("click", (e) => {
  if (!e.target.classList.contains("view-details")) return;

  e.preventDefault();

  const card = e.target.closest(".trip-card");

  const title = card.querySelector("h3").innerText;
  const country = card.querySelector(".trip-country").innerText;
  const dates = card.querySelector(".trip-dates").innerText;
  const notesEl = card.querySelector(".trip-notes");
  const badge = card.querySelector(".trip-badge").outerHTML;

  modalContent.innerHTML = `
    <h2>${title}</h2>
    ${badge}
    <p>${country}</p>
    <p>${dates}</p>
    ${notesEl ? `<p class="modal-notes">${notesEl.innerText}</p>` : ""}
  `;

  modal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});



// ===============================
// INITIAL LOAD
// ===============================

renderTrips(trips);









