"use strict"

var SettingsView = function() {
  this.swipe = null;
  this.handlers = ['ajsb85', 'ghostbar', 'sultansaidov', 'Ben_Slater12', 'scottandthesea'];
  this.init = function() {
    document.querySelector('.overlay').style.display = "block";
    document.getElementById('dealer').style.display = "block";
    var elem = document.getElementById('board');
    this.swipe = new Swipe(elem, {
      continuous: false,
      transitionEnd: (function(index, element) {
        this.validate(index);
      }).bind(this)
    });
    document.querySelector('.left').onclick = (function (){
      this.swipe.prev();
    }).bind(this);
    document.querySelector('.right').onclick = (function (){
      this.swipe.next();
    }).bind(this);
  };
  this.hide = function(){
    document.querySelector('.overlay').style.display = "none";
    document.getElementById('dealer').style.display = "none";
  };
  this.validate = function(index) {
    var playersNumber = document.getElementById('input-number-def').value;
    if(index==1){
      if(playersNumber<1 || playersNumber>15){
        dealer.notify("How many players?");
        this.swipe.slide(0, 100);
        document.getElementById('input-number-def').value = 0;
      }
      var handlersDiv = document.getElementById('handlers');
      handlersDiv.innerHTML = '';
      for (var i = 0; i < playersNumber; ++i){
        var playerHandler = document.createElement('player-handler');
        playerHandler.setAttribute("player", this.handlers[i]);
        handlersDiv.appendChild(playerHandler);
      }
    }
  };
}

var BoardView = function() {
  this.show = function(aBuddy) {
    var fanOut = document.getElementById('fan-out');
    fanOut.innerHTML = '';
    for (var i = 0; i < aBuddy.cards.value.length; ++i) {
      var bigCard = document.createElement('big-card');
      var aValue = aBuddy.cards.value[i];
      var aSymbol = aBuddy.cards.symbol[i];
      bigCard.setAttribute("value", aValue.toUpperCase());
      bigCard.setAttribute("symbol", aSymbol);
      if (aSymbol == '♦'|| aSymbol == '♥')
      bigCard.setAttribute("color", "red");
      if (aSymbol == '♠'|| aSymbol == '♣')
      bigCard.setAttribute("color", "black");
      fanOut.appendChild(bigCard);
    }
    document.querySelector('.overlay').style.display = "block";
    document.getElementById('fan-out').style.display = "block";
    document.getElementById('fan-board').style.display = "block";
    document.querySelector('.hit').style.display = "block";
    document.querySelector('.stand').style.display = "block";
    document.querySelector('.close').style.display = "none";
    setTimeout(function(){
      document.querySelector('#fan-out').classList.toggle('active');
    }, 100);
    this.active();
  };
  this.active = function() {
    document.querySelector('#fan-out big-card:last-of-type').onclick = function (){
      document.querySelector('#fan-out').classList.toggle('active');
    }
  };
  this.hide = function() {
    document.querySelector('.overlay').style.display = "none";
    var fanOut = document.getElementById('fan-out');
    document.getElementById('fan-board').style.display = "none";
    if(fanOut.classList.contains("active"))
      fanOut.classList.remove("active");
    fanOut.style.display = "none";
  };
  this.addCard = function(aBuddy) {
    var fanOut = document.getElementById('fan-out');
    var bigCard = document.createElement('big-card');
    var aValue = aBuddy.cards.value[aBuddy.cards.value.length-1];
    var aSymbol = aBuddy.cards.symbol[aBuddy.cards.symbol.length-1];
    bigCard.setAttribute("value",aValue.toUpperCase());
    bigCard.setAttribute("symbol", aSymbol);
    if (aSymbol == '♦'|| aSymbol == '♥')
    bigCard.setAttribute("color", "red");
    if (aSymbol == '♠'|| aSymbol == '♣')
    bigCard.setAttribute("color", "black");
    fanOut.appendChild(bigCard);
    var player = document.querySelector('table-cards[player='+aBuddy.twitter+']'); 
    player.setAttribute("cards", aBuddy.cards.value.length);
    this.active();
    document.querySelector('.hit').style.display = "none";
    document.querySelector('.stand').style.display = "none";
    document.querySelector('.close').style.display = "block";
  };
}

var DealerView = function() {
  this.lastMsg = "I'm the dealer.";
  this.permission = function() {
    if (!Notification) {
      alert('Notifications are supported in modern versions of Chrome, Opera and Firefox.'); 
      return;
    }
    if (Notification.permission !== "granted")
      Notification.requestPermission();
  };
  this.notify = function(aMsg) {
    if (!Notification) {
      alert('Notifications are supported in modern versions of Chrome, Opera and Firefox.'); 
      return;
    }
    if (Notification.permission !== "granted")
      Notification.requestPermission();

    var notification = new Notification('Croupier', {
      icon: 'images/dealer@32.png',
      body: aMsg,
    });
    notification.onclick = function () {
      notification.close();
    };
    setTimeout(function(){
      notification.close();
    }, 4000);
    this.lastMsg = aMsg;
  };
  this.play = function() {
   
  };
}

var PlayersView = function() {
  this.removePlayer = function(aUserName) {
    var player = document.querySelector('table-cards[player='+aUserName+']');
    player.setAttribute("cards", 0);
    var photo = document.querySelector('player-photo[player='+aUserName+']');
    photo.setAttribute("player", '');
  };
  this.clearAction = function() {
    var cards = document.querySelectorAll('table-cards');
    for (var i = 0; i < cards.length; ++i) {
      cards[i].setAttribute("onclick", '');
    }
  };
};