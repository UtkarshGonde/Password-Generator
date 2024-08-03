const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-length]");
const passwordDisplay = document.querySelector("[data-displayPassword]");
const copyMsg = document.querySelector("[data-copiedMsg]");
const copyButton = document.querySelector("[data-copyButton]");
const indicator = document.querySelector("[data-indicator]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const number = document.querySelector("#number");
const symbolcheck = document.querySelector("#symbol");
const generateBtn = document.querySelector(".generateButton");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbol = "'!@#$%^&*()_+}{[]:;|\,<.>?/~`'";

let password = "";
let passLength = 10;
let checkCount = 0;
handleSlider();
// set strenght circke color to grey
setIndicator("#ccc");

// set password lenght to 10 bydefault
function handleSlider() {
    inputSlider.value = passLength;  
    lengthDisplay.innerText = passLength;   
    const min = inputSlider.min;
    const max = inputSlider.max;

    const value = ((passLength - min) * 100) / (max - min);
    inputSlider.style.backgroundSize = `${value}% 100%`; 

    //inputSlider.style.backgroundSize( (passLength - min )*10/(max-min))+ "%100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor= color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
   
}

function getrndInteger(min , max) {
    return Math.floor(Math.random() * (max-min)) + min ;
}

function generateRandomNumber() {
    return getrndInteger(0,9).toString();
}

function generateLowerCase() {
    return String.fromCharCode(getrndInteger(97,123));
}

function generateUppererCase() {
    return String.fromCharCode(getrndInteger(65,91));
}

function genearteSymbols() {
    let ranInt = getrndInteger(0, symbol.length);
    return symbol.charAt(ranInt);
}

function calStrength() {
    let hasUpper = uppercase.checked;
    let hasLower = lowercase.checked;
    let hasNumber = number.checked;
    let hasSymbol = symbolcheck.checked;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passLength >= 8) {
        setIndicator("#0F0");
    } else if (hasUpper && hasLower && (hasNumber || hasSymbol) && passLength >= 6) {
        setIndicator("#FF0");
    } else {
        setIndicator("#F00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText= "copied";
    }
    catch(e) {
        copyMsg.innerText="Failed";
    }

    //to make msg visible
    copyMsg.classList.add("active");

    console.log("copied sussec");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

    console.log("Remove successfully");
}


function handleCheckboxChange() {
    checkCount= 0;
    allCheckbox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    })

    if(passLength < checkCount){
        passLength = checkCount;
        handleSlider();
    }
}

function shufflePassword(array) {
    // Fisher Yates Methode

    for( let i =array.length-1 ; i > 0 ; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i]=array[j];
        array[j]=temp;
    }

    let str= "";
    array.forEach((el) => (str += el));
    return str;
}

allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckboxChange);
});

inputSlider.addEventListener('input', (e) => {
    passLength = e.target.value;
    handleSlider();
});

copyButton.addEventListener('click',() => {
    if(passwordDisplay.value)
        copyContent();
});

// Generate password 

generateBtn.addEventListener('click', () => {

    //non of the checkbox is selected
    if(checkCount == 0) return;

    if(passLength < checkCount) {
        passLength = checkCount;
        handleSlider();
    }

     // start to geenarte the password

     // step 1: remove old password
     password= "";

     //step 2: lets put the stuff mention by checkbox.
     let funArray = [];

     if(uppercase.checked)
        funArray.push(generateUppererCase);

     if(lowercase.checked)
        funArray.push(generateLowerCase);

     if(number.checked)
        funArray.push(generateRandomNumber);

     if(symbolcheck.checked)
        funArray.push(genearteSymbols);

     //cumpolsury addtion ti passwor
     for(let i = 0 ; i < funArray.length ; i++) {
        password += funArray[i]();
     }

     //select the remaing password from funArry

     for(let i = 0; i < passLength - funArray.length ; i++) {
        let ranIndex = getrndInteger(0, funArray.length);
        password += funArray[ranIndex]();
     }

     //shuffel password 
     password = shufflePassword(Array.from(password));

     //show password on screem
     passwordDisplay.value = password;

     // CALCULATE STRENGTH  
     calStrength();

});