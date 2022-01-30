import React from 'react';
import { Component } from 'react/cjs/react.production.min';
import { Alert, Spin, Pagination, Empty } from 'antd';
import { format, parseISO } from 'date-fns';
import propTypes from 'prop-types';
import Context from '../context';
import MovieList from '../movieList/movieList';
import './app.css';
import apiClient from '../apiClient';
import Header from '../header';
import Search from '../search';
import noImageYet from './no-image-yet.jpg';

export default class App extends Component {
  state = {
    moviesData: [],
    ratedFilms: [],
    genres: [],
    searchInput: '',
    pageNumber: 1,
    pagesTotal: 0,
    loading: true,
    error: false,
    sessionId: window.localStorage.getItem('sessionId') ? JSON.parse(window.localStorage.getItem('sessionId')) : '',
    searchOn: true,
    mode: 'showdefault',
    noData: false
  };

  componentDidMount() {
    const {sessionId} = this.state;
    if(!sessionId) this.createGuestSession();
    this.getGenresList();
    this.getMoviesData();
  }

  getMoviesData = () => {
    const { searchInput, pageNumber } = this.state;
    this.setState({
      moviesData: [],
      loading: true,
      error: false,
      noData: false
    });
    if (!searchInput) {
      apiClient.startMovies(pageNumber).then((movies) => {
        this.setState({
          pagesTotal: movies.total_pages,
          pageNumber,
        });
        movies.results.forEach((element) => {
          this.addMovieToList(element);
        });
      });
    } else {
      apiClient
        .searchMovies(searchInput, pageNumber)
        .then((movies) => {
          this.setState({
            pagesTotal: movies.total_pages,
            pageNumber,
          });
          if (movies.results.length === 0) {
            this.setState({
              loading: false,
              noData: true
            });
          }
          movies.results.forEach((elm) => {
            this.addMovieToList(elm);
          });
        })
        .catch(this.onError);
    }
  };

  createGuestSession = async () => {
    this.setState({
      sessionId: window.localStorage.getItem('sessionId') ? JSON.parse(window.localStorage.getItem('sessionId')) : '',
    })
    const {sessionId} = this.state;
    if(!sessionId) { 
    const url = apiClient.apiGuestSession;
    const body = await apiClient.getDataFromServer(url);
    window.localStorage.setItem('sessionId', JSON.stringify(body.guest_session_id));
    this.setState({
      sessionId: body.guest_session_id,
    });
  }
  };

  getRatedMovies = async () => {
    const { sessionId, pageNumber } = this.state;
    this.setState({
      ratedFilms: [],
      loading: true,
      error: false,
      noData: false
    });
    apiClient
      .getRatedFilms(sessionId, pageNumber)
      .then((movies) => {
        this.setState({
          pagesTotal: movies.total_pages,
          pageNumber,
        });
        movies.results.forEach((movie) => {
          this.addRatedToList(movie);
        });
        if (movies.results.length === 0) {
          this.setState({
            loading: false,
            noData: true
          });
        }
      })
      .catch(this.onError);
  };

  getGenresList = () => {
    apiClient
      .getGenresList()
      .then((body) => {
        this.setState({
          genres: [...body.genres],
        });
      })
      .catch(this.onError);
  };

  getGenres = (ids) => {
    const filmGenres = [];
    const { genres } = this.state;
    for (const genreId of ids) {
      genres.forEach((el) => {
        if (el.id === genreId) {
          filmGenres.push(el.name);
        }
      });
    }
    return filmGenres;
  };

  onTabsChange = (key) => {
    if (key === 'search') {
      this.setState(
        {
          searchOn: true,
          mode: 'showdefault',
        },
        () => {
          this.getMoviesData();
        }
      );
    }
    if (key === 'rated') {
      this.setState(
        {
          searchOn: false,
          mode: 'showrated',
        },
        () => {
          this.getRatedMovies();
        }
      );
    }
  };

  createMovie = (movie) => {
    let releaseDate = 'No realease information';
    if (movie.release_date) {
      releaseDate = format(parseISO(movie.release_date), 'MMMM dd, yyyy');
    }
    let moviePoster = `${noImageYet}`;
    if (movie.poster_path) {
      moviePoster = `${apiClient.apiImg}${movie.poster_path}`;
    }
    const filmGenres = this.getGenres(movie.genre_ids);
    return {
      id: movie.id,
      moviePoster,
      title: movie.title,
      releaseDate,
      overview: movie.overview,
      rating: window.localStorage.getItem(movie.id) ? JSON.parse(window.localStorage.getItem(movie.id)) : 0,
      popularity: movie.vote_average,
      genres: filmGenres,
    };
  };

  addMovieToList = (movie) => {
    const newMovie = this.createMovie(movie);
    this.setState(({ moviesData }) => {
      const newMoviesData = [...moviesData, newMovie];
      return {
        moviesData: newMoviesData,
        loading: false,
      };
    });
  };

  addRatedToList = (movie) => {
    if (movie.rating > 1) {
      const newRatedMovie = this.createMovie(movie);
      this.setState(({ ratedFilms }) => {
        const newRatedMoviesData = [...ratedFilms, newRatedMovie];
        return {
          ratedFilms: newRatedMoviesData,
          loading: false,
        };
      });
    }
    else {
      this.setState({
        loading: false
      })
    }
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
      noData: false
    });
  };

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
  };

  onPageChange = (page) => {
    this.setState(
      {
        pageNumber: page,
      },
      () => {
        this.getMoviesData();
      }
    );
  };

  render() {
    const { moviesData, ratedFilms, loading, error, pageNumber, pagesTotal, searchOn, sessionId, mode, noData } = this.state;
    const contextValue = { moviesData, ratedFilms, mode, sessionId };
    const hasData = !(loading && noData || error);
    const spinner = loading ? <Spin tip="Loading..." className="spinner" size="large" /> : null;
    const content = hasData && !noData? (
      <MoviesLoaded
        pageNumber={pageNumber}
        pagesTotal={pagesTotal}
        loading={loading}
        onPageChange={this.onPageChange}
      />
    ) : (<Empty />);
    const showError = error && (<Alert message="Error" description="Oops! Something went wrong!" type="error" showIcon />);
    
    return (
      <div className="container">
        <Context.Provider value={contextValue}>
          <Header onTabsChange={this.onTabsChange} />
          {searchOn ? <Search onSearchInput={this.onSearchInput} /> : null}
          {spinner}
          {showError}
          {content}
        </Context.Provider>
      </div>
    );
  }
}

const MoviesLoaded = function MoviesLoaded(props) {
  const { pagesTotal, loading, pageNumber, onPageChange } = props;
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
  return (
    <>
      <MovieList />
      {pagination}
    </>
  );
};

MoviesLoaded.propTypes = {
  pageNumber: propTypes.number.isRequired,
  pagesTotal: propTypes.number.isRequired,
  loading: propTypes.bool.isRequired,
  onPageChange: propTypes.func.isRequired,
};
