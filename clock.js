//var vs let? TODO
let trun_clock = {

// const
TICKS_PER_SEC: 2 ** 2,

// var

currentTicks: 0,
currentHand: null,
timeTracker: null,

// function

initialize: function () {
currentTicks = 0;
// set up current time - add incoming millisecs to this for tick counting
//     - ie it's been 59ms since last tick count:
//        => number of ticks = 59 / 4 with a remainder of 59 % 4 ms
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
