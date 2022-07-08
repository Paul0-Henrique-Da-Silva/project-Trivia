export const GET_INFO = 'GET_INFO';
export const UPDATED_SCORE = 'UPDATED_SCORE';
export const UPDATED_ASSERTIONS = 'UPDATED_ASSERTIONS';
export const PLAY_AGAIN = 'PLAY_AGAIN';

export const playAgainAction = {
  type: PLAY_AGAIN,
};

export const playerInfoAction = (payload) => ({
  type: GET_INFO,
  payload,
});

export const updatedScore = (payload) => ({
  type: UPDATED_SCORE,
  payload,
});

export const updatedAssertions = () => ({
  type: UPDATED_ASSERTIONS,
});

export const calculateTheScore = (timer, answer) => (dispatch) => {
  const calculationBasis = 10;
  let difficultyScore = 0;

  if (answer.difficulty === 'easy') {
    difficultyScore = 1;
  } else if (answer.difficulty === 'medium') {
    difficultyScore = 2;
  } else {
    const number = 3;
    difficultyScore = number;
  }

  if (answer.testId === 'correct-answer') {
    const score = calculationBasis + (timer * difficultyScore);
    dispatch(updatedScore(score));
    dispatch(updatedAssertions());
  } else {
    dispatch(updatedScore(0));
  }
};
