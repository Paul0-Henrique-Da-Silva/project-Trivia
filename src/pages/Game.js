import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import './Game.css';
import { calculateTheScore } from '../action';

const RESPONSE_CODE = 3;
const ONE_SECOND = 1000;
const LAST_QUESTION = 4;

class Game extends React.Component {
  state = {
    questionNumber: 0,
    questions: [],
    answers: [],
    buttonColor: false,
    btnHidden: false,
    timer: 30,
    isDisabled: false,
  }

  async componentDidMount() {
    const token = localStorage.getItem('token');
    // if (token !== null) {
    const gameResponse = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
    const gameData = await gameResponse.json();
    if (gameData.response_code === RESPONSE_CODE) {
      const { history } = this.props;
      localStorage.setItem('token', '');
      history.push('/');
    } else {
      this.setState({
        questions: gameData.results,
        answers: this.handleAnswers(gameData.results) }, this.handleTimer);
    }
    // }
  }

  componentDidUpdate() {
    const { timer } = this.state;
    if (timer === 0) {
      this.handleNext();
    }
  }

  handleNext = () => {
    clearInterval(this.idTimer);
    this.setState({ btnHidden: true, timer: 30 });
  }

  handleTimer = () => {
    this.idTimer = setInterval(() => this.setState((prev) => ({
      timer: prev.timer - 1,
      isDisabled: prev.timer === 1,
    })), ONE_SECOND);
  }

  handleAnswers = (arrayQuestions) => {
    const { questionNumber } = this.state;

    const answers = arrayQuestions[questionNumber].incorrect_answers
      .map((incorrect, index) => ({
        answer: incorrect,
        testId: `wrong-answer-${index}`,
      }));

    const randomNumber = Math.round(Math.random() * answers.length);

    const correctAnswer = {
      answer: arrayQuestions[questionNumber].correct_answer,
      testId: 'correct-answer',
      difficulty: arrayQuestions[questionNumber].difficulty,
    };

    answers.splice(randomNumber, 0, correctAnswer);

    return answers;
  }

  handleClickNext = () => {
    const { questions, questionNumber } = this.state;
    const { history } = this.props;
    if (questionNumber === LAST_QUESTION) {
      history.push('/feedback');
    }
    clearInterval(this.idTimer);

    // this.setState((prev) => ({
    //   questionNumber: prev.questionNumber === prev
    //     .questions.length - 1 ? prev.questionNumber : prev.questionNumber + 1,
    //   buttonColor: false,
    // }), () => this.setState({
    //   answers: this.handleAnswers(questions),
    //   btnHidden: false,
    //   timer: 30,
    //   isDisabled: false,
    // }, this.handleTimer));

    this.setState((prev) => ({
      questionNumber: prev.questionNumber + 1,
      buttonColor: false,
    }), () => this.setState({
      answers: this.handleAnswers(questions),
      btnHidden: false,
      timer: 30,
      isDisabled: false,
    }, this.handleTimer));
  }

  handleClick = (answerObj) => {
    const { timer } = this.state;
    const { updatedScoreState } = this.props;
    this.setState({ btnHidden: true, isDisabled: true, buttonColor: true });
    updatedScoreState(timer, answerObj);
    clearInterval(this.idTimer);
  }

  handleButtonStyle = (answer) => {
    const { buttonColor } = this.state;
    if (buttonColor) {
      if (answer === 'correct-answer') return 'border-green';
      return 'border-red';
    }
    return null;
  }

  render() {
    const { questions, questionNumber, answers, timer,
      isDisabled, btnHidden } = this.state;

    return (
      <div>
        <Header />
        <h3>{timer}</h3>
        <h2 data-testid="question-category">
          {questions.length !== 0 && questions[questionNumber].category}
        </h2>
        <h4 data-testid="question-text">
          {questions.length !== 0 && questions[questionNumber].question}
        </h4>
        <div data-testid="answer-options">
          {answers.map((answerObj, index) => (
            <button
              key={ index }
              type="button"
              className={ this.handleButtonStyle(answerObj.testId) }
              data-testid={ answerObj.testId }
              onClick={ () => this.handleClick(answerObj) }
              disabled={ isDisabled }
            >
              {answerObj.answer}
            </button>
          ))}
        </div>
        <div>
          {btnHidden && (
            <button
              type="submit"
              onClick={ this.handleClickNext }
              data-testid="btn-next"
            >
              Next
            </button>)}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  updatedScoreState: (timer, answer) => (
    dispatch(calculateTheScore(timer, answer))),
});

Game.propTypes = {
  updatedScoreState: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect(null, mapDispatchToProps)(Game);
