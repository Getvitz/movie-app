import React from 'react';
import { Rate } from 'antd';
import { Component } from 'react/cjs/react.production.min';
import propTypes from 'prop-types';
import ApiClient from '../apiClient';

export default class RatingStars extends Component {
  state = {
    // eslint-disable-next-line react/destructuring-assignment, react/prop-types
    rating: `${this.props.rating}`,
  };

  apiClient = new ApiClient();

  setRating = (value) => {
    const { sessionId, id } = this.props;
    this.setState({
      rating: value,
    });
    if (value === 0) this.apiClient.deleteRatedMovie(id, sessionId);
    this.apiClient.rateMovie(id, sessionId, value);
  };

  render() {
    const { rating } = this.state;
    return (
      <Rate
        count="10"
        value={rating}
        onChange={(value) => {
          this.setRating(value);
        }}
      />
    );
  }
}

RatingStars.propTypes = {
  sessionId: propTypes.string.isRequired,
  id: propTypes.number.isRequired,
};
