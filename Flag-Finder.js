//------Https------\\

if (window.location.protocol != "https:") {
  window.location.protocol="https:";
}

const body = document.querySelector('body');
const countryBloc = document.querySelector('.countryBloc');
const countryBtns = document.querySelectorAll('.btn');
const scoreTxt = document.querySelector('.scoreBest');
const scoreBestTxt = document.querySelector('.score');

let scores = 0;
let scoreBest = localStorage.getItem("scoreBest") ? parseInt(localStorage.getItem("scoreBest")) : 0;
let correctCountryName;

async function searchCountry() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const countries = await response.json();

    const randomIndex = Math.floor(Math.random() * countries.length);
    const randomCountry = countries[randomIndex];

    correctCountryName = randomCountry.name.common;
    const flagUrl = randomCountry.flags.png;

    let image = `
        <img class="countryFlag" src="${flagUrl}" alt="${flagUrl} Flag">
    `;

    countryBloc.innerHTML = image;

    const countryNames = [correctCountryName];

    while (countryNames.length < 3) {
      const wrongCountryName = getWrongCountryName(countries);
      if (!countryNames.includes(wrongCountryName)) {
        countryNames.push(wrongCountryName);
      }
    }

    shuffleArray(countryNames);

    scoreTxt.textContent = "Your current score: " + scores;
    scoreBestTxt.textContent = "Your best score: " + scoreBest;

    countryBtns.forEach((countryBtn, index) => {
      countryBtn.textContent = countryNames[index];
      countryBtn.style.background = "blue";
      countryBtn.disabled = false;
    });

  } catch (error) {
    console.error('Erreur: ', error);
  }
}
searchCountry();

function getWrongCountryName(countries) {
  const randomIndex = Math.floor(Math.random() * countries.length);
  return countries[randomIndex].name.common;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

countryBtns.forEach((countryBtn) => {
  countryBtn.addEventListener('click', () => {
    if (countryBtn.textContent === correctCountryName) {
      scores++;
      scoreTxt.textContent = "Your current score: " + scores;
      if (scores > scoreBest) {
        scoreBest = scores;
        scoreBestTxt.textContent = "Your best score: " + scoreBest;
        localStorage.setItem("scoreBest", scoreBest);
      }
      searchCountry();
    } else {
      if (scores > 0) {
        scores--;
        scoreTxt.textContent = "Your current score: " + scores;
        countryBtn.disabled = true;
      }
      countryBtn.style.background = "red";
    }
  });
});