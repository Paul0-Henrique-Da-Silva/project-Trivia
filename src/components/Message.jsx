import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Message extends Component {
  render() {
    const { assertions } = this.props;
    const number = 3;

    return (
      <div>
        <p data-testid="feedback-text">
          { assertions < number ? 'Could be better...' : 'Well Done!'}
        </p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    assertions: state.player.assertions,
  };
}

Message.propTypes = {
  assertions: PropTypes.number.isRequired,
};

export default connect(
  mapStateToProps,
)(Message);
