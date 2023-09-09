import React, { useState, useEffect } from 'react';
import './TestEnvironment.css';
import data from './questions.json';
import CountdownTimer from '../CountDownTimer/CountDownTimer';

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

interface SelectedOptionsMap extends Map<number, string> {}

const TestEnvironment: React.FC = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsMap>(new Map());
  const [showResults, setShowResults] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<number>(0);
  const [skippedQuestions, setSkippedQuestions] = useState<number>(0);
  const [timerEnded, setTimerEnded] = useState<boolean>(false);

  useEffect(() => {
    const fetchedQuizData: QuizData = data;
    setQuizData(fetchedQuizData);
  }, []);

  const handleOptionChange = (questionIndex: number, selectedValue: string) => {
    setSelectedOptions((prevSelectedOptions) => {
      const selectedOptions = new Map(prevSelectedOptions);
      selectedOptions.set(questionIndex, selectedValue);
      return selectedOptions;
    });
  };

  const navigateToQuestion = (direction: 'prev' | 'next') => {
    if (!showResults) {
      setCurrentQuestion((prevCurrentQuestion) => {
        if (direction === 'prev' && prevCurrentQuestion > 0) {
          return prevCurrentQuestion - 1;
        } else if (direction === 'next' && prevCurrentQuestion < data.questions.length - 1) {
          return prevCurrentQuestion + 1;
        }
        return prevCurrentQuestion;
      });
    }
  };

  const calculateResults = () => {
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    quizData?.questions.forEach((question, index) => {
      const selectedOption = selectedOptions.get(index);
      if (selectedOption) {
        const selectedQuestion = question.options.find((option) => option.value === selectedOption);
        if (selectedQuestion && selectedQuestion.correct) {
          correct++;
        } else {
          incorrect++;
        }
      } else {
        skipped++;
      }
    });

    setCorrectAnswers(correct);
    setIncorrectAnswers(incorrect);
    setSkippedQuestions(skipped);

    setShowResults(true);
    setTimerEnded(true); // Stop the timer when showing results
  };

  const handleTimerEnd = () => {
    setTimerEnded(true);
    calculateResults();
  };

  if (!quizData) {
    return null;
  }

  const question = quizData.questions[currentQuestion];

  return (
    <div className="quiz-container">
      <h1 className="title11">MCQ Test</h1>
      {!timerEnded && <CountdownTimer onTimerEnd={handleTimerEnd} />}
      <div className="question-card">
        <div className="question">{question.text}</div>
        <div className="options">
          {question.options.map((option, index) => (
            <label className="option" key={option.value}>
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={option.value}
                checked={selectedOptions.get(currentQuestion) === option.value}
                onChange={() => handleOptionChange(currentQuestion, option.value)}
              />
              {option.text}
            </label>
          ))}
        </div>
        <button className="clear-button" onClick={() => handleOptionChange(currentQuestion, '')}>
          Clear Options
        </button>
      </div>

      <div className="navigation">
        <button
          className="prev-button"
          onClick={() => navigateToQuestion('prev')}
          disabled={currentQuestion === 0 || showResults}
        >
          Previous
        </button>
        <button
          className="next-button"
          onClick={() => navigateToQuestion('next')}
          disabled={currentQuestion === quizData.questions.length - 1 || showResults}
        >
          Next
        </button>
      </div>

      {currentQuestion === quizData.questions.length - 1 && !showResults && (
        <button className="submit-button1" onClick={() => calculateResults()}>
          Submit Test
        </button>
      )}

      {showResults && (
        <div className="summary">
          <h2 className='summary-statistics'>Summary</h2>
          <p className='summary-statistics'>Total Questions: {quizData.questions.length}</p>
          <p className='summary-statistics'>Correct Answers: {correctAnswers}</p>
          <p className='summary-statistics'>Incorrect Answers: {incorrectAnswers}</p>
          <p className='summary-statistics'>Skipped Questions: {skippedQuestions}</p>
        </div>
      )}
    </div>
  );
};

export default TestEnvironment;
