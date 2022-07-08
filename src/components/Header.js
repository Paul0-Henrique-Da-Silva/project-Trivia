import { PropTypes } from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import gravatarUrl from '../Api/gravatarUrl';

class Header extends React.Component {
  render() {
    const { name, score, email } = this.props;

    return (
      <div>
        <img
          data-testid="header-profile-picture"
          alt="Gravatar"
          src={ gravatarUrl(email) }
        />
        <h3 data-testid="header-player-name">
          { name }
        </h3>
        <h2 data-testid="header-score">
          { score }
        </h2>
      </div>
    );
  }
}

const mapStateToProps = ({ player }) => ({
  name: player.name,
  email: player.gravatarEmail,
  score: player.score,
});

Header.propTypes = {
  email: PropTypes.string,
  name: PropTypes.string,
  score: PropTypes.number,
}.isRequired;

export default connect(mapStateToProps)(Header);
