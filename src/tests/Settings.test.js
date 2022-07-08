import React from 'react';
import { screen } from '@testing-library/react';
import Settings from '../pages/Settings';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';

test('Verifica se o texto "Settings" está na tela', () => {
  renderWithRouterAndRedux(<Settings />);

  const text = screen.getByTestId('settings-title');

  expect(text).toBeInTheDocument();
});