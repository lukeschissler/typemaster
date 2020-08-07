let charMap = {
    "Q": { time : [],
        avg : 0 },
    "W": { time : [],
        avg : 0 },
    "E": { time : [],
        avg : 0 },
    "R": { time : [],
        avg : 0 },
    "T": { time : [],
        avg : 0 },
    "Y": { time : [],
        avg : 0 },
    "U": { time : [],
        avg : 0 },
    "I": { time : [],
        avg : 0 },
    "O": { time : [],
        avg : 0 },
    "P": { time : [],
        avg : 0 },
    "A": { time : [],
        avg : 0 },
    "S": { time : [],
        avg : 0 },
    "D": { time : [],
        avg : 0 },
    "F": { time : [],
        avg : 0 },
    "G": { time : [],
        avg : 0 },
    "H": { time : [],
        avg : 0 },
    "J": { time : [],
        avg : 0 },
    "K": { time : [],
        avg : 0 },
    "L": { time : [],
        avg : 0 },
    "Z": { time : [],
        avg : 0 },
    "X": { time : [],
        avg : 0 },
    "C": { time : [],
        avg : 0 },
    "V": { time : [],
        avg : 0 },
    "B": { time : [],
        avg : 0 },
    "N": { time : [],
        avg : 0 },
    "M": { time : [],
        avg : 0 }
};
let currDate = {
    time : new Date(),
    iter : 0,
}

let accuracy = [];

let alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z"];

function reloadFun() {
    location.reload();
}

function totalAverage() {
    let sum = [];
    for (let [key, value] of Object.entries(charMap)) {
        sum.push(...value.time);
    }
    return sum.reduce((sum, current) => sum + current, 0)/sum.length;
}

function establishGradient() {
    const keyTimings = [];
    for (let key in charMap) {
        let currAvg = charMap[key].avg;

        if (currAvg !== 0) {
            keyTimings.push(charMap[key].avg);
        }
    }
    let hiAvg = Math.max.apply(Math, keyTimings);
    let loAvg = Math.min.apply(Math, keyTimings);

    return [hiAvg, loAvg];
}

function keyAverage(k) {
    const keyArray = charMap[k].time;
    return keyArray.reduce((sum, current) => sum + current, 0)/keyArray.length;
}

function updateAverage(newAverage) {
    if (!newAverage) return;

    let averageDiv = document.querySelector('.average');

    averageDiv.innerHTML = "";

    let newDiv = `
        <span> ${Math.round(newAverage)}ms Average Time Between Keystrokes </span>
        `;
    averageDiv.insertAdjacentHTML('beforeend', newDiv);
}

function updateAccuracy() {
    let newAcc = Math.round((accuracy.reduce((sum, current) => sum + current, 0)/accuracy.length) * 100)

    let accuracyDiv = document.querySelector('.accuracy');

    accuracyDiv.innerHTML =""

    let newDiv = `
        <span> ${newAcc}% Accurate </span>
        `
    accuracyDiv.insertAdjacentHTML('beforeend', newDiv);
}

function styleAccuracy(accuracyStyle) {
    let genKey = document.querySelector('.genkey')

    genKey.classList.add(accuracyStyle)
}

function judgeKey(key, hi, lo) {
    if (charMap[key.dataset.key].time.length === 0) return;
    keyValue = key.dataset.key
    keyAvg = keyAverage(keyValue);

    scaled = Math.abs(1-(keyAvg-lo)/(hi-lo));
    if (scaled > 0.5) {
        key.style['background-color'] = `rgba(129, 178, 154, ${scaled})`
    } else {
        scaled = Math.abs((scaled * 2) - 1)
        key.style['background-color'] = `rgba(224, 122, 95, ${scaled})`
    }

    charMap[key.dataset.key].avg = keyAvg

    const newAvg = `
        <div> ${Math.round(keyAvg)}ms </div>
        `

    key.children[1].remove();
    key.children[0].insertAdjacentHTML('afterend', newAvg);
}

function genRandomText() {
    let charDiv = document.querySelector('.genkey');
    let char = alpha[Math.round(Math.random() * 26)];

    if (char === undefined) {
        genRandomText();
        return;
    }
    charDiv.innerHTML = char;

    if (!charDiv.classList.contains("begin")) {
        charDiv.classList.add("begin");
    }
}

function logKey(e) {
    if (!e.key) return;
    let k = e.key.toUpperCase();
    if (!(k in charMap)) return;


    const key = document.querySelector(`div[data-key="${k}"]`);
    key.classList.add('active');

    if (currDate.iter === 0) {
        currDate.iter = 1;
        currDate.time = new Date();

    } else {
        let currTime = new Date();
        let timeDifference = currTime - currDate.time;

        charMap[k].time.push(timeDifference);
        currDate.iter += 1;
        currDate.time = currTime;
    }

    updateAverage(totalAverage());

    let screenKey = (accuracy.length === 0) ? k : document.querySelector('.genkey').innerText;
    let currAccuracy = (k === screenKey) ? 1 : 0;
    let accuracyStyle = (currAccuracy === 1) ? "accurate" : "inaccurate";

    accuracy.push(currAccuracy);

    styleAccuracy(accuracyStyle);
    updateAccuracy();
    genRandomText();

    let values = establishGradient();
    let hi = values[0];
    let lo = values[1];

    const keys = Array.from(document.querySelectorAll('.key'));
    keys.forEach(key => judgeKey(key, hi, lo));
}

const keys = Array.from(document.querySelectorAll('.key'));
const genkey = document.querySelector('.genkey')

genkey.addEventListener('transitionend', function() {this.classList.remove('accurate', 'inaccurate') })
keys.forEach(key => key.addEventListener('transitionend', function() {this.classList.remove('active')}));

window.addEventListener('keydown', logKey);
