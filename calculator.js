document.querySelector("[name=elso-szam]").value = 0;
document.querySelector("[name=masodik-szam]").value = 0;

function readInput() {
    return [document.querySelector("[name=elso-szam]").value, document.querySelector("[name=masodik-szam]").value];
}

function validateStringInput(firstInputString, secondInputString) {
    let errorMessage = "";

    if (firstInputString === "") {
        errorMessage += "Add meg az első számot. ";
    }
    if (secondInputString === "") {
        errorMessage += "Add meg a második számot. ";
    }

    return errorMessage;
}

function calculateResult(firstInputString, secondInputString, operationFunction) {
    let firstNumber = Number(firstInputString);
    let secondNumber = Number(secondInputString);
    return operationFunction(firstNumber, secondNumber);
}

function validateResult(firstInputString, secondInputString, operationFunction) {
    let result = calculateResult(firstInputString, secondInputString, operationFunction);
    if (Number.isNaN(result)) {
        return "Az eredmény nem értelmezhető. ";
    }
    return "";
}

function validate(firstInputString, secondInputString, operationFunction) {
    let errorMessage =
        validateStringInput(firstInputString, secondInputString) +
        validateResult(firstInputString, secondInputString, operationFunction);

    return {
        isValid: errorMessage.length === 0,
        errorMessage,
    };
}

let history = [];

function updateHistory(value) {
    history = [value, ...history];
}

function renderHistory() {
    const historyAlerts = history
        .map(
            (x, i) => `
            <div class="alert alert-dark d-flex align-items-center justify-content-between" role="alert">
                ${x} 
                <a href="#" data-index="${i}" class="btn btn-outline-secondary ms-3">
                    <img src="./images/trash.svg" alt="Delete" data-index="${i}" />
                </a>
            </div>
        `
        )
        .join("");

    const historyContent = `
        <h2>Előzmények</h2>
        ${historyAlerts}
    `;

    document.querySelector(".js-history-container").innerHTML = historyContent;
}

function historyClicked(event) {
    let currentIndex = event.target.dataset.index;
    if (typeof currentIndex !== "undefined") {
        history.splice(currentIndex, 1);
        renderHistory();
    }
}

document.querySelector(".js-history-container").addEventListener("click", historyClicked);

function displayResult(operationSymbol, operationFunction) {
    let [firstInputString, secondInputString] = readInput();
    let { isValid, errorMessage } = validate(firstInputString, secondInputString, operationFunction);
    let innerTextValue = "";

    if (isValid) {
        let result = calculateResult(firstInputString, secondInputString, operationFunction);
        let innerTextContent = `${firstInputString} ${operationSymbol} ${secondInputString} = ${result}`;
        innerTextValue = `
        <div class="alert alert-success" role="alert">
            ${innerTextContent}
        </div>
        `;
        updateHistory(innerTextContent);
        renderHistory();
    } else {
        innerTextValue = `
            <div class="alert alert-danger" role="alert">
                ${errorMessage}
            </div>        
        `;
    }

    document.querySelector(".js-container").innerHTML = innerTextValue;
}

let displaySum = () => displayResult("+", (a, b) => a + b);
let displayDiff = () => displayResult("-", (a, b) => a - b);
let displayProd = () => displayResult("*", (a, b) => a * b);
let displayQuot = () => displayResult("/", (a, b) => a / b);
let displayMod = () => displayResult("%", (a, b) => a % b);

document.querySelector(".js-plus").addEventListener("click", displaySum);
document.querySelector(".js-minus").addEventListener("click", displayDiff);
document.querySelector(".js-times").addEventListener("click", displayProd);
document.querySelector(".js-division").addEventListener("click", displayQuot);
document.querySelector(".js-modulus").addEventListener("click", displayMod);

function formSubmitted(event) {
    event.preventDefault();
}

document.querySelector(".js-form").addEventListener("submit", formSubmitted);
