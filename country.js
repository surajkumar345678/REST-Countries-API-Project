// Dark Mode Toggle
const modeSwitch = document.querySelector(".mode-switch");
const body = document.body;

// Check if dark mode preference is stored in localStorage
const savedMode = localStorage.getItem("darkMode");
if (savedMode === "true") {
  body.classList.add("dark");
  modeSwitch.innerHTML = `<i class="fa-regular fa-sun"></i>&nbsp;&nbsp;Light Mode`;
} else {
  body.classList.remove("dark");
  modeSwitch.innerHTML = `<i class="fa-regular fa-moon"></i>&nbsp;&nbsp;Dark Mode`;
}

// Event Listener for Dark Mode Toggle
modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");

  // Save the mode in localStorage
  const isDarkMode = body.classList.contains("dark");
  localStorage.setItem("darkMode", isDarkMode);

  const modeText = isDarkMode ? "Light Mode" : "Dark Mode";
  modeSwitch.innerHTML = `<i class="fa-regular ${isDarkMode ? "fa-sun" : "fa-moon"}"></i>&nbsp;&nbsp;${modeText}`;
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
    population.innerText = Intl.NumberFormat("en-IN").format(
      country.population
    );
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
      // Fetching and displaying border countries as before
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
