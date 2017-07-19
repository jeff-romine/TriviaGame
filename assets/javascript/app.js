$(document).ready(function () {

  var questions = [
    {
      timeLimitInSeconds: 10,
      questionText: "Who was the only female member of the Grateful Dead?",
      answers: ["Linda Ronstadt", "Donna Jean Godchaux", "Janis Joplin"],
      correctAnswer: "Donna Jean Godchaux",
      explanationText: "Donna Jean Godchaux provided back-up and lead vocals for the band from 1971 to 1979."
    },
    {
      timeLimitInSeconds: 15,
      questionText: "Jerry's last name is what?",
      answers: ["Garcia", "Godchaux", "Weir"],
      correctAnswer: "Garcia",
      explanationText: "Donna Jean Godchaux provided back-up and lead vocals for the band from 1971 to 1979."
    }
  ];

  /* All of these variables need to be properly initialized in init() */
  var state;
  var started;
  var questionIndex;
  var timeLimitInSeconds;
  var questionActive;
  var selectedAnswer;
  var currentQuestion;

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
    if (selectedAnswer === currentQuestion.correctAnswer) {
      $("#result-area").append($("<h1>").text("Correct!"));
    }
    else {
      $("#result-area").append($("<h1>").text("Incorrect!"));
    }

    $("#result-area").append($("<p>").html($("<h3>").text(currentQuestion.explanationText)));

    return sWaitForNext;
  }

  function tSubmit() {
    questionActive=false;
    return tShowQuestionResults();
  }

  function intervalHandler() {
    if (questionActive) {
      if (timeLimitInSeconds <= 0) {
        state = tSubmit();
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
      currentQuestion = questions[questionIndex++];
      var answers = currentQuestion.answers;

      $("#question-text")
        .text(currentQuestion.questionText);

      answers.forEach((answer, index) => {
        $("#answer-" + index).text(answer);
        $("#answer").parent().attr("data-answer",answer);
      });

      timeLimitInSeconds = currentQuestion.timeLimitInSeconds;
      refreshTimeLimit();

      $("#result-area").text("");
      questionActive=true;

      return sWaitForAnswer;
    }
  }

  $('#answer-table').on('click', '.clickable-row', function (event) {
    console.log("event", event);

    selectedAnswer=$(this).attr("data-answer");
    $(this).addClass('active').siblings().removeClass('active');
  });

  function handleSubmit(event) {
    console.log("event: ",event);
    state=tSubmit();
  }

  $('#submit-answer').click(handleSubmit);

  $('#start-button').click((event) => {
    state = state(event);
    });

  function clickHandler(event) {
    console.log("clickHandler(",event,")");
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
