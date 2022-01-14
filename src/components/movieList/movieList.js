import React from 'react';
import './movieList.css';
import propTypes from 'prop-types';
import MovieCard from '../movieCard';

const MovieList = function MovieList (props) {
    const {moviesData} = props
  return(
    <div className="card-list">
        <MovieCard moviesData={moviesData} />
    </div>
  )};

export default MovieList;

MovieList.defaultProps = {
    moviesData: []
}

MovieList.propTypes = {
    moviesData: propTypes.instanceOf(Array)
}

