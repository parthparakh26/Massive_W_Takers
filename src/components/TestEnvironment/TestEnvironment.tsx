import React, { Component } from 'react';
import { Chart } from 'chart.js/auto';
import data from './questions.json';
import './TestEnvironment.css';

interface Question {
  text: string;
  options: {
    text: string;
    value: string;
    correct: boolean;
  }[];
}

interface QuizData {
  questions: Question[];
}

interface State {
  quizData: QuizData | null;
  timer: number | undefined;
  alertTimeTriggered: boolean;
  totalTimePerQuestion: number;
  selectedOptions: Map<number, string>;
  showResults: boolean;
  timerStopped: boolean;
}

class TestEnvironment extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      quizData: null,
      timer: undefined,
      alertTimeTriggered: false,
      totalTimePerQuestion: 10,
      selectedOptions: new Map<number, string>(),
      showResults: false,
      timerStopped: false,
    };
  }

  componentDidMount() {
    const quizData: QuizData = data;
    this.setState({ quizData });
    const totalTime = this.calculateTotalTime(quizData.questions);
    this.startTimer(totalTime);
  }

  displayQuestionCard(questionData: Question, questionIndex: number) {
    return (
      <div className="question-card" key={questionIndex}>
        <div className="question">{questionData.text}</div>
        <div className="options">
          {questionData.options.map((option, optionIndex) => (
            <label className="option" key={optionIndex}>
              <input
                type="radio"
                name={`answer${questionIndex}`}
                value={option.value}
                data-correct={option.correct}
                onChange={(e) => this.handleOptionChange(questionIndex, e)}
                checked={this.state.selectedOptions.get(questionIndex) === option.value}
              />
              {option.text}
            </label>
          ))}
        </div>
        {!this.state.showResults && (
          <button
            className="deselect-button"
            onClick={() => this.deselectOptions(questionIndex)}
          >
            Clear Options
          </button>
        )}
      </div>
    );
  }

  handleOptionChange(questionIndex: number, event: React.ChangeEvent<HTMLInputElement>) {
    const selectedValue = event.target.value;
    this.setState((prevState) => {
      const selectedOptions = new Map(prevState.selectedOptions);
      selectedOptions.set(questionIndex, selectedValue);
      return { selectedOptions };
    });
  }

  deselectOptions(questionIndex: number) {
    this.setState((prevState) => {
      const selectedOptions = new Map(prevState.selectedOptions);
      selectedOptions.delete(questionIndex);
      return { selectedOptions };
    });
  }

  calculateTotalTime(questions: Question[]) {
    return questions.length * this.state.totalTimePerQuestion;
  }

  startTimer(totalTime: number) {
    let timeLeft = totalTime;

    const countdownElement = document.getElementById('countdown');
    const timer = setInterval(() => {
      if (timeLeft <= 0 || this.state.timerStopped) {
        clearInterval(timer);
        if (!this.state.showResults) {
          this.calculateResults();
        }
      } else {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        if (countdownElement) {
          countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
        timeLeft--;

        const alertTime = totalTime * 0.25;

        if (timeLeft <= alertTime && !this.state.alertTimeTriggered) {
          const alertMinutes = Math.floor(alertTime / 60);
          const alertSeconds = alertTime % 60;
          window.alert(`Only ${alertMinutes} minutes and ${alertSeconds} seconds remaining!`);
          this.setState({ alertTimeTriggered: true });
        }
      }
    }, 1000);

    this.setState({ timer: timer as any });
  }

  stopTimer() {
    if (this.state.timer) {
      clearInterval(this.state.timer as any);
    }
  }

  calculateResults() {
    const { quizData, selectedOptions } = this.state;
    if (!quizData) {
      return;
    }

    this.setState({ timerStopped: true });

    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unattemptedQuestions = 0;

    quizData.questions.forEach((question, index) => {
      const selectedOption = selectedOptions.get(index);
      if (selectedOption) {
        const option = question.options.find((opt) => opt.value === selectedOption);
        if (option && option.correct) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
      } else {
        unattemptedQuestions++;
      }
    });

    const accuracy = ((correctAnswers / quizData.questions.length) * 100).toFixed(2);

    this.setState({ showResults: true });

    const summaryContainer = document.getElementById('summary-card');
    if (summaryContainer) {
      summaryContainer.innerHTML = `
        <h2>Summary</h2>
        <p>Total Questions: ${quizData.questions.length}</p>
        <p>Correct Answers: ${correctAnswers}</p>
        <p>Incorrect Answers: ${incorrectAnswers}</p>
        <p>Unattempted Questions: ${unattemptedQuestions}</p>
        <p>Accuracy: ${accuracy}%</p>
      `;
    }

    const pieChartElement = document.getElementById('pie-chart') as HTMLCanvasElement | null;

    if (pieChartElement) {
      const pieChart = new (Chart as any)(pieChartElement, {
        type: 'pie',
        data: {
          labels: ['Correct', 'Incorrect', 'Unattempted'],
          datasets: [
            {
              data: [correctAnswers, incorrectAnswers, unattemptedQuestions],
              backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            },
          ],
        },
        options: {
          responsive: false,
        },
      });
    }
  }

  showError(errorMessage: string) {
    // Implement the logic to show an error message using React components
  }

  render() {
    const { quizData, showResults } = this.state;

    return (
      <div className="quiz-container">
        <h1 style={{ textAlign: "center" }}>MCQ Test</h1>
        <div id="timer">Time Left: <span id="countdown"></span></div>

        {quizData?.questions.map((question, index) => this.displayQuestionCard(question, index))}

        {!showResults && (
          <button
            className="submit-button1"
            id="submit-button"
            onClick={() => this.calculateResults()}
          >
            Submit Test
          </button>
        )}

        <div id="summary-card"></div>
        <div id="pie-chart-card"></div>
      </div>
    );
  }
}

export default TestEnvironment;
