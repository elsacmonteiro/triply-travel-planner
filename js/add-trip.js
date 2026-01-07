const form = document.getElementById("tripForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = new FormData(form);

  const trip = {
    destination: data.get("destination"),
    country: data.get("country"),
    startDate: data.get("startDate"),
    endDate: data.get("endDate"),
    type: data.get("type"),
    notes: data.get("notes")
  };

  console.log("New trip added:", trip);

  alert("Trip added successfully!");
  form.reset();
});

