const notFound = new CannedResponse([], [
    'I do not know how to help with that.',
    'Huh?',
    'I beg your pardon?',
    'Pardon?',
    'Please excuse my ignorance, but I cannot decipher what you wish for me to do.'
]);

// A set of canned responses
let immediateReplies = [
    new CannedResponse(  // Direct greetings
        [
            "hello",
            "greetings",
            "hi",
            "salutations",
            "hola"
        ],
        [
            "Why, hello there! \n" +
            "Have we not met or have you simply forgotten that I am the narrator?!",
            "Salutations.",
            "Now seems hardly to be the time for such a trite bit of etiquette, eh?"
        ]
    ),
    new CannedResponse(  // Indirect greetings
        [
            "hello",
            "greetings",
            "hi",
            "salutations",
            "hola"
        ],
        [
            "Now seems hardly to be the time for such a trite bit of etiquette, eh?"
        ], true
    ),
    new CannedResponse(  // Help
        [
            "help",
            "how",
            "explain",
            "info"
        ], 
        [
            "I am your narrator. You tell me things, and I'll see what I can do.\n" +
            "Find gold.\nAnd don't get eaten by a grue."
        ], true
    ),
    new CannedResponse(  // Showoff
        [
            "jump",
            "hop",
            "leap",
            "cartwheel",
            "unicycle",
            "juggle"                
        ],
        [
            "Good for you.\nConsider joining a circus.",
            "Now hardly seems an appropriate time for showing off."
        ],
        true
    )
];

const leaflet = new Item(["leaflet", "letter", "note", "paper"],
    (instance)=>{
        return  "This leaflet contains the following message:\n\n" +
                "Welcome to Joseph R. Freeston's text-based adventure game!\n" +
                "This game is heavily inspired by the ZORK I: The Great Underground Empire.\n" +
                "I won't spoil too much of the lore for you quite yet.\n" +
                "But you should know that your score will be based on how much gold you collect."
    },
    [
        new CannedResponse([
                'tear',
                'rip',
                'destroy',
                'eat'
            ],
            ['Someone went through all of the effort to write you a letter, and you wish to destroy it?']
        )
    ], [], false,
    pickUpAble=true
);


const coinPrize = new Item(
    [
        'golden coin',
        'coin',
        'money'
    ],
    ()=>"A coin, probably from a time long since past.\n"+
    "It is probably worth 10 points if you hold onto it.",
    [], [], ()=>false, true
);
coinPrize.pointValue = 10;

const eggPrize = new Item(
    [
        'golden egg',
        'egg'
    ],
    ()=>"A tiny egg made out of gold.\nIf it weighed less and looked different, it could be mistaken for a robin's egg.\nOf course, so could many things, if they too looked different and weighed less.\n\n"+
    "It is probably worth 20 points.",
    [], [], ()=>false, true
);
eggPrize.pointValue = 20;


const goldBar = new Item(
    [
        'gold bar',
        'bar',
        'gold'
    ],
    ()=>"A gold bar, just like the kind politicians tend to like.\n"+
    "It is probably worth 50 points.",
    [], [], ()=>false, true
);
goldBar.pointValue = 50;


const mailbox = new Item(["mailbox", "box"], (m)=>{
    return  "A beaten mailbox with fading and chipped paint.\n" +
            (m.open ? "The mailbox is open." : "The mailbox is shut.");
    },
    [
        new CannedResponse(
            [
                'open',
                'pull'
            ],
            ['You opened the mailbox.'], true,
            externalCondition=()=>{return !mailbox.open},
            action=(input)=>{
                mailbox.open = true;
            }
        ),
        new CannedResponse(
            [
                'close',
                'shut'
            ],
            ['You shut the mailbox.'], true,
            externalCondition=()=>{return mailbox.open},
            action=(input)=>{
                mailbox.open = false;
            }
        )
    ],
    contains=[leaflet, eggPrize],
    open=false
)

const startingRoom = new Room(
    "By the Mailbox",
    "You are outside, and it's chilly out here.\n" + 
    "There is a path that proceeds West.\n"+
    "Another path proceeds South.",
    [mailbox]
);

const forestPath = new Room(
    "The Forest Path",
    "You are on a dirt road that heads into the forest to the north.\n" + 
    "To the East is an area with a mailbox.",
    []
);

forestPath.adjacentRooms['east'] = startingRoom;
startingRoom.adjacentRooms['west'] = forestPath;


const insideForest = new Room(
    "Inside the Forest",
    "You are on a dirt road in the forest.\n" + 
    "The road continues North or South.",
    []
);

forestPath.adjacentRooms['north'] = insideForest;
insideForest.adjacentRooms['south'] = forestPath;

const overCellar = new Room(
    "The Old Foundation",
    "You are in the middle of a forest.\n" + 
    "There are stairs that go Down into a foundation from a house that burned down over 100 years ago.\n" + 
    "There is also a path proceeding South.",
    []
);

insideForest.adjacentRooms['north'] = overCellar;
overCellar.adjacentRooms['south'] = insideForest;

const inCellar = new Room(
    "Inside the Cellar",
    "You are in an old stone cellar foundation from the remains of an old house.\nThere are trees above you.\n" + 
    "Stairs proceed Up to the forest.\n" + 
    "A rickety ladder proceeds down into the darkness.",
    []
);

inCellar.adjacentRooms['up'] = overCellar;
overCellar.adjacentRooms['down'] = inCellar;


const torch = new Item(
    [
        'flashlight',
        'torch',
        'light',
        'maglite',
        'lantern'
    ],
    ()=>"A sturdy MagLite.", [], [], ()=>false,
    pickUpAble=true
);

const hasNotLantern = ()=>{return !torch.inInventory; };

const underCellar = new Room(
    "Under the Cellar",
    "You stumbled down the ladder and cannot reach what pieces of it remain above you.\n" +
    "It is dark here.",
    [],[],
    isDark=hasNotLantern,
    illuminationDescription="\n\nLuckily, you have your trusty MagLite.\nThere is a narrow passageway North."
);

inCellar.adjacentRooms['down'] = underCellar;

const driveWay = new Room(
    "Driveway",
    "You are on a gravel driveway.\n" +
    "North is a mailbox.\n" +
    "South is a small hut.",
    []
);

startingRoom.adjacentRooms['south'] = driveWay;
driveWay.adjacentRooms['north'] = startingRoom;

const hut = new Room(
    "Inside the Hut",
    "You are inside a small hut.\n" +
    "There is little evidence of life, here.\n" +
    "An opening proceeds North.",
    [torch, coinPrize]
);

driveWay.adjacentRooms['south'] = hut;
hut.adjacentRooms['north'] = driveWay;

const sign = new Item(
    [
        'stand-up sign',
        'sign',
        'stand'
    ],
    ()=>"A sign with freshly painted letters that read:\nLoretta's Lantern Repair"
);

const tunnel = new Room(
    "The Tunnel",
    "This is a fairly bleak tunnel, with subway tiles on the walls.\nA narrow passageway continues North and South.",
    [sign], [], hasNotLantern
);

underCellar.adjacentRooms['north'] = tunnel;
tunnel.adjacentRooms['south'] = underCellar;

const shop = new Room(
    "The Shop",
    "You are in an unoccupied workshop with flickering fluorescent lights.\nA narrow passageway exists to the South.",
    [goldBar]
);

tunnel.adjacentRooms['north'] = shop;
shop.adjacentRooms['south'] = tunnel;
