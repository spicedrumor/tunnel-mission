let trun_player = {

init : function() {
  return {
    colour          : "#00FFFF",
    blueBit         : true,
    pinkBit         : false,
    greenBit        : false,
    flashing        : false,
    flashBit        : false,
    phasing         : false,
    score           : 1,
    xPos            : 0,
    yPos            : 0,
    armour          : 0,
    alive           : true,
    hasShield       : false,
    shieldCount     : 0,
    hasPick         : false,
    pickCount       : 0,
    wielded         : "nothing",
    powerMove       : false,
    hitRecently     : 0,
    blockRecently   : 0,
    armourReduction : 0,
    addShield       : function() {
      if (!this.hasShield) this.hasShield = true;
      this.shieldCount++;
    },
    addPick         : function() {
      if (!this.hasPick) this.hasPick = true;
      this.pickCount++;
    },
    isBlue          : function() {
      return this.blueBit;
    },
    isPink          : function() {
      return this.pinkBit;
    },
    isGreen          : function() {
      return this.greenBit;
    }
  };
}

};
