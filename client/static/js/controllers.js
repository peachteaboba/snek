/**
 * Created by andyf on 4/02/17.
 */

app.controller('loginController', function($scope, loginFactory, $location, $timeout){

  $scope.buttonText = "ENTER PLAYER NAME";
  $scope.red = false;
  $scope.player = {};


  $scope.playerEnter = function(){
    if ($scope.player.name && $scope.player.name.length > 3) {
      // call factory method to log in the player
      loginFactory.login($scope.player, function(output){
        if(output.status == 200){
          // good ======

          loginFactory.setUser(output.data, function(){
            $location.url('/game');
          });


        } else {
          // bad ======
          document.getElementById("pass").focus();
          $scope.buttonText = "INVALID NAME";
          $scope.red = true;
          $timeout(revertRed, 100);
          $timeout(revert, 1000);
        }
      });
      // clear input
      $scope.player = {};
    } else {
      // bad ======
      document.getElementById("pass").focus();
      $scope.buttonText = "INVALID NAME";
      $scope.red = true;
      $timeout(revertRed, 100);
      $timeout(revert, 1000);
    }
  }




  // Helper functions
  $scope.myFunct = function(keyEvent) {
    if (keyEvent.which === 13){
      $scope.playerEnter();
    }
  }

  function revert(){
    $scope.buttonText = "ENTER PLAYER NAME";
  }
  function revertRed(){
    $scope.red = false;
  }

  $scope.inputChange = function(){
    if($scope.player.name.length > 3){
      $scope.buttonText = "START GAME";
    } else {
      $scope.buttonText = "ENTER PLAYER NAME";
    }
  }





});





// GAME CONTROLLER :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// GAME CONTROLLER :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// GAME CONTROLLER :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.controller('gameController', function($scope, loginFactory, $location, $timeout){
  $scope.user = {};
  $scope.currentScore = 0;
  $scope.showLeaderboard = false;
  $scope.leaderboard = [];
  $scope.green = false;
  $scope.speed = 0;

  // Game vars ========================================================
  var gameStart = false;
  var snakeLength;
  var snakeH;
  var snakeT;
  var direction;
  var speed;
  var loop;
  var grow = false;

  loginFactory.getUser(function(data){
    if(!data){
      console.log("new phone who dis?");
      gameStart = false;
      $location.url('/');
    } else {
      $scope.user = data;
      // Init =========================================================
      $scope.world = createWorld(60, 30);
      createSnake(function(){
        startGame();
      });
    }
  });


  function getLeader(){
    loginFactory.getLeader(function(output){
      $scope.leaderboard = output.data;
      console.log($scope.leaderboard);
      // Show the leaderboard
      $scope.showLeaderboard = true;
    });
  }






  // Generate array matrix ============================================
  function createWorld(width, height){
    var worldArr = [];
    var arr = [];
    for(var i=0; i<height; i++){
      arr = [];
      for(var j=0; j<width; j++){
        if(i==0 || i==height-1){
          arr.push(1);
        } else {
          if(j==0 || j==width-1){
            arr.push(1);
          } else {
            arr.push(0);
          }
        }
      }
      worldArr.push(arr);
    }
    return worldArr;
  }

  // Generate snake ===================================================
  function createSnake(callback){

    // Snake starts with length of 3
    snakeLength = 3;
    direction = "right";
    speed = 300;
    $scope.speed = speed;
    gameStart = true;

    // Snake starting point [2][2]
    for(var i=0; i<snakeLength; i++){
      if(i == snakeLength - 1){
        // Head
        $scope.world[2][2+i] = 3;
        snakeH = [2, 2+i];
      } else {
        if(i == 0){
          // Tail
          snakeT = [2, 2+i];
        }
        $scope.world[2][2+i] = 2;
      }
    }

    callback();
  }

  // Move snake =======================================================
  function moveSnake(callback){

    // Previous head is now "2"
    $scope.world[snakeH[0]][snakeH[1]] = 2;


    // Generate new Head
    if(direction == "right"){
      snakeH[1]++;
    } else if (direction == "left") {
      snakeH[1]--;
    } else if (direction == "down") {
      snakeH[0]++;
    } else if (direction == "up") {
      snakeH[0]--;
    }

    if(grow){

      grow = false;

    } else {

      // Previous tails is now "0"
      $scope.world[snakeT[0]][snakeT[1]] = 0;

      // Generate new Tail
      if($scope.world[snakeT[0]][snakeT[1] + 1] == 2){
        // Tail moving the the right
        snakeT[1]++;
      } else if ($scope.world[snakeT[0]][snakeT[1] - 1] == 2) {
        // Tail moving the the left
        snakeT[1]--;
      } else if ($scope.world[snakeT[0] + 1][snakeT[1]] == 2) {
        // Tail moving down
        snakeT[0]++;
      } else if ($scope.world[snakeT[0] - 1][snakeT[1]] == 2) {
        // Tail moving up
        snakeT[0]--;
      }

    }






    // Apply new snake head to world (check collision)
    if($scope.world[snakeH[0]][snakeH[1]] == 4){
      // Ate apple
      $scope.world[snakeH[0]][snakeH[1]] = 3;
      growSnake();
    } else if($scope.world[snakeH[0]][snakeH[1]] == 0){
      // Move normally
      $scope.world[snakeH[0]][snakeH[1]] = 3;
    } else {
      // Hit something
      gameOver();
    }

    $scope.$apply();

    if(callback){
      callback();
    }
  }


  // Handle key press =================================================
  document.onkeypress = function (e) {
    if(gameStart){

      if(e.keyCode == 100){
        // right --> D (will only work if direction is up or down)
        if(direction == "up" || direction == "down"){
          direction = "right";
          changeDirection();
        }
      } else if(e.keyCode == 115){
        // down --> S (will only work if direction is left or right)
        if(direction == "left" || direction == "right"){
          direction = "down";
          changeDirection();
        }
      } else if(e.keyCode == 97){
        // left --> A (will only work if direction is up or down)
        if(direction == "up" || direction == "down"){
          direction = "left";
          changeDirection();
        }
      } else if(e.keyCode == 119){
        // up --> W (will only work if direction is left or right)
        if(direction == "left" || direction == "right"){
          direction = "up";
          changeDirection();
        }
      }
    }
  };


  // Change direction =================================================
  function changeDirection(){
    // Restart the interval
    moveSnake(function(){
      clearInterval(loop);
      loop = setInterval(moveSnake, speed);
    });
  }


  // Generate Apple ===================================================
  function generateApple(){

    // Generate x-coordinate
    var minX = 1;
    var maxX = $scope.world[0].length - 2;
    var x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;

    // Generate y-coordinate
    var minY = 1;
    var maxY = $scope.world.length - 2;
    var y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

    // Check if valid
    if($scope.world[y][x] != 0){
      generateApple();
    } else {
      $scope.world[y][x] = 4;
    }
  }




  // Grow snake =======================================================
  function growSnake(){
    grow = true;
    $scope.currentScore += 10;
    speed = speed * 0.9;
    $scope.speed = Math.floor(speed);
    generateApple();


    $scope.$apply();

    $scope.green = true;
    $timeout(revertGreen, 50);


  }

  function revertGreen(){
    console.log('revert');
    $scope.green = false;
  }

  // Game over ========================================================
  function gameOver(){

    clearInterval(loop);

    var obj = {
      _id: $scope.user._id,
      score: $scope.currentScore
    }


    // Save score to database and show leaderboard
    loginFactory.saveScore(obj, function(output){
      $scope.user = output.data;
      getLeader()
    })







  }




  // Start game =======================================================
  function startGame(){
    generateApple();
    loop = setInterval(moveSnake, speed);
  }

  $scope.restart = function(){

    // Reset variables
    gameStart = false;
    $scope.currentScore = 0;
    $scope.showLeaderboard = false;
    $scope.leaderboard = [];

    // Init =======================
    $scope.world = createWorld(60, 30);
    createSnake(function(){
      startGame();
    });


  }













});

















// end
