import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Message from '../components/Message';
import gravatarUrl from '../Api/gravatarUrl';
import { playAgainAction } from '../action';

class Feedback extends React.Component {
  componentDidMount() {
    const { name, score, email } = this.props;

    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    const player = { name, score, picture: gravatarUrl(email) };
    localStorage.setItem('ranking', JSON.stringify([...ranking, player]));
  }

  render() {
    const { score, assertions, dispatch } = this.props;

    return (
      <div>
        <Header />
        <h4 data-testid="feedback-total-score">
          { score }
        </h4>
        <h5 data-testid="feedback-total-question">
          { assertions }
        </h5>
        <Message />
        <Link
          to="/ranking"
        >
          <button
            type="submit"
            data-testid="btn-ranking"
          >
            Ver Ranking
          </button>
        </Link>
        <Link to="/">
          <button
            type="button"
            data-testid="btn-play-again"
            onClick={ () => dispatch(playAgainAction) }
          >
            Play Again
          </button>
        </Link>
      </div>
    );
  }
}

const mapStateToProps = ({ player }) => ({
  name: player.name,
  email: player.gravatarEmail,
  score: player.score,
  assertions: player.assertions,
});

Feedback.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  score: PropTypes.number,
  assertions: PropTypes.number,
  dispatch: PropTypes.func,
}.isRequired;

export default connect(mapStateToProps)(Feedback);
