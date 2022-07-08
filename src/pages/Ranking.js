import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { playAgainAction } from '../action';

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
      <div>
        <h1 data-testid="ranking-title">Ranking</h1>
        {ranking.map((player, index) => (
          <div key={ index }>
            <img src={ player.picture } alt="Player" />
            <p data-testid={ `player-name-${index}` }>{player.name}</p>
            <p data-testid={ `player-score-${index}` }>{player.score}</p>
          </div>
        ))}
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
