import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { playerInfoAction } from '../action';

class Login extends React.Component {
  state = {
    name: '',
    email: '',
    isDisabled: true,
  }

  handleDisabled = () => {
    const { name, email } = this.state;
    if (name.length !== 0 && email.length !== 0) {
      this.setState({ isDisabled: false });
    } else {
      this.setState({ isDisabled: true });
    }
  }

  handleChange = ({ target: { id, value } }) => {
    this.setState({ [id]: value }, this.handleDisabled);
  }

  startTheGame = async (event) => {
    event.preventDefault();
    const { history, getPlayerInfo } = this.props;
    const response = await fetch('https://opentdb.com/api_token.php?command=request');
    const data = await response.json();
    getPlayerInfo({ ...this.state });
    localStorage.setItem('token', data.token);
    history.push('/game');
  }

  render() {
    const { name, email, isDisabled } = this.state;
    return (
      <div>
        <form onSubmit={ this.startTheGame }>
          <label htmlFor="name">
            Name:
            <input
              type="text"
              id="name"
              onChange={ this.handleChange }
              value={ name }
              data-testid="input-player-name"
            />
          </label>

          <label htmlFor="email">
            Email:
            <input
              type="text"
              id="email"
              onChange={ this.handleChange }
              value={ email }
              data-testid="input-gravatar-email"
            />
          </label>
          <button
            type="submit"
            data-testid="btn-play"
            disabled={ isDisabled }
          >
            Play
          </button>
          <Link
            to="/settings"
          >
            <button type="button" data-testid="btn-settings">Settings</button>
          </Link>
        </form>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getPlayerInfo: (data) => dispatch(playerInfoAction(data)),
  };
}

Login.propTypes = {
  getPlayerInfo: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
