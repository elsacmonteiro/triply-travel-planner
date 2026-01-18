document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("tripForm");
  const countrySelect = document.getElementById("countrySelect");
  const pdfInput = document.getElementById("documents");

  const placeInput = document.getElementById("placeInput");
  const addPlaceBtn = document.getElementById("addPlaceBtn");
  const placesList = document.getElementById("placesList");

  let placesToVisit = [];

  /* ===============================
     PLACES TO VISIT
  =============================== */

  addPlaceBtn.addEventListener("click", () => {
    const value = placeInput.value.trim();
    if (!value) return;

    placesToVisit.push(value);

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${value}</span>
      <button type="button" class="remove-place">×</button>
    `;

    li.querySelector(".remove-place").addEventListener("click", () => {
      placesToVisit = placesToVisit.filter(p => p !== value);
      li.remove();
    });

    placesList.appendChild(li);
    placeInput.value = "";
  });

  /* ===============================
     FORM SUBMIT
  =============================== */

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);

    const newTrip = {
      destination: data.get("destination"),
      country: data.get("country"),
      startDate: data.get("startDate"),
      endDate: data.get("endDate"),
      type: data.get("type"),
      notes: data.get("notes"),
      documents: pdfInput.files.length
        ? Array.from(pdfInput.files).map(f => f.name)
        : [],
      placesToVisit: placesToVisit
    };

    const storedTrips = JSON.parse(localStorage.getItem("trips")) || [];
    storedTrips.push(newTrip);
    localStorage.setItem("trips", JSON.stringify(storedTrips));

    alert("Trip added successfully!");

    form.reset();
    placesList.innerHTML = "";
    placesToVisit = [];
  });

});

/* ===============================
   SEGMENTED CONTROL
=============================== */

const segButtons = document.querySelectorAll(".segmented-control button");
const countryItems = document.querySelectorAll(".country-item");

segButtons.forEach(button => {
  button.addEventListener("click", () => {
    const region = button.dataset.region;

    // botão ativo
    segButtons.forEach(b => b.classList.remove("active"));
    button.classList.add("active");

    // mostrar country correto
    countryItems.forEach(item => {
      item.classList.remove("active");
      if (item.dataset.region === region) {
        item.classList.add("active");
      }
    });
  });
});




