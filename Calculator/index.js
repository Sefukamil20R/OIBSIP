const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let currentInput = '';

function updateDisplay(value) {
    display.value = value;
}
function calculateResult() {
    try {
        let result = eval(currentInput.replace('&', '&&'));
        updateDisplay(result);
        currentInput = result.toString(); 
    } catch (error) {
        updateDisplay('Error');
        currentInput = ''; 
    }
}

function deleteLastCharacter() {
    currentInput = currentInput.slice(0, -1); 
    updateDisplay(currentInput || ''); 
}

function clearDisplay() {
    currentInput = ''; 
    updateDisplay(''); 
}

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        const value = e.target.value;

        if (value === '=') {
            calculateResult();
        } else if (e.target.classList.contains('del')) {
            deleteLastCharacter();
        } else if (e.target.classList.contains('clear')) {
            clearDisplay();
        } else if (e.target.classList.contains('negative')) {
            if (currentInput) {
                currentInput = currentInput.charAt(0) === '-' ? currentInput.slice(1) : '-' + currentInput;
                updateDisplay(currentInput);
            }
        } else {
            currentInput += value;
            updateDisplay(currentInput);
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        calculateResult();
    }
});
