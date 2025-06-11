const term_out = document.getElementById("text-output");
const term_in  = document.getElementById("text-input");

function updateOutput() {
    term_out.value = buffer + term_in.value;
    term_out.scrollTop = term_out.scrollHeight;
}

term_in.focus();

let cur_room = startingRoom;
let buffer = startingRoom.respond('look around')[1] + '\n\n>>> ';
updateOutput();

// Inventory management:
let inventory = [];
immediateReplies = immediateReplies.concat(
    new CondResponse(inventoryKeywords, (input)=>{  // SHOW INVENTORY
        let inventory_str = "";
        inventory.forEach(element => {
            inventory_str = inventory_str.concat(
                '- ' + element.name + '\n'
            );
        });
        return "Current Possessions\n~~~\n" + ((inventory_str.length>0) ? inventory_str : "Nothing but empty pockets.");
    }, true),
    new CondResponse(getKeywords, (input)=>{  // ADD TO INVENTORY
        console.log("GRABBING ITEM");
        let item = null;
        cur_room.items.forEach(roomItem => {  // Linear search for item
            roomItem.names.forEach(itemName => {
                if(input.includes(itemName)) {
                    if(roomItem.pickUpAble)
                        item = roomItem;
                };
            });
        });
        if(item == null) {  // Search inside open items if not found in room
            cur_room.items.forEach(roomItem => {  // Linear search for item
                if(roomItem.open === false) return;  // Don't take from inside closed item
                roomItem.contents.forEach(subItem => {
                    subItem.names.forEach(itemName => {
                        if(input.includes(itemName)) {
                            if(subItem.pickUpAble)
                                item = subItem;
                        };
                    });

                    if(subItem.open === false) return;

                    // Can only nest an item in an item in an item.
                    subItem.contents.forEach(subSubItem => {
                        subSubItem.names.forEach(itemName => {
                            if(input.includes(itemName)) {
                                if(subSubItem.pickUpAble)
                                    item = subSubItem;
                            };
                        });
                    });

                });
            });
        }
        if(item == null) return "I cannot find such a thing that you can pick up.";
        // Move item from room to inventory
        inventory = inventory.concat(item);
        item.inInventory = true;
        // Take out of room, subitems, subSubitems
        cur_room.items = cur_room.items.filter(thing=>thing.name!==item.name);
        cur_room.items.forEach(roomItem => {
            roomItem.contents = roomItem.contents.filter(thing=>thing.name!==item.name);
            roomItem.contents.forEach(subItem => {
                subItem.contents = subItem.contents.filter(thing=>thing.name!==item.name);
            });
        });
        return "You picked up the " + item.name;
    }, true),
    new CondResponse(inspectionKeywords,  // INSPECT INVENTORY
        (input)=>{
            let item = null;
            inventory.forEach(iItem => {
                iItem.names.forEach(name=>{
                    if(input.includes(name)) item = iItem;
                    return;
                });
            });

            if(item == null) return null;

            console.log('INSPECTING' + item.name);
            return item.inspect();
        }, true
    ),
    new CondResponse(dropKeywords,  // DROP INVENTORY
        (input)=>{
            let item = null;
            inventory.forEach(iItem => {
                iItem.names.forEach(name=>{
                    if(input.includes(name)) item = iItem;
                    return;
                });
            });

            if(item == null) return "Drop what item?";

            console.log('DROPPING' + item.name);
            item.inInventory = false;
            cur_room.items = cur_room.items.concat(item);
            inventory = inventory.filter(iItem => iItem.name !== item.name);
            return "Dropped " + item.name;
        }, true
    )
);

// Motion Management
immediateReplies = immediateReplies.concat(
    new CondResponse(["north"], (input)=>{
        if(cur_room.isDark()) return "You cannot see. You'll probably get hurt if you try to move.";
        if("north" in cur_room.adjacentRooms) {
            cur_room = cur_room.adjacentRooms["north"];
            return cur_room.respond('look around')[1];
        } else return "You can't go north from here.";
    }, true),
    new CondResponse(["south"], (input)=>{
        if(cur_room.isDark()) return "You cannot see. You'll probably get hurt if you try to move.";
        if("south" in cur_room.adjacentRooms) {
            cur_room = cur_room.adjacentRooms["south"];
            return cur_room.respond('look around')[1];
        } else return "You can't go south from here.";
    }, true),
    new CondResponse(["east"], (input)=>{
        if(cur_room.isDark()) return "You cannot see. You'll probably get hurt if you try to move.";
        if("east" in cur_room.adjacentRooms) {
            cur_room = cur_room.adjacentRooms["east"];
            return cur_room.respond('look around')[1];
        } else return "You can't go east from here.";
    }, true),
    new CondResponse(["west"], (input)=>{
        if(cur_room.isDark()) return "You cannot see. You'll probably get hurt if you try to move.";
        if("west" in cur_room.adjacentRooms) {
            cur_room = cur_room.adjacentRooms["west"];
            return cur_room.respond('look around')[1];
        } else return "You can't go west from here.";
    }, true),
    new CondResponse(["up"], (input)=>{
        if(cur_room.isDark()) return "You cannot see. You'll probably get hurt if you try to move.";
        let includesLocomotion = false;  // Ensure we're talking about locomotion for short words that could be substrings
        moveKeywords.forEach(word => {
            if(input.includes(word)) includesLocomotion = true;
        });
        if(includesLocomotion === false) return null;

        if("up" in cur_room.adjacentRooms) {
            cur_room = cur_room.adjacentRooms["up"];
            return cur_room.respond('look around')[1];
        } else return "You can't go up here.";
    }, true),
    new CondResponse(["down"], (input)=>{
        if(cur_room.isDark()) return "You cannot see. You'll probably get hurt if you try to move.";
        let includesLocomotion = false;  // Ensure we're talking about locomotion for short words that could be substrings
        moveKeywords.forEach(word => {
            if(input.includes(word)) includesLocomotion = true;
        });
        if(includesLocomotion === false) return null;

        if("down" in cur_room.adjacentRooms) {
            cur_room = cur_room.adjacentRooms["down"];
            return cur_room.respond('look around')[1];
        } else return "You can't go down here.";
    }, true)
);

term_in.addEventListener('keyup', (ev) => {
    updateOutput();
});

term_in.addEventListener('keydown', (ev) => {
    if(ev.key === 'Enter') {
        buffer += term_in.value;
        let input = term_in.value;
        input = input.toLowerCase().replace(/[^a-zA-Z ]/g, "").trim();
        if(input != "") {
            // Game Logic / processing

            // Global responses
            let response = CannedResponse.handleFirst(immediateReplies, input);

            if(response === null) {
                // Room-dependent Responses
                let room_resp = cur_room.respond(input);
                if(room_resp != null) {
                    cur_room = room_resp[0];
                    response = room_resp[1]
                }
            }

            // The "Pardon?" response
            if(response == null) response = notFound.chooseOut();


            // Output response
            buffer += '\n';
            buffer += response;
        }
        
        // Prompt
        buffer += '\n\n>>> ';
        term_in.value = "";

        updateOutput();
    }
});


function cashIn() {
    let points = 0;
    inventory.forEach(item => {
        if('pointValue' in item)
            points += item.pointValue;
    });

    alert("You earned " + points + " points!");

    // Prompt for username and email 
    let username = prompt("Enter your username:");
    let email = prompt("Enter your email:");
    
    // Send the game data to the server using a POST request to /submitGame
    fetch('/submitGame', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        game_definition_id: 7,
        username: username,
        email: email,
        score: points,
        outcome: "Ended in room \""+cur_room.name+"\"",
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Game data submitted:', data);
    })
    .catch(error => {
      console.error('Error submitting game data:', error);
    });

    window.location.reload();
}
