
const pomodoro_button = document.getElementById("btn_show_pomodoro");
const kanban_button = document.getElementById("btn_show_kanban");
const pomodoro_view = document.getElementById("view_pomodoro");
const kanban_view = document.getElementById("view_kanban");

/* NAVIGATION
   ---------- */

// To switch from kanban to pomodoro
pomodoro_button.addEventListener("click", ()=>{
    // Toggle Buttons
    pomodoro_button.setAttribute("disabled", "true");
    kanban_button.removeAttribute("disabled");

    // Toggle View
    pomodoro_view.setAttribute("style", "display:block;");
    kanban_view.setAttribute("style", "display:none;");
});

// To switch from pomodoro to kanban
kanban_button.addEventListener("click", ()=>{
    // Toggle Buttons
    kanban_button.setAttribute("disabled", "true");
    pomodoro_button.removeAttribute("disabled");

    // Toggle View
    pomodoro_view.setAttribute("style", "display:none;");
    kanban_view.setAttribute("style", "display:block;");
});


/* EDITABLE ELEMENTS
   ----------------- */

// Only allows a single element to be edited at once
let editingMode = 0;

// Throws an element of class "editable" into edit mode
function editMode(elem) {
    if(editingMode > 0) return;  // Ensure no other elem is being edited
    editingMode++;

    // Create and insert a textarea element and swap the text into it
    let textArea = document.createElement("textarea");
    textArea.id = "editing_txt";
    textArea.value = elem.innerText;
    elem.innerText = "";
    elem.appendChild(textArea);

    // Focus it so the user can start typing
    textArea.focus();

    // When the user is done
    textArea.addEventListener("focusout", ()=>{
        if(textArea.value != "") {
            elem.innerText = textArea.value;  // Put textarea value back into the div text
        } else elem.innerText = "[click to edit]";  // So there's still something to click on
        editingMode = 0;
        //elem.removeChild(textArea);
    });
}

// Register callbacks for editing kanban titles
let editables = Array.from(document.getElementsByClassName("editable"));
editables.forEach((currentValue, index, arr)=>{
    console.log(currentValue);
    currentValue.addEventListener("click", ()=>{editMode(currentValue)});
});

function build_editable(parent) {
    const child = parent.getElementsByClassName("editable")[0];

    let del = document.createElement("a");
    del.addEventListener("click", ()=>{
        parent.parentElement.removeChild(parent);
    });
    let deltxt = document.createTextNode("delete");
    del.appendChild(deltxt);
    parent.appendChild(del);

    let priority = parent.querySelector("input");
    priority.id = 100000*Math.random();
    priority.addEventListener("click", ()=>{
        // Toggle priority
        if(priority.checked) {
            parent.setAttribute("style", "background-color:red;");
        } else {
            console.log("off");
            parent.setAttribute("style", "background-color: inherit;");
        }
    });

    child.addEventListener("click", ()=>{editMode(child)});
}

let taskCardModel = document.getElementById("taskCardModel");

// Create new task
function newTaskCard(parentId) {
    const parent = document.getElementById(parentId);
    const cloned = taskCardModel.cloneNode(true);
    parent.appendChild(cloned);
    cloned.id = 10000*Math.random();
    build_editable(cloned);
}

/* DRAG 'N DROP
   ------------ */

// Moves the element into the given bucket on drop
function bucketOnDrop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    console.log(data);
    event.target.appendChild(document.getElementById(data));
}

// Makes the buckets an acceptable place to drop tasks
function bucketAllowDrop(event) {
    event.preventDefault();
}

// Sets up data transfer for drag
function taskOnDrag(event) {
    if(event.target.id == "") {
        event.target.id = 10000*Math.random();
    }
    console.log(event.target.id);
    event.dataTransfer.setData("text", event.target.id);
}

//Making sure we have return to main page button.
document.getElementById("btn_return_main").addEventListener("click", () => {
    window.location.href = "/";
});
