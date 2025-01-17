const countriesContainer = document.querySelector(".countries-container");
const filterByRegion = document.querySelector(".filter-by-region");
const searchInput = document.querySelector(".search-container input");
const modeSwitch = document.querySelector(".mode-switch");

// Fetch all countries data and render initially
let allCountriesData = fetch("https://restcountries.com/v3.1/all")
  .then((res) => res.json())
  .then((data) => {
    renderCountries(data);
    allCountriesData = data;
  });

// Handle region filtering
filterByRegion.addEventListener("change", (e) => {
  fetch(`https://restcountries.com/v3.1/region/${filterByRegion.value}`)
    .then((res) => res.json())
    .then(renderCountries);
});

// Render countries into the container
function renderCountries(data) {
  countriesContainer.innerHTML = "";
  data.forEach((country) => {
    const countryCard = document.createElement("a");
    countryCard.classList.add("country-card");
    countryCard.href = `https://neon-cobbler-a1a1dd.netlify.app//country.html?name=${country.name.common}`;
    countryCard.innerHTML = `
      <img src="${country.flags.svg}" alt="${country.name.common} flag" loading="lazy" />
      <div class="card-text">
        <h3 class="card-title">${country.name.common}</h3>
        <p><b>Population: </b>${Intl.NumberFormat("en-IN").format(country.population)}</p>
        <p><b>Region: </b>${country.region}</p>
        <p><b>Capital: </b>${country.capital?.[0]}</p>
      </div>
    `;
    countriesContainer.append(countryCard);
  });
}

// Handle search input
searchInput.addEventListener("input", (e) => {
  const filteredCountries = allCountriesData.filter((country) =>
    country.name.common.toLowerCase().includes(e.target.value.toLowerCase())
  );
  renderCountries(filteredCountries);
});

// Toggle dark mode and save preference
modeSwitch.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDarkMode = document.body.classList.contains("dark");
  
  // Update the toggle text
  modeSwitch.innerHTML = isDarkMode
    ? '<i class="fa-solid fa-sun"></i>&nbsp;&nbsp;Light Mode'
    : '<i class="fa-regular fa-moon"></i>&nbsp;&nbsp;Dark Mode';

  // Save the preference to local storage
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
});

// Load the saved theme preference on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    modeSwitch.innerHTML = '<i class="fa-solid fa-sun"></i>&nbsp;&nbsp;Light Mode';
  } else {
    document.body.classList.remove("dark");
    modeSwitch.innerHTML = '<i class="fa-regular fa-moon"></i>&nbsp;&nbsp;Dark Mode';
  }
});
