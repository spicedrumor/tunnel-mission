var tmiss_sound = {

HIT_SOUND_FILENAME: "res/augh.wav",
DEATH_SOUND_FILENAME: "res/death.wav",
WIN_SOUND_FILENAME: "res/woohoo.wav",
EAT_SOUND_FILENAME: "res/omnom.wav",
EXPLODE_SOUND_FILENAME: "res/explosion.wav",
MAGIC_SOUND_FILENAME: "res/whoosh.wav",

hit: function(){
    new Audio(this.HIT_SOUND_FILENAME).play();
},
death: function(){
    new Audio(this.DEATH_SOUND_FILENAME).play();
},
win: function(){
    new Audio(this.WIN_SOUND_FILENAME).play();
},
eat: function(){
    new Audio(this.EAT_SOUND_FILENAME).play();
},
explode: function(){
    new Audio(this.EXPLODE_SOUND_FILENAME).play();
},
magic: function(){
    new Audio(this.MAGIC_SOUND_FILENAME).play();
}

}
