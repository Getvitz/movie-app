import React from 'react';
import { Rate } from 'antd';
import { Component } from 'react/cjs/react.production.min';
import propTypes from 'prop-types';
import apiClient from '../apiClient';

export default class RatingStars extends Component {
  state = {
    rating: 0,
  };

  setRating = (value) => {
    const { sessionId, id } = this.props;
    window.localStorage.setItem(id, JSON.stringify(value));
    this.setState({
      rating: value,
    });
    if (!value) {
      apiClient.deleteRatedMovie(id, sessionId);
      window.localStorage.removeItem(id);
    }
    apiClient.rateMovie(id, sessionId, value);
  };

  render() {
    const { rating } = this.state;
    const { id } = this.props;
    return (
      <Rate
        count="10"
        onChange={(value) => {
          this.setRating(value);
        }}
        value={window.localStorage.getItem(id) ? JSON.parse(window.localStorage.getItem(id)) : rating}
      />
    );
  }
}

RatingStars.propTypes = {
  sessionId: propTypes.string.isRequired,
  id: propTypes.number.isRequired,
};
