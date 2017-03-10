window.onload = function() {
  var game = new Phaser.Game(800, 800, Phaser.CANVAS, '', { preload: preload, create: create, update: update });
  var on = false;
  var music;
  var chopinSongs = [];
  var otherSongs = [];
  var songs;
  var chopinSongsNum = 25; // Random 25 songs?
  var otherSongsNum = 3;
  var stage = 0;
  var play_button;
  var pause_button;
  var questionNum;
  var flash;
  var score = "♫".repeat(chopinSongsNum + otherSongsNum);
  var scoreSheet;
  var musicList = {};

  function load_for (type) {
    if (type == 'chopin') {
      for (i = 0; i < chopinSongsNum; i++) {
        name = 'c' + i.toString();
        path = '/music/chopin/c' + i.toString() + '.ogg';

        game.load.audio(name, path);
        chopinSongs.push(name);
        musicList[name] = chopinList[name];
      }
    }
    else {
      for (i = 0; i < otherSongsNum; i++) {
        name = 'o' + i.toString();
        path = '/music/others/o' + i.toString() + '.mp3';

        game.load.audio(name, path);
        otherSongs.push(name);

        musicList[name] = othersList[name];
        console.log(musicList[name]);
      }
    }
  }

  function load_songs () {
    load_for('chopin');
    load_for('other');
    songs = chopinSongs.concat(otherSongs);
  }

  function preload () {
    game.load.image('background', 'background.jpg');
    game.load.image('play', 'play-button.svg');
    game.load.image('pause', 'pause-button.svg');
    load_songs();
  }

  function create () {
    game.renderer.renderSession.roundPixels = true;
    game.stage.backgroundColor = "#8ed2c9";

    render_button();
    play_button.visible = true;
    pause_button.visible = false;

    questionNum = game.add.text(game.world.centerX, game.world.centerY - 300, stage, { font: "30px Georgia", fill: "#ff7a5a" });

    flash = game.add.text(game.world.centerX, game.world.centerY + 180, '', { font: "20px Georgia", fill: "#462066" });
    flash.anchor.setTo(0.5, 0.5);

    score_temp = score.match(/.{1,16}/g).join("\n");
    scoreSheet = game.add.text(game.world.centerX, game.world.centerY - 350, score_temp, { font: "20px" });
    scoreSheet.anchor.setTo(0.5, 0.5);

    nextSong();
  }

  function update () {
    scoreSheet.clearColors();
    bright = "#ffb85f";
    dark = "#00aaa0";

    for (i =0; i < songs.length; i++) {
      if (i < stage) {
        scoreSheet.colors.push(dark);
      }
      else {
        scoreSheet.colors.push(bright);
      }
    }

  }

  function nextSong() {
    style = { font: "30px Serif", fill: "#fcf4d9" };
    music = game.add.audio(songs[stage]);

    questionNum.text = stage + 1;
    questionNum.anchor.setTo(0.5, 0.5);

    questionText = game.add.text(game.world.centerX, game.world.centerY - 250, "Did Chopin write this?", style);
    questionText.anchor.setTo(0.5, 0.5);

    var text1 = game.add.text(game.world.centerX, game.world.centerY + 230, "YES", style);
    var text2 = game.add.text(game.world.centerX, game.world.centerY + 280, "NAH", style);
    text1.inputEnabled = true;
    text2.inputEnabled = true;

    text1.anchor.setTo(0.5, 0.5);
    text2.anchor.setTo(0.5, 0.5);

    var text1Answer = songs[stage][0] == 'c';
    var text2Answer = !text1Answer;

    text1.events.onInputDown.add(function() { checkAnswer(text1Answer) }, this);
    text2.events.onInputDown.add(function() { checkAnswer(text2Answer) }, this);
  }

  function render_button() {
    play_button = game.add.button(game.world.centerX, game.world.centerY - 10, 'play', play, this);
    pause_button = game.add.button(game.world.centerX, game.world.centerY - 10, 'pause', play, this);
    pause_button.scale.setTo(0.5,0.5);
    pause_button.anchor.setTo(0.5, 0.5);
    play_button.scale.setTo(0.5,0.5);
    play_button.anchor.setTo(0.5, 0.5);
  }

  function checkAnswer(answer) {
    if (answer) {
      alert(musicList[songs[stage]]);
      flash.text = musicList[songs[stage]];//"Awesome ♬";
      flash.alpha = 1.0;;
      game.add.tween(flash).to( { alpha: 0 }, 2000, "Linear", true);
      stage++;
      music.stop();
      nextSong();
      on = false;
      play_button.visible = true;
      pause_button.visible = false;
    } else {
      tryAgain();
    }
  }

  function play(button) {
    on = !on;
    if (on) {
      music.play();
      play_button.visible = false;
      pause_button.visible = true;
    } else {
      music.stop();
      play_button.visible = true;
      pause_button.visible = false;
    }
  }

  function tryAgain() {
    flash.text = "Nah...♪";
    flash.alpha = 1.0;;
    game.add.tween(flash).to( { alpha: 0 }, 2000, "Linear", true);
  }
};
