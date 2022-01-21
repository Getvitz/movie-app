import React, { useContext } from 'react';
import './movieCard.css';
import { Card, Typography, Tag } from 'antd';
import propTypes from 'prop-types';
import classNames from 'classnames';
import Context from '../context';
import RatingStars from '../ratingStars/ratingStars';

const MovieCard = () => {
  const { Text } = Typography;
  const { moviesData, ratedFilms, sessionId, mode } = useContext(Context);
  const dataToRender = mode === 'showdefault' ? moviesData : ratedFilms;
  const filmList = dataToRender.map((movie) => {
    const { moviePoster, id, title, releaseDate, overview, popularity, rating, genres } = movie;

    function reduceOverview(overviewLength, useWordBoundary) {
      if (this.length <= overviewLength) {
        return this;
      }
      const subString = this.substring(0, overviewLength - 1);
      return `${useWordBoundary ? subString.substring(0, subString.lastIndexOf(' ')) : subString}...`;
    }

    const overviewReduced = reduceOverview.apply(overview, [170, true]);

    const filmGenres = (
      <>
        {/* eslint-disable-next-line arrow-body-style */}
        {genres.map((genre) => {
          return (
            <Tag className="card-genres-tag" key={genre}>
              {genre}
            </Tag>
          );
        })}
      </>
    );

    return (
      <Card hoverable key={id}>
        <img className="card-img" alt={`poster ${title}`} src={moviePoster} />

        <div className="card-movie-title">{title}</div>
        <span
          className={classNames(
            'card-popularity-count',
            { orange: popularity >= 3 && popularity < 5 },
            { yellow: popularity >= 5 && popularity < 7 },
            { green: popularity >= 7 }
          )}
        >
          {popularity}
        </span>
        <Text type="secondary" className="card-release-date">
          {releaseDate}
        </Text>
        <div className="card-tags">{filmGenres}</div>
        <Text className="card-overview">{overviewReduced}</Text>
        <RatingStars sessionId={sessionId} id={id} rating={rating} />
      </Card>
    );
  });

  return filmList;
};
MovieCard.defaultProps = {
  moviesData: [],
};
MovieCard.propTypes = {
  moviesData: propTypes.instanceOf(Array),
};
export default MovieCard;
