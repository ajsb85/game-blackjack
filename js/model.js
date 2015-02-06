"use strict"

var CardsModel = function() {
  this.value = [];
  this.symbol = [];
  this.addCard = function(aValue, aSymbol) {
    this.value.push(aValue);
    this.symbol.push(aSymbol);
  };
}

var ScoreModel = function() {
  this.value = null;
  this.stand = false;
  this.updateScore = function(aValue) {
    this.value = aValue;
  };
  this.updateStatus = function(aValue) {
    this.stand = aValue;
  };
}

var BuddyModel = function(aUserName) {
  this.twitter = aUserName;
  this.cards = new CardsModel();
  this.score = new ScoreModel();
  this.game
};

var GameModel = function() {
  this._deck = new Array(52);
  this.init = function() {
    var suites = ['♣', '♦', '♥', '♠'];
    var ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 't', 'j', 'q', 'k', 'a'];
    for (var i = 0; i < ranks.length; ++i) {
      for (var j = 0; j < suites.length; ++j) {
        this._deck[i*suites.length + j] = ranks[i] + suites[j];
      }
    }
    for (var i = 0; i < this._deck.length; ++i) {
      var r = i + Math.floor(Math.random() * (52 - i));
      var temp = this._deck[i];
      this._deck[i] = this._deck[r];
      this._deck[r] = temp;
    }
  };
  this._buddies = new Map();
  this.addBuddy = function(aUserName) {
    var buddy = new BuddyModel(aUserName);
    this._buddies.set(aUserName, buddy);
  };
  this.removeBuddy = function(aUserName) {
    this._buddies.delete(aUserName);
  };
  this.getBuddy = function(aUserName) {
    return this._buddies.get(aUserName);
  };
  this.getBuddies = function(aUserName) {
    return this._buddies;
  };
  this.hit = function(aUserName) {
    var buddy = this.getBuddy(aUserName);
    var card = this._deck.shift();
    buddy.cards.addCard(card.substring(0, 1), card.substring(1));
  };
  this.latest = function() {
    return this._buddies.get(aUserName);
  };
  this.scoreCards = function(aUserName) {
    var buddy = this.getBuddy(aUserName);
    var scoreRanks = new Array();
    scoreRanks['2'] = 2;
    scoreRanks['3'] = 3;
    scoreRanks['4'] = 4;
    scoreRanks['5'] = 5;
    scoreRanks['6'] = 6;
    scoreRanks['7'] = 7;
    scoreRanks['8'] = 8;
    scoreRanks['9'] = 9;
    scoreRanks['t'] = 10;
    scoreRanks['j'] = 10;
    scoreRanks['q'] = 10;
    scoreRanks['k'] = 10;
    scoreRanks['a'] = 11;
    var score = 0;
    var aces = 0;
    for (var i = 0; i < buddy.cards.value.length; ++i) {
      var card = buddy.cards.value[i];
      var card_val = scoreRanks[card];
      if (card_val == 11)
          aces++;
      score += card_val;
    }
    while (score > 21 && aces-- > 0)
      score -= 10;
    return score;
  };
};