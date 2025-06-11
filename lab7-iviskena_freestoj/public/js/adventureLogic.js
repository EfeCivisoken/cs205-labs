const inspectionKeywords = [   // Item/room inspection keywords
    "observe",
    "see",
    "look",
    "around",
    "where",
    "what",
    "check",
    "smell",
    "touch",
    "feel",
    "inspect",
    "read"
];

const inventoryKeywords = [
    "inventory",
    "bag",
    "holding",
    "sack",
    "pack",
    "have",
    "pocket",
    "possess"
];

const moveKeywords = [
    "move",
    "go",
    "walk",
    "run",
    "locomote",
    "translate",
    "moonwalk",
    "enter",
    "step",
    "proceed",
    "crawl",
    "climb",
    "ascend",
    "descend",
    "slide"
];

const getKeywords = [
    "get",
    "pick",
    "grab",
    "obtain",
    "grasp",
    "catch",
    "pull",
    "get",
    "snatch",
    "ascertain"
];

const dropKeywords = [
    "drop",
    "throw",
    "release",
    "free",
    "relinquish",
    "surrender",
    "give",
    "put",
    "chuck",
    "abandon"
];

class CannedResponse {
    constructor(inputs, outputs, partialMatch=false, externalCondition=()=>true, action=(input)=>{}) {
        this.inputs = inputs;
        this.outputs = outputs;
        this.partialMatch = partialMatch;
        this.externalCondition = externalCondition;
        this.action = action;
    }

    // Randomly chooses an appropriate output
    chooseOut() {
        const randChoice = Math.trunc(
            Math.random() * this.outputs.length
        );
        return this.outputs[randChoice];
    }

    // Specify an input.
    // Returns null if not applicable, else a string response
    handle(input) {
        if(!this.externalCondition()) return null;
        if(this.inputs.includes(input)) {
            this.action(input);
            return this.chooseOut();
        }
        if(!this.partialMatch) return null;

        // Otherwise, try a partial match...
        for(const element of this.inputs) {
            if(input.includes(element)) {
                this.action(input);
                return this.chooseOut(); 
            }
        }
        return null;
    }

    // returns value of handle for first matching in list of CannedResponses
    static handleFirst(cannedResponses, input) {
        for(let i = 0; i < cannedResponses.length; i++) {
            console.log(cannedResponses[i]);
            const val = cannedResponses[i].handle(input);
            console.log(val);
            if(val !== null) return val;
        }
        return null;
    }

}

class CondResponse {
    constructor(inputs, output_callable, partialMatch=false, externalCondition=()=>true, action=(input)=>{}) {
        this.inputs = inputs;
        this.output_callable = output_callable;
        this.partialMatch = partialMatch;
        this.externalCondition = externalCondition;
        this.action = action;
    }

    getOutput(input) {
        return this.output_callable(input);
    }

    // Specify an input.
    // Returns null if not applicable, else a string response
    handle(input) {
        if(!this.externalCondition()) return null;
        if(this.inputs.includes(input)) {
            this.action(input);
            return this.getOutput(input);
        }
        if(!this.partialMatch) return null;

        // Otherwise, try a partial match...
        for(const element of this.inputs) {
            if(input.includes(element)) {
                this.action(input);
                return this.getOutput(input); 
            }
        }
        return null;
    }
}

class Item {
    constructor(names, description=(instance)=>'', responses=[], contains=[], open=true, pickUpAble=false) {
        this.name = names[0];
        this.names = names;
        this.open=open;
        this.pickUpAble = pickUpAble;
        this.inInventory = false;
        this.description = description;
        this.responses = responses.concat([
            new CondResponse(  // Allow inspection of all items
                inspectionKeywords,
                (input)=>{
                    return this.inspect();
                },
                true
            )
        ]);
        this.contents = contains;
    }

    act(input) {
        console.log('Acting on ' + this.name + ': ' + input);
        return CannedResponse.handleFirst(this.responses, input);
    }

    // Returns a string listing contents
    inspect() {
        let contents_info = "";
        if(this.open) {
            contents_info = (this.contents) ? "\n\n" : "";
            this.contents.forEach(element => {
                contents_info = contents_info + 'There is a ' + element.name + ' inside.\n';
            });    
        }
        return (this.name + ":\n" + "~~~\n"+
        this.description(this) +
        contents_info);
    }
}

class Room {
    constructor(name, description, initItems, responses=[], isDark=()=>false, illuminationDescription="") {
        this.name = name;
        this.adjacentRooms = {};
        this.description = description;
        this.items = initItems;

        this.isDark = isDark;
        this.illuminationDescription = illuminationDescription;

        this.responses = responses.concat(new CondResponse(
            inspectionKeywords,
            ()=>{  // Generate room description
                let contents_info = "";
                if(!this.isDark()) {
                    contents_info = this.items ? "\n\n" : "";
                    this.items.forEach(element => {
                        contents_info = contents_info + 'There is a ' + element.name + ' here.\n';
                    });
                    contents_info = this.illuminationDescription + contents_info;
                }

                return (this.name + ":\n" + "~~~\n"+
                description +
                contents_info);
            }, true
        ));
    }

    respond(input) {
        let resp = null;
        // Item-specific responses
        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i].names.some(r=> input.includes(r))) {
                resp = this.items[i].act(input);
                break;
            }
        }

        // Room-specific responses
        if(resp === null)
            resp = CannedResponse.handleFirst(this.responses, input);

        if(resp === null) return null;
        return [this, resp];
    }
}
