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
    console.log(country);
    flagImage.src = country.flags.svg;
    countryNameH1.innerText = country.name.common;
    population.innerText = Intl.NumberFormat("en-IN").format(
      country.population
    );
    region.innerText = country.region;
    if (country.subregion) {
      subRegion.innerText = country.subregion;
    }
    if (country.capital?.[0]) {
      capital.innerText = country.capital?.[0];
    }

    tld.innerText = country.tld.join(", ");

    if (country.currencies) {
      currency.innerText = Object.values(country.currencies)
        .map(function (currency) {
          return currency.name + " (" + (currency.symbol || "N/A") + ")";
        })
        .join(", ");
    } else {
      currency.innerText = "N/A";
    }

    if (country.languages) {
      languages.innerText = Object.values(country.languages).join(", ");
    }

    if (country.name.nativeName) {
      nativeName.innerText = Object.values(country.name.nativeName)[0].common;
    } else {
      nativeName.innerText = country.name.common;
    }
    if (country.borders) {
      country.borders.forEach((border) => {
        fetch(`https://restcountries.com/v3.1/alpha/${border}`)
          .then((res) => res.json())
          .then(([borderCountry]) => {
            const borderCountryTag = document.createElement("a");
            borderCountryTag.innerText = borderCountry.name.common;
            borderCountryTag.href = `country.html?name=${borderCountry.name.common}`;
            borderCountries.append(borderCountryTag);
          });
      });
    }
  });
