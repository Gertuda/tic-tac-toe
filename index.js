var ceil = document.getElementsByClassName("cell"),
  title = document.getElementsByClassName("won-title"),
  message = document.getElementsByClassName("won-message"),
  restart = document.getElementsByClassName("restart-btn"),
  undo = document.getElementsByClassName("undo-btn"),
  redo = document.getElementsByClassName("redo-btn"),
  player = "X",
  stepCount = 0,
  winCombinations = [
    [1, 2, 3], //0
    [1, 4, 7], //1
    [1, 5, 9], //2
    [2, 5, 8], //3
    [3, 6, 9], //4
    [3, 5, 7], //5
    [4, 5, 6], //6
    [7, 8, 9] //7
  ],
  dataX = [],
  data0 = [],
  dataXredu = [],
  data0redu = [];

undo[0].addEventListener("click", undoClick);
redo[0].addEventListener("click", redoClick);
restart[0].addEventListener("click", restartClick);

for (var i = 0; i < ceil.length; i++) {
  ceil[i].addEventListener("click", currentStep);
}

function increaseStepCount() {
  stepCount++;
}

function switchPlayer() {
  if (player === "X") {
    player = "0";
  } else {
    player = "X";
  }
}

function currentStep(event) {
  var num = parseInt(this.getAttribute("data-id"), 10);

  if (
    !event.target.classList.contains("ch") &&
    !event.target.classList.contains("r")
  ) {
    if (player === "X") {
      dataX.push(num);
      event.target.classList.add("ch");
    } else {
      data0.push(num);
      event.target.classList.add("r");
    }
    if (
      (data0.length > 2 || dataX.length > 2) &&
      (checkWin(data0) || checkWin(dataX))
    ) {
      for (var i = 0; i < ceil.length; i++) {
        ceil[i].removeEventListener("click", currentStep);
      }
      title[0].classList.remove("hidden");
      data0 = [];
      dataX = [];
      data0redu = [];
      dataXredu = [];
      if (player === "X") {
        message[0].innerHTML = "Crosses won!";
      } else if (player === "0") {
        message[0].innerHTML = "Toes won!";
      }
    }
    checkCell();
  }
  unlockUndo_Redo();
  increaseStepCount();
  switchPlayer();
}

function unlockUndo_Redo() {
  if (data0.length > 0 || dataX.length > 0) {
    undo[0].removeAttribute("disabled");
  } else {
    undo[0].setAttribute("disabled", true);
  }
  if (data0redu.length > 0 || dataXredu.length > 0) {
    redo[0].removeAttribute("disabled");
  } else {
    redo[0].setAttribute("disabled", true);
  }
}

function undoClick() {
  if (player === "X") {
    var num = data0[data0.length - 1];
    data0.splice(data0.length - 1, 1);
    ceil[num - 1].classList.remove("r");
    data0redu.push(num);
  } else if (player === "0") {
    var num = dataX[dataX.length - 1];
    dataX.splice(dataX.length - 1, 1);
    ceil[num - 1].classList.remove("ch");
    dataXredu.push(num);
  }
  stepCount--;
  unlockUndo_Redo();
  switchPlayer();
}
function restartClick() {
  stepCount = 0;
  player = "X";
  title[0].classList.add("hidden");
  for (var i = 0; i < ceil.length; i++) {
    ceil[i].addEventListener("click", currentStep);
    if (ceil[i].classList.contains("ch")) {
      ceil[i].classList.remove("ch");
    } else if (ceil[i].classList.contains("r")) {
      ceil[i].classList.remove("r");
    }

    if (
      ceil[i].classList.contains(
        "win",
        "vertical",
        "horizontal",
        "diagonal-right",
        "diagonal-left"
      )
    ) {
      ceil[i].classList.remove(
        "win",
        "vertical",
        "diagonal-left",
        "horizontal",
        "diagonal-right"
      );
    }
  }
}

function checkCell() {
  if (stepCount >= 8) {
    title[0].classList.remove("hidden");
    message[0].innerHTML = "It's a draw!";
    for (var i = 0; i < ceil.length; i++) {
      ceil[i].removeEventListener("click", currentStep);
    }
    data0 = [];
    dataX = [];
    data0redu = [];
    dataXredu = [];
  }
}

function redoClick() {
  if (player === "X") {
    var num = dataXredu[dataXredu.length - 1];
    dataXredu.splice(dataXredu.length - 1, 1);
    ceil[num - 1].classList.add("ch");
    dataX.push(num);
  } else if (player === "0") {
    var num = data0redu[data0redu.length - 1];
    data0redu.splice(data0redu.length - 1, 1);
    ceil[num - 1].classList.add("r");
    data0.push(num);
  }
  increaseStepCount();
  switchPlayer();
  unlockUndo_Redo();
}

function checkWin(arr) {
  return winCombinations.some(function(combination) {
    const isCorrect = combination.every(function(number) {
      return arr.includes(number);
    });

    if (isCorrect) {
      CheckWinComb(combination);
    }

    return isCorrect;
  });
}

function CheckWinComb(arr) {
  if (arraysEqual(arr, winCombinations[0])) {
    for (var i = 0; i <= 2; i++) {
      ceil[i].classList.add("win", "horizontal");
    }
  } else if (arraysEqual(arr, winCombinations[6])) {
    for (var i = 3; i <= 5; i++) {
      ceil[i].classList.add("win", "horizontal");
    }
  } else if (arraysEqual(arr, winCombinations[7])) {
    for (var i = 6; i <= 8; i++) {
      ceil[i].classList.add("win", "horizontal");
    }
  } else if (arraysEqual(arr, winCombinations[1])) {
    for (var i = 0; i <= 6; i += 3) {
      ceil[i].classList.add("win", "vertical");
    }
  } else if (arraysEqual(arr, winCombinations[3])) {
    for (var i = 1; i <= 7; i += 3) {
      ceil[i].classList.add("win", "vertical");
    }
  } else if (arraysEqual(arr, winCombinations[4])) {
    for (var i = 2; i <= 8; i += 3) {
      ceil[i].classList.add("win", "vertical");
    }
  } else if (arraysEqual(arr, winCombinations[2])) {
    for (var i = 0; i <= 8; i += 4) {
      ceil[i].classList.add("win", "diagonal-right");
    }
  } else if (arraysEqual(arr, winCombinations[5])) {
    for (var i = 2; i <= 6; i += 2) {
      ceil[i].classList.add("win", "diagonal-left");
    }
  }
}

function arraysEqual(arr1, arr2) {
  for (var i = arr1.length; i--; ) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
}
