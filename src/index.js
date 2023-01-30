import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import "notiflix/dist/notiflix-3.2.6.min.css";

import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 500;
const refs = {
    inputEl: document.querySelector('#search-box'),
    countryListEl: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};


refs.inputEl.addEventListener('input', debounce((onInputChange), DEBOUNCE_DELAY));
function onInputChange(e) { 
    e.preventDefault();
    const countryInp = e.target.value;
    const countryToFind = countryInp.trim()
    deleteMurkup(countryToFind);
    fetchCountries(countryToFind)
        .then(renderMarkup)
        .catch(onError);
};

function createUlMarkup(countries) {
    refs.countryInfo.innerHTML = '';
    return countries.map(({ name, flags }) => {
        return `<div class="flag-name-ul">
        <img
        class="country-flag"
        src="${flags.svg}"
        alt="Flag of ${name.official}"
        />
        <h1 class="country-name">${name.official}</h1></div>`;
    }
    ).join('');
};

function createDivMarkup(countries) { 
    refs.countryListEl.innerHTML = '';
    return countries.map(({ name, capital, population, flags, languages }) => {
       const allLanguage = Object.values(languages);
        return `<div class="flag-name-div">
        <img
        class="country-flag"
        src="${flags.svg}"
        alt="Flag of ${name.official}"
        />
        <h1 class="country-name">${name.official}</h1></div>
        <ul class="country-info">
        <li class="country-capital">${capital}</li>
        <li class="country-population">${population}</li>
        <li class="country-language">${allLanguage}</li>
        </ul>`;
    }
    ).join('');
};

function renderMarkup(country) {
console.log(country.length);
    if (country.length >= 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    } else
    if (country.length !== 1 || country.length <= 10) {
        refs.countryListEl.insertAdjacentHTML('beforeend', createUlMarkup(country));
    } else
    if (country.length === 1) {
        refs.countryInfo.insertAdjacentHTML('beforeend', createDivMarkup(country));
    }
};

function onError(error) {
    Notiflix.Notify.failure(`ops, there is no country with that name`)
};

function deleteMurkup(countryToFind) {
    if (countryToFind === "") {
        refs.countryInfo.innerHTML = '';
        refs.countryListEl.innerHTML = '';
    }
};
