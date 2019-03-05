//var vs let? TODO
let trun_clock = {

// const
TICKS_PER_SEC: Math.pow(2, 2),

// var

currentTicks: 0,
currentHand: null,
timeTracker: null,

// function

initialize: function () {
currentTicks = 0;
timeTracker = new Date();
},

clear: function () {
currentHand = null;
},

insertHand: function (task, ticks) {
let newHand = {};
newHand.task = task;
newHand.ticks = ticks;
newHand.nextHand = null;
//insert newHand
},

pause: function () {
},

unpause: function () {
}

} //trun_clock
