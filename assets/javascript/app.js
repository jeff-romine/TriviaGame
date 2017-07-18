$(document).ready(function () {

  $('#answer-table').on('click', '.clickable-row', function (event) {
    console.log("event", event);
    $(this).addClass('active').siblings().removeClass('active');
  });


  var questions = [
    {
      timeLimitInSeconds: 10,
      questionText: "Who was the only female member of the Grateful Dead?",
      answers: ["Linda Ronstadt", "Donna Jean Godchaux", "Janis Joplin"],
      correctAnswer: "Donna Jean Godchaux",
      explanationText: "Donna Jead Godchaux provided back-up and lead vocals for the band from 1971 to 1979."
    },
    {
      timeLimitInSeconds: 10,
      questionText: "Who was the only female member of the Grateful Dead?",
      answers: ["Linda Ronstadt", "Donna Jean Godchaux", "Janis Joplin"],
      correctAnswer: "Donna Jean Godchaux",
      explanationText: "Donna Jead Godchaux provided back-up and lead vocals for the band from 1971 to 1979."
    }
  ];

  /* All of these variables need to be properly initialized in init() */
  var state;
  var started;
  var questionIndex;
  var timeLimitInSeconds;
  var questionActive;
  var selectedAnswer;

  function sAwaitingStart(event) {
    $(".awaiting-start").hide();
    $(".active-game").show();
    started = true;
    return tNextQuestion();
  }

  function sWaitForAnswer(event) {
    console.log(event);
    return sWaitForAnswer;
  }

  function sWaitForRestart(event) {
    console.log(event);
    return sWaitForRestart;
  }

  function tGameOver() {
    /* display game results */
    /* wait for start over */
    return sWaitForRestart;
  }

  function refreshTimeLimit() {
    $("#time-remaining").text(timeLimitInSeconds.toString());
  }

  function sWaitForNext(event) {
    return sWaitForNext;
  }

  function tShowQuestionResults() {
    var question = questions[questionIndex];

    if (selectedAnswer === question.correctAnswer) {
      $("#result-area").append($("<h1>").text("Correct!"));
    }
    else {
      $("#result-area").append($("<h1>").text("Incorrect!"));
    }

    $("#result-area").append($("<p>").html($("<h3>").text(question.explanationText)));

    return sWaitForNext;
  }

  function tTimeout() {
    questionActive=false;
    return tShowQuestionResults();
  }

  function intervalHandler() {
    if (questionActive) {
      if (timeLimitInSeconds <= 0) {
        state = tTimeout();
      }
      else {
        timeLimitInSeconds--;
        refreshTimeLimit();
      }
    }
  }

  function tNextQuestion() {
    if (questionIndex >= questions.length) {
      return tGameOver();
    }
    else {
      var question = questions[questionIndex++];
      var answers = question.answers;

      $("#question-text").text(question.questionText);

      answers.forEach((answer, index) => {
        $("#answer-" + index).text(answer);
      });

      timeLimitInSeconds = question.timeLimitInSeconds;
      refreshTimeLimit();

      $("#result-area").text("");
      questionActive=true;

      return sWaitForAnswer;
    }
  }

  function clickHandler(event) {
    state=state(event);
  }

  $("body").click(clickHandler);

  function init() {

    $(".active-game").hide();
    $(".init").show();
    started = false;
    questionIndex=0;
    questionActive=false;

    state=sAwaitingStart;

    setInterval(intervalHandler,1000);

  }

  init();

});
