import React from "react";
import { Component } from "react/cjs/react.production.min";
import MovieList from "../movieList/movieList";
import "./app.css"
import ApiClient from "../apiClient";

export default class App extends Component {
    state = {
        moviesData: []
    };

    apiClient = new ApiClient();

    componentDidMount() {
        this.getMoviesData();
      }
    
      getMoviesData() {
        this.apiClient.getDataFromServer().then((movies) => {
          movies.forEach((element) => {
            this.addMovieToList(element);
          });
        });
      }

    createMovie = (movie) =>{
        const moviePoster = `${this.apiClient.apiImg}${movie.poster_path}`
        return {
            id: movie.id,
            moviePoster,
            title: movie.title,
            releaseDate: movie.release_date,
            overview: movie.overview,
            rating: movie.vote_average
        }
        }

    addMovieToList = (movie) => {
        const newMovie = this.createMovie(movie)
        this.setState(({moviesData}) => { 
            const newMoviesData = [...moviesData, newMovie];
            return {
                moviesData: newMoviesData
        }})
    }

  render() {
      const {moviesData} = this.state
    return (
      <div className="container">
        <MovieList
        moviesData={moviesData} />
      </div>
    );
}
}