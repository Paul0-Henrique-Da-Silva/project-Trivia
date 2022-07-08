import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { questionsResponse, invalidTokenQuestionsResponse } from './questions';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';

const INITIAL_STATE = {
  player: {
    name: 'Tryber',
    assertions: 0,
    score: 0,
    gravatarEmail: 'teste@teste.com',
  } 
};

const TOKEN = "766c93ee8059300bfa19c560b1ba94595d67200afa2571652f0a88d183b9f67f";

describe('Desenvolva testes para atingir 90% de cobertura da tela de Jogo', () => {
    test('Verifica se quando o token for inválido a pagina é redirecionada para o home, assim como a url da API', async () => {
      
      localStorage.setItem('token',TOKEN);

      jest.spyOn(global, 'fetch')
        .mockResolvedValue({ json: jest.fn().mockResolvedValue(invalidTokenQuestionsResponse) });
      
      const { history } = renderWithRouterAndRedux(<App />, INITIAL_STATE);
      history.push('/game')
      expect(global.fetch).toBeCalledTimes(1);
      expect(global.fetch).toBeCalledWith(
        `https://opentdb.com/api.php?amount=5&token=${TOKEN}`
      );
      await waitFor(() => expect(history.location.pathname).toBe('/'));
      
      global.fetch.mockRestore();
    });

    test('Verifica se a pergunta é renderizada na tela e se o button next aparece após responder a pergunta', async () => {
      localStorage.setItem('token', TOKEN);

      jest.spyOn(global, 'fetch')
        .mockResolvedValue({ json: jest.fn().mockResolvedValue(questionsResponse) });
      
      const { history } = renderWithRouterAndRedux(<App />, INITIAL_STATE);
      history.push('/game')

      const QUESTION_CATEGORY = await screen.findByTestId("question-category");
      const QUESTION_TEXT = await screen.findByTestId("question-text");
      const WRONG_ANSWER_0 = await screen.findByTestId('wrong-answer-0');
      const CORRECT_ANSWER = await screen.findByTestId('correct-answer');
      const BUTTON_NEXT = screen.queryByTestId('btn-next');
      
      expect(QUESTION_CATEGORY).toBeInTheDocument();
      expect(QUESTION_CATEGORY.textContent).toBe('Geography');
      expect(QUESTION_TEXT).toBeInTheDocument();
      expect(QUESTION_TEXT.textContent).toBe('The Republic of Malta is the smallest microstate worldwide.');
      expect(WRONG_ANSWER_0).toBeInTheDocument();
      expect(WRONG_ANSWER_0.textContent).toBe('True');
      expect(CORRECT_ANSWER).toBeInTheDocument();
      expect(CORRECT_ANSWER.textContent).toBe('False');
      expect(BUTTON_NEXT).not.toBeInTheDocument();
      
      userEvent.click(CORRECT_ANSWER);

      expect(CORRECT_ANSWER).toBeDisabled();
      
      const BUTTON_NEXT_ABLE = screen.getByTestId('btn-next');
      expect(BUTTON_NEXT_ABLE).toBeInTheDocument();
    });

    test('Verifica se ao clicar em next e renderizado uma nova pergunta na tela', async () => {
      const { history } = renderWithRouterAndRedux(<App />, INITIAL_STATE);
      history.push('/game')

      const CORRECT_ANSWER = await screen.findByTestId('correct-answer');

      userEvent.click(CORRECT_ANSWER);

      const BUTTON_NEXT_ABLE = screen.getByTestId('btn-next');

      userEvent.click(BUTTON_NEXT_ABLE);

      const QUESTION_CATEGORY = screen.getByTestId("question-category");
      const QUESTION_TEXT = screen.getByTestId("question-text");
      const WRONG_ANSWER_0 = screen.getByTestId('wrong-answer-0');
      const WRONG_ANSWER_1 = screen.getByTestId('wrong-answer-1');
      const WRONG_ANSWER_2 = screen.getByTestId('wrong-answer-2');
      const CORRECT_ANSWER_2 =  screen.getByTestId('correct-answer');
      const BUTTON_NEXT = screen.queryByTestId('btn-next');

      expect(QUESTION_CATEGORY).toBeInTheDocument();
      expect(QUESTION_CATEGORY.textContent).toBe('Science & Nature');
      expect(QUESTION_TEXT).toBeInTheDocument();
      expect(QUESTION_TEXT.textContent).toBe('In quantum physics, which of these theorised sub-atomic particles has yet to be observed?');
      expect(WRONG_ANSWER_0).toBeInTheDocument();
      expect(WRONG_ANSWER_0.textContent).toBe('Z boson');
      expect(WRONG_ANSWER_1).toBeInTheDocument();
      expect(WRONG_ANSWER_1.textContent).toBe('Tau neutrino');
      expect(WRONG_ANSWER_2).toBeInTheDocument();
      expect(WRONG_ANSWER_2.textContent).toBe('Gluon');
      expect(CORRECT_ANSWER_2).toBeInTheDocument();
      expect(CORRECT_ANSWER_2.textContent).toBe('Graviton');
      expect(BUTTON_NEXT).not.toBeInTheDocument();

    });

    test('Verifica se o timer é de 30 segundos, se o button de resposta é desabilitado, e se o next aparece na tela', async () => {
      jest.useFakeTimers();
      jest.spyOn(global, 'setInterval');

      const { history } = renderWithRouterAndRedux(<App />, INITIAL_STATE);
      history.push('/game')
      
      const timer30 = await screen.findByRole('heading', {  name: /30/i})
      const CORRECT_ANSWER = screen.getByTestId('correct-answer');
      const BUTTON_NEXT = screen.queryByTestId('btn-next');
      
      expect(setInterval).toHaveBeenCalledTimes(1);
      expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000)
      expect(timer30).toBeInTheDocument();
      expect(CORRECT_ANSWER).not.toBeDisabled();
      expect(BUTTON_NEXT).not.toBeInTheDocument();

      jest.advanceTimersByTime(30000);

      const timer0 = screen.getByRole('heading', {  name: /30/i})
      
      expect(timer0).toBeInTheDocument();
      expect(CORRECT_ANSWER).toBeDisabled();
      const BUTTON_NEXT_ABLE = screen.getByTestId('btn-next');
      expect(BUTTON_NEXT_ABLE).toBeInTheDocument();
    });
});