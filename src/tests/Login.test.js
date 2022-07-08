import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App'
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux'

const MOCK_TOKEN = {
  response_code: 0,
  response_message: "Token Generated Successfully!",
  token: "766c93ee8059300bfa19c560b1ba94595d67200afa2571652f0a88d183b9f67f",
};

describe('Desenvolva testes para atingir 90% de cobertura da tela de Login', () => {
  test('Verifica se a rota do Login', () => {
    const { history } = renderWithRouterAndRedux(<App />);

    expect(history.location.pathname).toBe('/');
  });
  test('Verifica se o input name e email estão sendo exibidos na tela', () => {
    renderWithRouterAndRedux(<App />)

    const inputEmail = screen.getByTestId('input-gravatar-email');
    const inputName = screen.getByTestId('input-player-name');
    const settings = screen.getByTestId('btn-settings')

    expect(inputEmail).toBeInTheDocument();
    expect(inputName).toBeInTheDocument();
    expect(settings).toBeInTheDocument();
  });

  test('Verifica os dados recebidos pelos inputs habilitam o button de play', async () => {
    jest.spyOn(global, 'fetch')
      .mockResolvedValue({ json: jest.fn().mockResolvedValue(MOCK_TOKEN) });

    const { history } = renderWithRouterAndRedux(<App />)

    const inputEmail = screen.getByTestId('input-gravatar-email');
    const inputName = screen.getByTestId('input-player-name');
    const button = screen.getByTestId('btn-play');

    expect(button).toBeDisabled();

    userEvent.type(inputEmail, 'teste@teste.com');
    expect(inputEmail).toHaveValue('teste@teste.com');
    userEvent.type(inputName, 'Trybe');
    expect(inputName).toHaveValue('Trybe');

    expect(button).not.toBeDisabled();

    userEvent.click(button);

    expect(global.fetch).toBeCalledTimes(1);
    expect(global.fetch).toBeCalledWith(
      'https://opentdb.com/api_token.php?command=request',
    );

    global.fetch.mockRestore();

    await waitFor(() => expect(history.location.pathname).toBe('/game'), 2000);
  })
})