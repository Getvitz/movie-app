import React from 'react';
import './movieList.css';
import MovieCard from '../movieCard';

const MovieList = function MovieList() {
  return (
    <div className="card-list">
      <MovieCard />
    </div>
  );
};

export default MovieList;
