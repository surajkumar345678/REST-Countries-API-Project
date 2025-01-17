// Dark Mode Toggle
const modeSwitch = document.querySelector(".mode-switch");
const body = document.body;

// Handle Dark Mode Toggle and Save Preference
modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDarkMode = body.classList.contains("dark");

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
    body.classList.add("dark");
    modeSwitch.innerHTML = '<i class="fa-solid fa-sun"></i>&nbsp;&nbsp;Light Mode';
  } else {
    body.classList.remove("dark");
    modeSwitch.innerHTML = '<i class="fa-regular fa-moon"></i>&nbsp;&nbsp;Dark Mode';
  }
});

// Fetch and Render All Countries Data
const countriesContainer = document.querySelector(".countries-container");
const filterByRegion = document.querySelector(".filter-by-region");
const searchInput = document.querySelector(".search-container input");

let allCountriesData = fetch("https://restcountries.com/v3.1/all")
  .then((res) => res.json())
  .then((data) => {
    renderCountries(data);
    allCountriesData = data;
  });

// Handle Region Filtering
filterByRegion.addEventListener("change", (e) => {
  fetch(`https://restcountries.com/v3.1/region/${filterByRegion.value}`)
    .then((res) => res.json())
    .then(renderCountries);
});

// Render Countries into the Container
function renderCountries(data) {
  countriesContainer.innerHTML = "";
  data.forEach((country) => {
    const countryCard = document.createElement("a");
    countryCard.classList.add("country-card");
    countryCard.href = `country.html?name=${country.name.common}`;
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

// Handle Search Input
searchInput.addEventListener("input", (e) => {
  const filteredCountries = allCountriesData.filter((country) =>
    country.name.common.toLowerCase().includes(e.target.value.toLowerCase())
  );
  renderCountries(filteredCountries);
});

// Fetch Country Details
const countryName = new URLSearchParams(location.search).get("name");

const flagImage = document.querySelector(".country-details img");
const countryNameH1 = document.querySelector(".country-details h1");
const nativeName = document.querySelector(".native-name");
const population = document.querySelector(".population");
const region = document.querySelector(".region");
const subRegion = document.querySelector(".sub-region");
const capital = document.querySelector(".capital");
const tld = document.querySelector(".tld");
const languages = document.querySelector(".languages");
const currency = document.querySelector(".currency");
const borderCountries = document.querySelector(".border-countries");

fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
  .then((res) => res.json())
  .then(([country]) => {
    flagImage.src = country.flags.svg;
    countryNameH1.innerText = country.name.common;
    population.innerText = Intl.NumberFormat("en-IN").format(country.population);
    region.innerText = country.region;
    subRegion.innerText = country.subregion || "No Subregion Info";
    capital.innerText = country.capital?.[0] || "No Capital Info";
    tld.innerText = country.tld.join(", ");
    currency.innerText = country.currencies
      ? Object.values(country.currencies)
          .map((curr) => `${curr.name} (${curr.symbol || "N/A"})`)
          .join(", ")
      : "No Currency Info";
    languages.innerText = country.languages
      ? Object.values(country.languages).join(", ")
      : "No Language Info";

    nativeName.innerText = country.name.nativeName
      ? Object.values(country.name.nativeName)[0].common
      : country.name.common;

    if (country.borders) {
      // Fetching and displaying border countries
      Promise.all(
        country.borders.map((border) =>
          fetch(`https://restcountries.com/v3.1/alpha/${border}`).then((res) =>
            res.json()
          )
        )
      ).then((results) => {
        results.forEach(([borderCountry]) => {
          const borderCountryTag = document.createElement("a");
          borderCountryTag.innerText = borderCountry.name.common;
          borderCountryTag.href = `country.html?name=${borderCountry.name.common}`;
          borderCountries.append(borderCountryTag);
        });
      });
    } else {
      // Display a message when there are no border countries
      const noBordersMessage = document.createElement("span");
      noBordersMessage.innerText = `${countryName} has no border countries.`;
      borderCountries.append(noBordersMessage);
    }
  });
