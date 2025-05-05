let yesChance = 75;
let noChance = 25;

const updateChancesDisplay = () => {
  document.getElementById("chances").textContent = `Chances: Yes - ${yesChance}%, No - ${noChance}%`;
};

const playGame = () => {
  const randomNumber = Math.random() * 100;
  const isStreaming = randomNumber < yesChance ? "Yes" : "No";
  document.getElementById("result").textContent = `The pug is ${isStreaming === "Yes" ? "streaming 🐶🎥" : "not streaming 😴"} today!`;
};

const increaseYesChance = () => {
  if (yesChance < 100) {
    yesChance++;
    noChance = 100 - yesChance;
    updateChancesDisplay();
  }
};

const decreaseNoChance = () => {
  if (noChance > 0) {
    noChance--;
    yesChance = 100 - noChance;
    updateChancesDisplay();
  }
};

// Add random effects every few seconds
const applyRandomEffects = () => {
  const randomEffect = Math.random() > 0.5 ? "increase" : "decrease"; // Randomly choose an effect
  if (randomEffect === "increase" && yesChance < 100) {
    yesChance++;
    noChance = 100 - yesChance;
  } else if (randomEffect === "decrease" && yesChance > 0) {
    yesChance--;
    noChance = 100 - yesChance;
  }
  updateChancesDisplay();
};

document.getElementById("play-button").addEventListener("click", playGame);
document.getElementById("increase-yes").addEventListener("click", increaseYesChance);
document.getElementById("decrease-no").addEventListener("click", decreaseNoChance);

// Apply random effects every 5 seconds
setInterval(applyRandomEffects, 5000);

updateChancesDisplay();
