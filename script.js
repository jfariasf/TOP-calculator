const ERROR = 1;
const NORMAL = 2;
let num_btns = document.querySelectorAll("button.numeric");
let op_btns = document.querySelectorAll("button.operators");
let clear_btn = document.querySelector(".clear");
let displayText = document.querySelector("#display_text");
let backspaceBtn = document.querySelector("#backspace_btn");
let accumulator = 0;
let operation = "";
let clearable = false;
let dot = false;
let result_displayed = false;

num_btns.forEach(function(button) {
    button.addEventListener("click", (e) => {
        let num = e.target.textContent;
        if (dot === true && num ===".")
            return;
        else if(num === "." && dot === false)
            dot = true;
        result_displayed = false;
        updateDisplay(num);
        
        });
    });

op_btns.forEach(function(button) {
    button.addEventListener("click", (e) => {
        let op = e.target.textContent;
        prepareOperation(e.target.textContent);
        });
    });

clear_btn.addEventListener("click",(e) =>{
    reset(NORMAL);
})

backspaceBtn.addEventListener("click",(e) =>{
    removeLastDigit();
})

function removeLastDigit(){
    if (result_displayed === true)
        reset(NORMAL);  
    else{
        let last_digit = displayText.innerHTML.slice(-1);
        if (last_digit === ".")
            dot = false;
        displayText.innerHTML = displayText.innerHTML.slice(0,-1)
    }
}

function add(a, b){
    return a + b;
}
function substract(a, b){
    return a - b;
}
function multiply(a, b){
    return a * b;
}
function divide(a, b){
    return a / b;
}

function prepareOperation(op){
    let currentNumber = parseFloat(displayText.innerHTML);
    
    if(operation === "")
        accumulator = currentNumber;
    else
        operate(operation, accumulator, currentNumber);
    operation = (op === "=") ? "" : op;
    clearable = true;
}

function operate(operator, a, b){
    let result = 0;
    try{
        switch(operator){
            case "+":
                result = add(a, b);
                break;
            case "-":
                result = substract(a, b);
                break;
            case "x":
                result = multiply(a, b);
                break;
            case "÷":
                result = divide(a, b);
                break;

            default:
                break;
        }
        
        if(result === Infinity)
            throw "error";
    }
    catch(e){
        reset(ERROR);
        return;
    }
    clearable = true;
    result_displayed = true;
    dot=false;
    updateDisplay(result);
    accumulator = result;

}

function updateDisplay(new_text){
    if(clearable === true){
        clearDisplay();
        clearable = false;
    }
    
    let text = displayText.innerHTML;
    displayText.innerHTML = text === "0" ? text = new_text:text += new_text;
}

function reset(type){
    if (type === ERROR)
        displayText.innerHTML = "nan";
    else
        displayText.innerHTML = "0";
    accumulator = 0;
    operation = "";
    dot = false;
    clearable = true;
    result_displayed = false;
}
function clearDisplay(){
    displayText.innerHTML = "0";
}