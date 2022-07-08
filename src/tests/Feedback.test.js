import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Feedback from '../pages/Feedback'
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux'



const INITIAL_STATE = {
  player: {
    name: 'Tryber',
    assertions: 2,
    score: 300,
    gravatarEmail: 'teste@teste.com',
  } 
};

const INITIAL_STATE_2 = {
  player: {
    name: 'Tryber',
    assertions: 5,
    score: 560,
    gravatarEmail: 'teste@teste.com',
  } 
};

const INITIAL_STATE_CLEAR = {
  player: {
    name: '',
    assertions: 0,
    score: 0,
    gravatarEmail: '',
  } 
};

describe('Desenvolva testes para atingir 90% de cobertura da tela de Feedbacks', () => {
  test('Verifica os elementos HEADER na tela', () => {
    renderWithRouterAndRedux(<Feedback />, INITIAL_STATE, "/feedback")

    const url = "https://www.gravatar.com/avatar/ce11fce876c93ed5d2a72da660496473";

    const HEADER_PROFILE_PICTURE = screen.getByRole('img', { name: /gravatar/i });
    const HEADER_PLAYER_NAME = screen.getByTestId('header-player-name');
    const HEADER_SCORE = screen.getByTestId('header-score');

    expect(HEADER_PROFILE_PICTURE).toBeInTheDocument();
    expect(HEADER_PROFILE_PICTURE).toHaveAttribute('src', url);
    expect(HEADER_PLAYER_NAME).toBeInTheDocument();
    expect(HEADER_PLAYER_NAME.textContent).toBe('Tryber');
    expect(HEADER_SCORE ).toBeInTheDocument();
    expect(HEADER_SCORE .textContent).toBe('300');
  });

  test('Verifica o score e o assertions igual a 2', () => {
    renderWithRouterAndRedux(<Feedback />, INITIAL_STATE, "/feedback");

    const FEEDBACK_TOTAL_SCORE = screen.getByTestId('feedback-total-score');
    const FEEDBACK_TOTAL_QUESTION = screen.getByTestId('feedback-total-question');
    const FEEDBACK_TEXT = screen.getByText(/could be better\.\.\./i);

    expect(FEEDBACK_TOTAL_SCORE).toBeInTheDocument();
    expect(FEEDBACK_TOTAL_SCORE.textContent).toBe('300');
    expect(FEEDBACK_TOTAL_QUESTION).toBeInTheDocument();
    expect(FEEDBACK_TOTAL_QUESTION.textContent).toBe('2');
    expect(FEEDBACK_TEXT).toBeInTheDocument();
  });

  test('Verifica o score e o assertions igual a 5', () => {
    renderWithRouterAndRedux(<Feedback />, INITIAL_STATE_2, "/feedback");

    const FEEDBACK_TOTAL_SCORE = screen.getByTestId('feedback-total-score');
    const FEEDBACK_TOTAL_QUESTION = screen.getByTestId('feedback-total-question');
    const FEEDBACK_TEXT = screen.getByText(/Well Done!/i)

    expect(FEEDBACK_TOTAL_SCORE).toBeInTheDocument();
    expect(FEEDBACK_TOTAL_SCORE.textContent).toBe('560');
    expect(FEEDBACK_TOTAL_QUESTION).toBeInTheDocument();
    expect(FEEDBACK_TOTAL_QUESTION.textContent).toBe('5');
    expect(FEEDBACK_TEXT).toBeInTheDocument();
  });

  test('Verifica o button Ver Ranking', () => {
    const { history } = renderWithRouterAndRedux(<Feedback />, INITIAL_STATE_2, "/feedback");

    const BUTTON_RANKING = screen.getByRole('button', {  name: /ver ranking/i});

    expect(BUTTON_RANKING).toBeInTheDocument();

    userEvent.click(BUTTON_RANKING);

    expect(history.location.pathname).toBe('/ranking');
  });

  test('Verifica o Play Again', () => {
    const { history,
      store } = renderWithRouterAndRedux(<Feedback />, INITIAL_STATE_2, "/feedback");

    const BUTTON_PLAY_AGAIN = screen.getByRole('button', {  name: /play again/i});

    expect(BUTTON_PLAY_AGAIN).toBeInTheDocument();

    userEvent.click(BUTTON_PLAY_AGAIN);
 
    expect(history.location.pathname).toBe('/');
    expect(store.getState()).toEqual(INITIAL_STATE_CLEAR);
  });
});