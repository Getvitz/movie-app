import React from 'react';
import './movieCard.css';
import { Card, Typography } from 'antd';
import { format, parseISO } from 'date-fns';
import propTypes from 'prop-types';

const MovieCard = ({ moviesData }) => {
    const { Text } = Typography;
    const filmList = moviesData.map((item) => {
      const tag = 'Drama';
      const { moviePoster, id, title, releaseDate, overview } = item;
  
      const releaseDateFormatted = format(parseISO(releaseDate), 'MMMM dd, yyyy');
  
      function reduceOverview(overviewLength, useWordBoundary) {
        if (this.length <= overviewLength) {
          return this;
        }
        const subString = this.substring(0, overviewLength - 1);
        return `${useWordBoundary ? subString.substring(0, subString.lastIndexOf(' ')) : subString}...`;
      }
  
      const overviewReduced = reduceOverview.apply(overview, [170, true]);
  
      return (
        <Card hoverable key={id}>
        <img className="card-img" alt={`poster ${title}`} src={moviePoster} />

        <div className="card-movie-title">{title}</div>

        <Text type="secondary" className="card-release-date">
          {releaseDateFormatted}
        </Text>
        <div className="card-tags">{tag}</div>
        <Text className="card-overview">{overviewReduced}</Text>
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