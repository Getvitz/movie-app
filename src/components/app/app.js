import React from "react";
import { Component } from "react/cjs/react.production.min";
import { Alert, Spin } from "antd";
import propTypes from "prop-types";
import MovieList from "../movieList/movieList";
import "./app.css"
import ApiClient from "../apiClient";
import Header from "../header";
import Search from "../search";
import Paginations from "../pagination";

export default class App extends Component {
    state = {
        moviesData: [],
        loading: true,
        error: false
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
        })
        .catch(this.onError);
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
                moviesData: newMoviesData,
                loading: false
        }})
    }

    onError = () => {
      this.setState({
        loading: false,
        error: true,
      });
    }

  render() {
      const {moviesData, loading, error} = this.state
      const hasData = !(loading || error)
      const spinner = loading? <Spin tip="Loading..." className="spinner" size='large'/> : null;
      const content = hasData? <MoviesLoaded moviesData={moviesData} /> : null;
      const showError = error? <Alert message="Error" description="Oops! Something went wrong!" type="error" showIcon /> : null;
    return (
      <div className="container">
        <Header />
        <Search placeholder="Type to search..." />
        {spinner}
        {showError}
        {content}
      </div>
    );
}
}

const MoviesLoaded = function MoviesLoaded(props) {
  const {moviesData} = props
  return (<>
            <MovieList
              moviesData={moviesData} />
            <Paginations />
          </>
)}

MoviesLoaded.propTypes = {
  moviesData: propTypes.instanceOf(Array).isRequired
}
