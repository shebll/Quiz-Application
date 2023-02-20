let countSpan = document.querySelector(".count span");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let answersArea = document.querySelector(".quiz-app .answers-area");
let submitBtn = document.querySelector(".quiz-app .submit-btn");
let results = document.querySelector(".quiz-app .results");
let time = document.querySelector(".quiz-app .count-down");
let countDownInterval;
let rightAnswers = 0;
let index = 0;
//////function get the response text from json object ant turn into js object///////////
function getQuestions(link) {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let qoestions = JSON.parse(this.responseText);
      let qoestionCount = qoestions.length;

      createBullets(qoestionCount);
      addData(qoestions[index], qoestionCount);

      countDown(30, qoestionCount);
      submitBtn.onclick = function () {
        clearInterval(countDownInterval);
        countDown(30, qoestionCount);
        let bulletsSpans = document.querySelectorAll(
          ".quiz-app .bullets .spans span"
        );
        if (index + 1 !== qoestions.length) {
          bulletsSpans[index + 1].classList.add("on");
        }

        let rightAnswer = qoestions[index]["right-answer"];
        index++;
        checkAnswer(rightAnswer, qoestionCount);
        answersArea.innerHTML = "";
        quizArea.innerHTML = "";

        addData(qoestions[index], qoestionCount);

        showResults(qoestionCount);
      };
    }
  };
  myRequest.open("GET", link, true);
  myRequest.send();
}
//////////////////////////////////////////////////////////////////////////////////////////

///////////////function know number of questions and update the html data (number of span and count number )////////////////
function createBullets(num) {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let newSpan = document.createElement("span");
    if (i == 0) {
      newSpan.classList.add("on");
    }
    let spans = document.querySelector(".bullets .spans");
    spans.appendChild(newSpan);
  }
}
///////////////////////////////////////////////////////////////////////////////////////////
///////////////function add the question into page///////////////////////////////
function addData(firstQ, numOfQuestion) {
  if (index < numOfQuestion) {
    // console.log(firstQ);
    //////create title of question //////////////////
    let titleTag = document.createElement("h2");
    let titleText = document.createTextNode(firstQ.title);
    titleTag.appendChild(titleText);
    quizArea.appendChild(titleTag);
    ////////////////////////////////////////////////
    //////create the answers of question //////////////////
    for (let i = 0; i < 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.classList.add("answer");

      let radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "questions";
      radioInput.id = `answer-${i + 1}`;
      radioInput.dataset.answer = firstQ[`answer-${i + 1}`];

      let labelTag = document.createElement("label");
      let labelText = document.createTextNode(firstQ[`answer-${i + 1}`]);
      labelTag.setAttribute("for", `answer-${i + 1}`);
      labelTag.appendChild(labelText);

      if (i == 0) {
        radioInput.checked = true;
      }

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(labelTag);
      answersArea.appendChild(mainDiv);
    }
    ////////////////////////////////////////////////
  }
}
///////////////////////////////////////////////////////////////////////////////////////////
///////////////function to check Answer///////////////////////////////
function checkAnswer(rightAnswer, qCount) {
  let answers = document.getElementsByName("questions");
  let chosenAnswer;
  answers.forEach((answer) => {
    if (answer.checked === true) {
      chosenAnswer = answer.dataset.answer;
    }
  });
  if (rightAnswer === chosenAnswer) {
    rightAnswers++;
    // console.log("goood");
  }
  console.log(rightAnswer);
  console.log(chosenAnswer);
  console.log(qCount);
}
///////////////////////////////////////////////////////////////////////////////////////////
function showResults(qoestionCount) {
  if (index == qoestionCount) {
    quizArea.remove();
    answersArea.remove();
    submitBtn.remove();
    let bullet = document.querySelector(".quiz-app .bullets ");
    bullet.remove();
    let gradTag = document.createElement("h2");
    let gradText = document.createTextNode(
      `You Get ${rightAnswers} from ${qoestionCount}  `
    );
    gradTag.appendChild(gradText);
    results.appendChild(gradTag);
    results.style.display = "block";
  }
}

function countDown(d, qCount) {
  if (index < qCount) {
    let minutes, secondes;
    countDownInterval = setInterval(function () {
      minutes = parseInt(d / 60);
      secondes = d % 60;

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      secondes = secondes < 10 ? `0${secondes}` : secondes;

      time.innerHTML = `${minutes} : ${secondes}`;
      if (--d < 0) {
        clearInterval(countDownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}
getQuestions("htmlQ.json");
