import React from "react";
import { Component } from "react/cjs/react.production.min";
import { Alert, Spin, Pagination } from "antd";
import { format, parseISO } from 'date-fns';
import propTypes from "prop-types";
import MovieList from "../movieList/movieList";
import "./app.css"
import ApiClient from "../apiClient";
import Header from "../header";
import Search from "../search";
// import Paginations from "../pagination";
import noImageYet from "./no-image-yet.jpg"

export default class App extends Component {
    state = {
        moviesData: [],
        searchInput: '',
        pageNumber: 1,
        pagesTotal: 0,
        loading: true,
        error: false,
    };

    apiClient = new ApiClient();

    componentDidMount() {
        this.getMoviesData();
      }

    getMoviesData = () => {
      const { searchInput, pageNumber } = this.state;
      this.setState({
        moviesData: [],
        loading: true,
        error: false,
      });
      if (searchInput === '') {
        this.apiClient.startMovies(pageNumber).then((movies) => {
          this.setState({
            pagesTotal: movies.total_pages,
            pageNumber,
          });
          movies.results.forEach((element) => {
            this.addMovieToList(element);
            });
        });
      } else {
        this.apiClient
          .searchMovies(searchInput, pageNumber)
          .then((movies) => {
            this.setState({
              pagesTotal: movies.total_pages,
              pageNumber,
            });
            if (movies.results.length === 0) {
              this.setState({
                loading: false,
              });
            }
            movies.results.forEach((elm) => {
             this.addMovieToList(elm);
            });
          })
          .catch(this.onError);
      }
    };

    createMovie = (movie) =>{
        let releaseDate = 'No realease information' 
        if(movie.release_date) {
          releaseDate = format(parseISO(movie.release_date), 'MMMM dd, yyyy');
        }
        let moviePoster = `${noImageYet}` 
        if(movie.poster_path) {
          moviePoster = `${this.apiClient.apiImg}${movie.poster_path}`
        }
        return {
            id: movie.id,
            moviePoster,
            title: movie.title,
            releaseDate,
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

    onSearchInput = (searchInput) => {
      this.setState(
        {
          searchInput,
          pageNumber: 1,
        },
        () => {
          this.getMoviesData();
        }
      );
    }

    onPageChange = (page) => {
    this.setState(
      {
        pageNumber: page,
      },
      () => {
          this.getMoviesData();
        }
    );
    }

  render() {
      const {moviesData, loading, error, pageNumber, pagesTotal} = this.state
      const hasData = !(loading || error)
      const spinner = loading? <Spin tip="Loading..." className="spinner" size='large'/> : null;
      const content = hasData? <MoviesLoaded moviesData={moviesData} pageNumber={pageNumber} pagesTotal={pagesTotal} loading={loading} onPageChange={this.onPageChange} /> : null;
      const showError = error? <Alert message="Error" description="Oops! Something went wrong!" type="error" showIcon /> : null;
    return (
      <div className="container">
        <Header />
        <Search onSearchInput={this.onSearchInput} />
        {spinner}
        {showError}
        {content}
      </div>
    );
}
}

const MoviesLoaded = function MoviesLoaded(props) {
  const {moviesData, pagesTotal, loading, pageNumber, onPageChange} = props
  const pagination =
      pagesTotal > 0 && !loading ? (
        <Pagination
          defaultCurrent={1}
          current={pageNumber}
          total={pagesTotal}
          showSizeChanger={false}
          onChange={onPageChange}
        />
      ) : null;
  return (<>
            <MovieList moviesData={moviesData} />
            {pagination}
          </>
)}

MoviesLoaded.propTypes = {
  moviesData: propTypes.instanceOf(Array).isRequired,
  pageNumber: propTypes.number.isRequired,
  pagesTotal: propTypes.number.isRequired,
  loading: propTypes.bool.isRequired,
  onPageChange: propTypes.func.isRequired
}


