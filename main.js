import "./style.css";

let displayValue = "";
let logIn = false;

function appendToDisplay(value) {
  displayValue += value;
  document.getElementById("display").value = displayValue;
}

function calculate() {
  try {
    const result = evaluateExpression(displayValue);
    document.getElementById("display").value = result;
  } catch (error) {
    document.getElementById("display").value = "Error: no se puede dividir 0/0";
  }
}

function clearDisplay() {
  displayValue = "";
  document.getElementById("display").value = displayValue;
}

function evaluateExpression(expression) {
  const operators = ["+", "-", "*", "/"];
  const numbers = [];
  const operatorsArray = [];

  let currentNumber = "";

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (!isNaN(char) || char === ".") {
      currentNumber += char;
    } else if (operators.includes(char)) {
      numbers.push(parseFloat(currentNumber));
      operatorsArray.push(char);
      currentNumber = "";
    }
  }

  numbers.push(parseFloat(currentNumber));

  let result = numbers[0];

  for (let i = 0; i < operatorsArray.length; i++) {
    const operator = operatorsArray[i];
    const nextNumber = numbers[i + 1];

    switch (operator) {
      case "+":
        result += nextNumber;
        break;
      case "-":
        result -= nextNumber;
        break;
      case "*":
        result *= nextNumber;
        break;
      case "/":
        if (nextNumber !== 0) {
          result /= nextNumber;
        } else {
          throw new Error("Division by zero");
        }
        break;
      default:
        break;
    }
  }

  return result;
}

// Escucha de eventos para los botones
const buttons = document.querySelectorAll(".botones button");

buttons.forEach((button) => {
  button.addEventListener("click", function () {
    const buttonText = this.textContent;

    if (buttonText === "=") {
      calculate();
    } else if (buttonText === "C") {
      clearDisplay();
    } else {
      appendToDisplay(buttonText);
    }
  });
});

document.body.onkeyup = function (e) {
  if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(e.key)) {
    appendToDisplay(e.key);
    console.log(e.key);
  }
};

document.getElementById('google').addEventListener('click', loginWithGoogle)

function mostrarCalculadora() {
  if (logIn) {
    document.getElementById("calculadora").style.display = "block";
    document.getElementById("login").style.display = "none";
  } else {
    document.getElementById("calculadora").style.display = "none";
    document.getElementById("login").style.display = "block";
  }
}

mostrarCalculadora();

const clientId = "417721073286-2fd800sbpi2edguhftdfjnr9capm1hst.apps.googleusercontent.com";
const redirectUri = "http://localhost:5173";
const scope = "email profile"; // Las API a las que deseas acceder
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

function loginWithGoogle() {
  window.location.href = authUrl;
}

// Luego de la redirección de Google, en tu página de redirección:

function handleGoogleResponse() {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = fragment.get("access_token");

  // Usa el token de acceso para hacer peticiones a la API de Google
  fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if(data?.error) {
        logIn = false;
        return
      }
      document.getElementById('userInfo').innerHTML = `Usuario: ${data.given_name} ${data.family_name} (${data.email})`
      logIn = true;
      mostrarCalculadora()
    })
    .catch((error) => {
      console.error("Error al obtener información del usuario:", error);
      logIn = false;
    });
}

handleGoogleResponse(); // Llamar a esta función al cargar la página para manejar la respuesta
