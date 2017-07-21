$(document).ready(function () {

  var questions = [
    {
      timeLimitInSeconds: 13,
      questionText: "Who was the only female member of the Grateful Dead?",
      answers: ["Linda Ronstadt", "Donna Jean Godchaux", "Janis Joplin","Karen Carpenter"],
      correctAnswer: "Donna Jean Godchaux",
      explanationText: "Donna Jean Godchaux provided back-up and lead vocals for the band from 1971 to 1979."
    },
    {
      timeLimitInSeconds: 20,
      questionText: "What were the Grateful Dead called before they were called the Grateful Dead?",
      answers: ["The Warlocks", "The Birds", "The Animals","The Airplane"],
      correctAnswer: "The Warlocks",
      explanationText: "Members of the Grateful Dead played in \"The Warlocks\" and \"Mother McCree's Uptown Jug Champions\"."
    },
    {
      timeLimitInSeconds: 10,
      questionText: "What instrument did Jerry Garcia play before switching to guitar?",
      answers: ["Clarinet", "Fiddle", "Banjo","Piano","Trumpet"],
      correctAnswer: "Banjo",
      explanationText: "Jerry Garcia became a very accomplished Bluegrass banjo player before taking up the guitar"
    }
  ];

  /* All of these variables need to be properly initialized in init() */
  var state;
  var questionIndex;
  var timeLimitInSeconds;
  var questionActive;
  var selectedAnswer;
  var currentQuestion;
  var correctAnswers;
  var intervalId;

  function sAwaitingStart(event) {
    $(".awaiting-start").hide();
    $(".active-game").show();
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

    $(".active-game").hide();

    $("#stat-number-of-questions").text(questions.length.toString());
    $("#stat-correct-answers").text(correctAnswers.toString());
    $("#stat-percent-correct").text(Math.round((correctAnswers/questions.length) * 100).toString());
    $(".game-over").show();
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
      correctAnswers++;
      $("#result-area").append($("<h1>").text("Correct!"));
    }
    else {
      $("#result-area").append($("<h1>").text("Incorrect!"));
    }

    $("#result-area").append(
      $("<p>")
        .html($("<h3>")
          .attr("id","explanation-text")
          .addClass("text-left")
          .text(currentQuestion.explanationText)));

    if (questionIndex < questions.length) {
      setSubmitOrNext("next","Next Question");
    }
    else {
      setSubmitOrNext("next","Game Results");
    }
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

  function setSubmitOrNext(action,label) {
    var button = $("#submit-or-next");
    button.attr("data-action",action).text(label);
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
        var answerTd = $("#answer-" + index);
        answerTd.html($("<h4>").text(answer));
        // The parent .clickable-row is the event context so
        // it is convenient to have the answer text here
        answerTd.parent().attr("data-answer",answer);
      });

      timeLimitInSeconds = currentQuestion.timeLimitInSeconds;
      refreshTimeLimit();

      $("#result-area").text("");
      questionActive=true;

      setSubmitOrNext("submit","Submit Answer");

      $(".clickable-row").removeClass('active');

      return sWaitForAnswer;
    }
  }

  $('#answer-table').on('click', '.clickable-row', function (event) {
    console.log("event", event);
    if (questionActive) {
      selectedAnswer=$(this).attr("data-answer");
      $(this).addClass('active').siblings().removeClass('active');
    }
  });

  function handleSubmitOrNext(event) {
    console.log("event: ",event);

    var action = $(event.target).attr("data-action");

    if (action === "next") {
      state=tNextQuestion();
    }
    else {
      state=tSubmit();
    }
  }

  $('#submit-or-next').click(handleSubmitOrNext);


  $('#try-again').click(function () {
    init();
  });

  function startButtonHandler(event) {
    state = state(event);
  }

  function init() {

    $(".active-game").hide();
    $(".game-over").hide();
    $(".init").show();
    $(".awaiting-start").show();
    questionIndex=0;
    questionActive=false;
    correctAnswers=0;
    selectedAnswer=undefined;
    currentQuestion=undefined;


    $('#start-button').unbind("click",startButtonHandler);
    $('#start-button').click(startButtonHandler);

    if (!intervalId) {
      intervalId = setInterval(intervalHandler, 1000);
    }
    state=sAwaitingStart;
  }

  init();

});
