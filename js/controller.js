//"use strict"
(function(){
  var GameController = function() {
    this._buddy = "";
    this.init = function(){
      game.init();
      settings.init();
      dealer.permission();
      document.querySelector('.play').onclick = (function (){
        this.play();
      }).bind(this);
      document.querySelector('.stand').onclick = (function (){
        this.closeOverlay();
      }).bind(this);
      document.querySelector('.close').onclick = (function (){
        this.closeOverlay();
      }).bind(this);
      document.querySelector('.hit').onclick = (function (){
        this.hit();
      }).bind(this);
    };
    this.hit = function(){
      game.hit(this._buddy);
      board.addCard(game.getBuddy(this._buddy));
      this.checkScore(this._buddy);
    };
    this.checkScore = function(aUserName){
      var score = game.scoreCards(aUserName);
      if (score > 21) {
        players.removePlayer(aUserName);
        game.removeBuddy(aUserName);
        
        var nextIndex = shuffle.indexOf(shuffle[nextP]);
        var nextPlayer = shuffle[nextIndex];
        
        var index = shuffle.indexOf(aUserName);
        if (index > -1) {
          shuffle.splice(index, 1);
        }
        
        nextP = shuffle.indexOf(nextPlayer);
        dealer.notify("You lost" + aUserName + ".\n With the score: " + score);
        this.closeOverlay();
      }
      if (score == 21) {
        console.log("BlackJack!");
        dealer.notify("BlackJack!\n You win " + aUserName);
      }
    };
    this.playAgain = function() {
       window.location.reload();
    };
    this.leaks = function(){
      settings.hide();
      board.hide();
    };
    this.closeOverlay = function() {
      this.leaks();
      this.nextPlayer();
    };
    this.nextPlayer = function() {
      players.clearAction();
      var aPlayer = shuffle[nextP];
      if(aPlayer != 'dealer'){
        dealer.notify("Is your time " + aPlayer + "\n Click in your cards.");
        effects.play();
        var card = document.querySelector('table-cards[player='+aPlayer+']');
        card.onclick = (function (){
          this._buddy = aPlayer;
          board.show(game.getBuddy(aPlayer));
          this.checkScore(aPlayer);
        }).bind(this);
      } else {
        dealer.notify("Wait, is my time.");
        dealer.play();
      }
      nextP++;
      if(nextP >= shuffle.length)
        nextP = 0;
    };
    this.dealerNotify = function(){
       dealer.notify(dealer.lastMsg);
    };
    this.play = function() {
       window.onkeyup = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) { 
          controller.leaks();
          controller.nextPlayer();
        }
      } 
      controller.leaks();
      var playerHandlers = document.querySelectorAll('player-handler'), h, handlers = [];
      for (i = 0; i < playerHandlers.length; ++i) {
        handlers[i] = playerHandlers[i].getAttribute("player");
      }
      document.getElementById('parentdiv').style.display = "block"; 
      handlers = handlers.reverse();
      var dealer = ['dealer'];
      var players = dealer.concat(handlers);
      var div = 360 / players.length;
      var radius = 250;
      var parentdiv = document.getElementById('parentdiv');
      var offsetToParentCenter = parseInt(parentdiv.offsetWidth / 2);  //assumes parent is square
      var offsetToChildCenter = 36.5;
      var totalOffset = offsetToParentCenter - offsetToChildCenter;
      for (var i = 0; i < players.length; ++i)
      {
        game.addBuddy(players[i]);
        var playerPhoto = document.createElement('player-photo');
        playerPhoto.setAttribute("player", players[i]);
        var y = Math.sin((div * i) * (Math.PI / 180)) * radius;
        var x = Math.cos((div * i) * (Math.PI / 180)) * radius;
        playerPhoto.setAttribute("top", (y + totalOffset).toString() + "px");
        playerPhoto.setAttribute("left", (x + totalOffset).toString() + "px");
        parentdiv.appendChild(playerPhoto);
        var cards = document.createElement('table-cards');
        cards.setAttribute("player", players[i]);
        var y = Math.sin((div * i) * (Math.PI / 180)) * (radius-100);
        var x = Math.cos((div * i) * (Math.PI / 180)) * (radius-100);
        cards.setAttribute("top", (y + totalOffset).toString() + "px");
        cards.setAttribute("left", (x + totalOffset).toString() + "px");
        cards.setAttribute("cards", 0);
        parentdiv.appendChild(cards);
      }
      document.querySelector('player-photo[player=dealer]').setAttribute('onclick', 'controller.dealerNotify();');
      shuffle = players.reverse();
        for (var i = 0; i < shuffle.length*2; ++i) {
          var j = 0;
          setTimeout(function(){
            var aPlayer = shuffle[j<shuffle.length?j:j-shuffle.length];
            var player = document.querySelector('table-cards[player='+aPlayer+']'); 
            player.setAttribute("cards", j<shuffle.length?1:2);
            //var cardsPerPlayers[] <big-card number="1" symbol="♣" color="red"></big-card>
            game.hit(aPlayer);
            j++;
            if(j == shuffle.length*2)
              controller.nextPlayer();
          }, i * 200);
        }
    /*   setTimeout(function(){
        var player = document.querySelector('table-cards[player=ajsb85]');
        player.setAttribute("cards", 0);
        var photo = document.querySelector('player-photo[player=ajsb85]');
        photo.setAttribute("player", '');
      }, 4000); */

    };
  }

  var EffectsController = function() {
    this.play = function() {
      //document.getElementById('audiotag1').play();
    };
  };

  // game.addBuddy('ajsb85');
  // game.hit('ajsb85');
  // console.log(game.getBuddy('ajsb85'));

  var shuffle = [];
  var nextP = 0;
  var game = new GameModel();
  var board = new BoardView();
  var settings = new SettingsView();
  var dealer = new DealerView();
  var players = new PlayersView();
  var effects = new EffectsController();
  window.onload = function(){
    window.controller = new GameController();
    controller.init();
  }
})();
