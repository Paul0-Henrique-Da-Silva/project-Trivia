import { GET_INFO, PLAY_AGAIN, UPDATED_ASSERTIONS, UPDATED_SCORE } from '../action';

const INITIAL_STATE = {
  name: '',
  assertions: 0,
  score: 0,
  gravatarEmail: '',
};

const player = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case GET_INFO:
    return {
      ...state,
      name: action.payload.name,
      gravatarEmail: action.payload.email,
    };
  case UPDATED_SCORE:
    return {
      ...state,
      score: state.score + action.payload,
    };
  case UPDATED_ASSERTIONS:
    return {
      ...state,
      assertions: state.assertions + 1,
    };
  case PLAY_AGAIN:
    return {
      name: '',
      assertions: 0,
      score: 0,
      gravatarEmail: '',
    };
  default:
    return state;
  }
};

export default player;
