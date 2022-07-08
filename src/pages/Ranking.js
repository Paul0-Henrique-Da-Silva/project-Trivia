import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { playAgainAction } from '../action';
import './Ranking.css';

class Ranking extends React.Component {
  state = {
    ranking: [],
  }

  componentDidMount() {
    const getRanking = JSON.parse(localStorage.getItem('ranking')) || [];
    const ranking = getRanking.sort((a, b) => b.score - a.score);
    this.setState({ ranking });
  }

  goHome = () => {
    const { history, dispatch } = this.props;
    dispatch(playAgainAction);
    history.push('/');
  }

  render() {
    const { ranking } = this.state;

    return (
      <div className="container">
        <div className="ranking">
          <h1 data-testid="ranking-title">Ranking</h1>
          {ranking.map((player, index) => (
            <div className="clasificacao" key={ index }>
              <img src={ player.picture } alt="Player" />
              <p data-testid={ `player-name-${index}` }>{player.name}</p>
              <p className="score" data-testid={ `player-score-${index}` }>{player.score}</p>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={ this.goHome }
          data-testid="btn-go-home"
        >
          Voltar inicio
        </button>
      </div>

    );
  }
}

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  dispatch: PropTypes.func,
}.isRequired;

export default connect()(Ranking);
