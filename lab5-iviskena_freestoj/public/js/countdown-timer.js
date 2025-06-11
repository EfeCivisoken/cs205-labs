const timer_disp = document.getElementById("timer");
const reset_button = document.getElementById("btn_reset");
const start_button = document.getElementById("btn_start");
const stop_button = document.getElementById("btn_stop");
const timerSelect = document.getElementById("select_timer");
const editTimeButton = document.getElementById("btn_edit_time");


let focus0_minutes = 25;
let break0_minutes = 5;
let focus1_minutes = 25;
let break1_minutes = 15;

let timer = focus0_minutes * 60;  // Default timer set to study session
let timerIntervalId = -1;
let cycleStep = 0; // Track current study/break cycle

let origTitle = document.title;

function updateTimerDisp() {
    // Calculate minutes, seconds
    let min = Math.floor(timer / 60);
    let sec = timer % 60;
    
    let sec_str = "" + sec;
    if(sec_str.length != 2) {
        sec_str = "0" + sec;
    }

    // Set the timer display text
    timer_disp.innerText = min + ":" + sec_str;

    // Set title text
    // For some reason, this only works in a real browser and not in the VSCode preview
    document.title = origTitle + " - " + min + ":" + sec_str;

    // Rotate the button just for fun :)
    let degrees_rot = -sec * 6;
    start_button.style.transform = "rotate(" + degrees_rot + "deg)";
}

function decrementTimer() {
    if (timer > 0) {
        timer--;
        updateTimerDisp();
    } else {
        stopTimer();
        switchTimerMode(); // Smoothly switch from break to studying
    }
}

// added a new function called switch 
// timer mode so that we smoothly
// switch from break to studying

function switchTimerMode() {
    cycleStep = (cycleStep + 1) % 4; // toggle smoothly between focus and break cycles thanks to modularity

    if (cycleStep === 0) {
        timer = focus0_minutes * 60;
        alert("Time to focus!");
    } else if (cycleStep === 1) {
        timer = break0_minutes * 60;
        alert("Break time!");
    } else if (cycleStep === 2) {
        timer = focus1_minutes * 60;
        alert("Time to focus!");
    } else {
        timer = break1_minutes * 60;
        alert("Break time!");
    }

    updateTimerDisp();
    startTimer();  // auto-start the next interval
}

function startTimer() {
    if (timerIntervalId === -1) { // Ensure we don't start multiple timers
        timerIntervalId = setInterval(decrementTimer, 1000);
        stop_button.removeAttribute("disabled");
        start_button.setAttribute("disabled", "true");
    }
}

function stopTimer() {
    if (timerIntervalId >= 0) clearInterval(timerIntervalId);
    timerIntervalId = -1;
    stop_button.setAttribute("disabled", "true");
    start_button.removeAttribute("disabled");
}

function resetTimer() {
    stopTimer();

    if (timerSelect) { // Ensure dropdown exists
        let selectedValue = parseInt(timerSelect.value); 

        if (!isNaN(selectedValue)) {
            timer = selectedValue * 60;
        } else {
            timer = focus0_minutes * 60; // Default to focus mode
        }
    } else {
        timer = focus0_minutes * 60; // default to focus mode as well!
    }

    updateTimerDisp();
}

// For A-level work we need to implement customizability 
// Adding a Edit-Time functionality via simple prompts to the user

function editTime() {
    // prompting does not work in LivePreview, please use browser.
    let newFocus0 = prompt("Please enter focus session 1 duration in minutes:", focus0_minutes);
    let newBreak0 = prompt("Please enter short break duration in minutes:", break0_minutes);
    let newFocus1 = prompt("Please enter focus session 2 duration in minutes:", focus1_minutes);
    let newBreak1 = prompt("Please enter long break duration in minutes:", break1_minutes);

    newFocus0 = parseInt(newFocus0);
    newBreak0 = parseInt(newBreak0);
    newFocus1 = parseInt(newFocus1);
    newBreak1 = parseInt(newBreak1);

    // we validate inputs
    if (!isNaN(newFocus0) && newFocus0 > 0) focus0_minutes = newFocus0;
    if (!isNaN(newBreak0) && newBreak0 > 0) break0_minutes = newBreak0;
    if (!isNaN(newFocus1) && newFocus1 > 0) focus1_minutes = newFocus1;
    if (!isNaN(newBreak1) && newBreak1 > 0) break1_minutes = newBreak1;

    // Ensure the timer updates immediately
    if (cycleStep === 0) {
        timer = focus0_minutes * 60;
    } else if (cycleStep === 1) {
        timer = break0_minutes * 60;
    } else if (cycleStep === 2) {
        timer = focus1_minutes * 60;
    } else {
        timer = break1_minutes * 60;
    }

    updateTimerDisp(); // Update display immediately
}


resetTimer();

// event listeners
reset_button.addEventListener("click", resetTimer);
start_button.addEventListener("click", startTimer);
stop_button.addEventListener("click", stopTimer);
editTimeButton.addEventListener("click", editTime);
if (timerSelect) {
    timerSelect.addEventListener("change", resetTimer);
}

//Making sure we have return to main page button.
document.getElementById("btn_return_main").addEventListener("click", () => {
    window.location.href = "/";
});
