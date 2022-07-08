import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import App from "../App";
import Ranking from "../pages/Ranking";
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";

describe("Testando Componente <Ranking />", () => {
  test("Titulo 'Ranking' na tela", () => {
    renderWithRouterAndRedux(<Ranking />);
    const title = screen.getByRole('heading', { name: /Ranking/i });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Ranking');
  });
  test("Botão escrito 'voltar inicio'", () => {
    renderWithRouterAndRedux(<Ranking />);
    expect(screen.getByRole('button', { name: /voltar inicio/i })).toBeInTheDocument();
  });
  test('Verificar Player Ranking', async () => {
    const INITIAL_STATE = {
      player: {
        name: '',
        assertions: 0,
        score: 0,
        gravatarEmail: '',
      }
    };
    const MOCK_TOKEN = {
      response_code: 0,
      response_message: "Token Generated Successfully!",
      token: "766c93ee8059300bfa19c560b1ba94595d67200afa2571652f0a88d183b9f67f",
    };

    const MOCK_QUESTIONS = {
      "response_code": 0,
      "results": [
        {
          "category": "Entertainment: Video Games",
          "type": "multiple",
          "difficulty": "easy",
          "question": "In Kingdom Hearts, how many members does Organization XIII have in total?",
          "correct_answer": "14",
          "incorrect_answers": [
            "10",
            "13",
            "12"
          ]
        },
        {
          "category": "Science: Computers",
          "type": "multiple",
          "difficulty": "easy",
          "question": "How many kilobytes in one gigabyte (in decimal)?",
          "correct_answer": "1000000",
          "incorrect_answers": [
            "1024",
            "1000",
            "1048576"
          ]
        },
        {
          "category": "Entertainment: Film",
          "type": "multiple",
          "difficulty": "hard",
          "question": "In the &quot;Jurassic Park&quot; universe, what was the first dinosaur cloned by InGen in 1986?",
          "correct_answer": "Velociraptor",
          "incorrect_answers": [
            "Triceratops",
            "Troodon",
            "Brachiosaurus"
          ]
        },
        {
          "category": "Entertainment: Music",
          "type": "multiple",
          "difficulty": "medium",
          "question": "Which novelty band was best known for their UK chart hits &quot;Combine Harvester&quot; and &quot;I Am a Cider Drinker&quot; in 1976?",
          "correct_answer": "The Wurzels",
          "incorrect_answers": [
            "Goldie Lookin Chain",
            "Bonzo Dog Doo-Dah Band",
            "The Firm"
          ]
        },
        {
          "category": "Entertainment: Film",
          "type": "multiple",
          "difficulty": "medium",
          "question": "About how much money did it cost for Tommy Wiseau to make his masterpiece &quot;The Room&quot; (2003)?",
          "correct_answer": "$6 Million",
          "incorrect_answers": [
            "$20,000",
            "$1 Million",
            "$10 Million"
          ]
        }
      ]
    };

    jest.spyOn(global, 'fetch').mockImplementation(async (url) => {
      if (url === 'https://opentdb.com/api_token.php?command=request') {
        return { json: jest.fn().mockResolvedValue(MOCK_TOKEN) };
      }
      return { json: jest.fn().mockResolvedValue(MOCK_QUESTIONS) };
    });

    const { history } = renderWithRouterAndRedux(<App />, INITIAL_STATE);
    const inputname = screen.getByTestId("input-player-name");
    userEvent.type(inputname, 'testeInput');
    const inputemail = screen.getByTestId("input-gravatar-email");
    userEvent.type(inputemail, 'teste@teste.com');
    const buttonPlay = screen.getByTestId("btn-play");
    userEvent.click(buttonPlay);

    const buttonGame = await screen.findByTestId("correct-answer", {}, { timeout: 7000 });
    userEvent.click(buttonGame);
    userEvent.click(screen.getByTestId("btn-next"));
    userEvent.click(buttonGame);
    userEvent.click(screen.getByTestId("btn-next"));
    userEvent.click(buttonGame);
    userEvent.click(screen.getByTestId("btn-next"));
    userEvent.click(buttonGame);
    userEvent.click(screen.getByTestId("btn-next"));
    userEvent.click(buttonGame);
    userEvent.click(screen.getByTestId("btn-next"));
    const btnRanking = screen.getByTestId('btn-ranking');
    userEvent.click(btnRanking);
    expect(history.location.pathname).toBe('/ranking');
    const imgPlayer = screen.getByAltText('Player');
    expect(imgPlayer).toBeInTheDocument();
    const namePlayer = screen.getByTestId('player-name-0');
    expect(namePlayer).toHaveTextContent('testeInput');
    const scorePlayer = screen.getByTestId('player-score-0');
    expect(scorePlayer).toBeInTheDocument();
    const buttonHome = screen.getByTestId('btn-go-home');
    userEvent.click(buttonHome);
    expect(history.location.pathname).toBe('/');
    expect(imgPlayer).not.toBeInTheDocument();
    expect(namePlayer).not.toBeInTheDocument();
    expect(scorePlayer).not.toBeInTheDocument();
    jest.restoreAllMocks();
  }, 10000);

  test("Verificar dados dos Players no Ranking", () => {
    localStorage.setItem('ranking', JSON.stringify([
      {
        "name": "Player01",
        "score": 91,
        "picture": "https://www.gravatar.com/avatar/cd63179c2e339fa99aacb5946652b267"
      },
      {
        "name": "Player02",
        "score": 216,
        "picture": "https://www.gravatar.com/avatar/f94b1607e1b77b78578d5461222235d0"
      }
    ]));
    renderWithRouterAndRedux(<Ranking />);
    const imgPlayers = screen.getAllByAltText('Player');
    expect(imgPlayers).toHaveLength(2);

    const namePlayer1 = screen.getByTestId('player-name-1');
    expect(namePlayer1).toBeInTheDocument();
    expect(namePlayer1).toHaveTextContent('Player01');

    const scorePlayer1 = screen.getByTestId('player-score-1');
    expect(scorePlayer1).toBeInTheDocument();
    expect(scorePlayer1).toHaveTextContent('91');

    const namePlayer2 = screen.getByTestId('player-name-0');
    expect(namePlayer2).toBeInTheDocument();
    expect(namePlayer2).toHaveTextContent('Player02');

    const scorePlayer2 = screen.getByTestId('player-score-0');
    expect(scorePlayer2).toBeInTheDocument();
    expect(scorePlayer2).toHaveTextContent('216');
  });
})
