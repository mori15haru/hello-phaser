window.onload = function() {
  var game = new Phaser.Game(800, 800, Phaser.CANVAS, '', { preload: preload, create: create, update: update });
  var on = false;
  var chopinSongsNum = 25; // Random 25 songs?
  var otherSongsNum = 3;
  var score = "♫".repeat(chopinSongsNum + otherSongsNum);
  var centerY = 450;
  var centerX = 400;
  var stage = 0;
  var style = { font: "30px verdana", fill: off_yellow };
  // initially empty
  var chopinSongs = [];
  var otherSongs = [];
  var musicList = {};
  var music;
  var songs;
  var playButton;
  var pauseButton;
  var questionNum;
  var flash;
  var answer;
  var scoreSheet;

  function load_for (type) {
    if (type == 'chopin') {
      num = chopinSongNum;
      prefix = 'c';
      dir = 'music/chopin/c';
      type = '.ogg';
      list = chopinList;
      songs = chopinSongs;
    }
    else {
      num = otherSongsNum;
      prefix = 'o';
      dir = '/music/others/o';
      type = '.mp3';
      list = otherList;
      songs = otherSongs;
    }
    // Add music
    for (i = 0; i < num; i++) {
      name = prefix + i.toString();
      path = dir + i.toString() + type;
      game.load.audio(name, path);
      songs.push(name);
      musicList[name] = list[name];
    }
  }

  function loadSongs () {
    load_for('chopin');
    load_for('other');
    songs = chopinSongs.concat(otherSongs);
  }

  function preload () {
    game.load.image('play', 'play-button.svg');
    game.load.image('pause', 'pause-button.svg');
    loadSongs();
  }

  function create () {
    game.renderer.renderSession.roundPixels = true;
    game.stage.backgroundColor = riptide;

    render_button();
    updateButtons();

    questionNum = game.add.text(centerX, centerY - 280, stage, { font: "30px verdana", fill: coral });

    flash = game.add.text(centerX, centerY + 180, '', { font: "15px verdana", fill: blue_diamond });
    flash.anchor.setTo(0.5, 0.5);

    answer = game.add.text(centerX, centerY + 150, '', { font: "20px", fill: blue_diamond });
    answer.anchor.setTo(0.5, 0.5);

    scoreRepresentation = score.match(/.{1,16}/g).join("\n");
    scoreSheet = game.add.text(centerX, centerY - 350, scoreRepresentation, { font: "20px", fill: bright });
    scoreSheet.anchor.setTo(0.5, 0.5);

    nextSong();
  }

  function update () {}

  function updateScoreSheet () {
    scoreSheet.clearColors();

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
    music = game.add.audio(songs[stage]);

    questionNum.text = stage + 1;
    questionNum.anchor.setTo(0.5, 0.5);

    questionText = game.add.text(centerX, centerY - 230, "Did Chopin write this?", style);
    questionText.anchor.setTo(0.5, 0.5);

    var text1 = game.add.text(centerX, centerY + 230, "YES", style);
    var text2 = game.add.text(centerX, centerY + 280, "NAH", style);
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
    playButton = game.add.button(centerX, centerY - 10, 'play', play, this);
    pauseButton = game.add.button(centerX, centerY - 10, 'pause', play, this);
    pauseButton.scale.setTo(0.5, 0.5);
    pauseButton.anchor.setTo(0.5, 0.5);
    playButton.scale.setTo(0.5, 0.5);
    playButton.anchor.setTo(0.5, 0.5);
  }

  function checkAnswer(correct) {
    if (correct) {
      music.stop();

      flash.text = musicList[songs[stage]];
      flash.alpha = 1.0;
      game.add.tween(flash).to( { alpha: 0 }, 2000, "Linear", true);

      answer.text = "Awesome ♬";
      answer.alpha = 1.0;
      game.add.tween(answer).to( { alpha: 0 }, 2000, "Linear", true);

      stage++;
      on = false;
      updateButtons();
      updateScoreSheet();

      nextSong();
    }
    else {
      flash.text = "Nah...♪";
      flash.alpha = 1.0;
      game.add.tween(flash).to( { alpha: 0 }, 2000, "Linear", true);
    }
  }

  function play(button) {
    on = !on;

    if (on) {
      music.play();
    }
    else {
      music.stop();
    }
    updateButtons();
  }

  function updateButtons() {
    pauseButton.visible = on;
    playButton.visible = !on;
  }
};
