import './style.css'

let displayValue = "";

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
  const operators = ['+', '-', '*', '/'];
  const numbers = [];
  const operatorsArray = [];
  
  let currentNumber = "";
  
  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    
    if (!isNaN(char) || char === '.') {
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
      case '+':
        result += nextNumber;
        break;
      case '-':
        result -= nextNumber;
        break;
      case '*':
        result *= nextNumber;
        break;
      case '/':
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

buttons.forEach(button => {
  button.addEventListener("click", function() {
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
