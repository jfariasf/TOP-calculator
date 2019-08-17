const ERROR = 1;
const NORMAL = 2;
const ADD = "+";
const SUB = "-";
const MUL = "x";
const DIV = "÷";
const EQU = "=";
const DOT = ".";
const FAILMSG = "NaN";

const operators = [ADD, SUB, MUL, DIV, EQU, EQU];
const nonkeypad_operation_keys = [61, 173, 56, 191];
const keypad_operation_keys = [107, 109, 106, 111, 13];
const numeric_keys = [48, 57, 96, 105]; //, 61, 13
const dot_keycodes = [110, 190];

let num_btns = document.querySelectorAll("button.numeric");
let op_btns = document.querySelectorAll("button.operators");
let clear_btn = document.querySelector(".clear");
let displayText = document.querySelector("#display_text");
let backspaceBtn = document.querySelector("#backspace_btn");
let accumulator = 0;
let pendingOperation = "";
let clearable = false;
let dotFlag = false;
let result_displayed = false;

num_btns.forEach(function(button) {
    button.addEventListener("click", (e) => {
        addNumericInput(e.target.textContent);
        });
    });

op_btns.forEach(function(button) {
    button.addEventListener("click", (e) => {
        prepareOperation(e.target.textContent);
        });
    });

clear_btn.addEventListener("click",(e) =>{
    reset(NORMAL);
})

backspaceBtn.addEventListener("click",(e) =>{
    removeLastDigit();
})

let body = document.querySelector("body");
    
body.addEventListener("keyup",function(e){
    document.querySelector("#hidden").focus();
    let key = parseInt(e.which);
    let number = 0;
    
    if (between(key, numeric_keys[0], numeric_keys[1]) && !e.shiftKey){ //numeric
        number = key-numeric_keys[0];
        
        addNumericInput(number);
    }
    else if (between(key, numeric_keys[2], numeric_keys[3]) && !e.shiftKey){ // numeric keypad
        number = key-numeric_keys[2];
        addNumericInput(number);
    }
    else if(dot_keycodes.includes(key)){ // check for dot
        addNumericInput(DOT);
    }
    else if(keypad_operation_keys.includes(key) && !e.shiftKey){ //operations on keypad
        prepareOperation(operators[keypad_operation_keys.indexOf(key)]);
    }
    else if(nonkeypad_operation_keys.includes(key) || e.shiftKey){ //operation on non keypad
        prepareOperation(operators[nonkeypad_operation_keys.indexOf(key)]);
    }

});
function addNumericInput(num){
    if (dotFlag === true && num ===".")
    return;
    else if(num === "." && dotFlag === false)
        dotFlag = true;
    result_displayed = false;
    updateDisplay(num);
}

function between(x, min, max) { 
    return x >= min && x <= max;
  }
function removeLastDigit(){
    if (result_displayed === true)
        reset(NORMAL);  
    else{
        let last_digit = displayText.innerHTML.slice(-1);
        if (last_digit === ".")
            dotFlag = false;
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
    
    if(pendingOperation === "")
        accumulator = currentNumber;
    else
        operate(pendingOperation, accumulator, currentNumber);
    pendingOperation = (op === EQU) ? "" : op;
    clearable = true;
    dotFlag = false;
}

function operate(operator, a, b){
    let result = 0;
    try{
        switch(operator){
            case ADD:
                result = add(a, b);
                break;
            case SUB:
                result = substract(a, b);
                break;
            case MUL:
                result = multiply(a, b);
                break;
            case DIV:
                result = divide(a, b);
                break;

            default:
                break;
        }
        if(result === Infinity)
            throw ERROR;
    }
    catch(e){
        reset(e);
        return;
    }
    clearable = true;
    result_displayed = true;
    updateDisplay(result);
    accumulator = result;
}

function updateDisplay(new_text){
    if(clearable === true){
        clearDisplay();
        clearable = false;
    }
    let text = displayText.innerHTML;
    if(text.length < 21)
        displayText.innerHTML = text === "0" ? text = new_text:text += new_text;
}

function reset(type){
    if (type === ERROR)
        displayText.innerHTML = FAILMSG;
    else
        displayText.innerHTML = "0";
    accumulator = 0;
    pendingOperation = "";
    clearable = true;
    result_displayed = false;
    dotFlag = false;
}
function clearDisplay(){
    displayText.innerHTML = "0";
}