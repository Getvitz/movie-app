export default class ApiClient {
  apiKey = 'api_key=2e3929e3fdbe72846ccea38bd13b28b2';

  apiBase = 'https://api.themoviedb.org/3';

  apiStart = `${this.apiBase}/discover/movie?sort_by=popularity.desc&${this.apiKey}`;

  apiSearch = `${this.apiBase}/search/movie?${this.apiKey}&language=en-US&page=1&include_adult=false&query=`;

  apiImg = 'https://image.tmdb.org/t/p/w500/';

  apiGuestSession = `${this.apiBase}/authentication/guest_session/new?${this.apiKey}`;

  getDataFromServer = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`${res.status}`);
      }
      return await res.json();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Cant load data from DataBase: ', err.message);
      return err.message;
    }
  };

  searchMovies = async (searchInput, pageNumber = 1) => {
    const url = `${this.apiSearch}${searchInput}&page=${pageNumber}`;
    const body = await this.getDataFromServer(url);
    return body;
  };

  startMovies = async (pageNumber = 1) => {
    const url = `${this.apiStart}&page=${pageNumber}`;
    const body = await this.getDataFromServer(url);
    return body;
  };

  rateMovie = async (id, sessionId, rating) => {
    const url = `${this.apiBase}/movie/${id}/rating?${this.apiKey}&guest_session_id=${sessionId}`;
    const body = {
      value: rating,
    };
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Возникла проблема с fetch запросом: ', err.message);
    });
  };

  getRatedFilms = async (sessionId, pageNumber = 1) => {
    const url = `${this.apiBase}/guest_session/${sessionId}/rated/movies?${this.apiKey}&page=${pageNumber}`;
    const body = await this.getDataFromServer(url);
    return body;
  };

  deleteRatedMovie = async (id, sessionId) => {
    const url = `${this.apiBase}movie/${id}/rating?${this.apiKey}&guest_session_id=${sessionId}`;
    const headers = {
      'Content-Type': 'application/json;charset=utf-8',
    };
    await fetch(url, {
      method: 'DELETE',
      headers,
    });
  };

  getGenresList = async () => {
    const url = `${this.apiBase}/genre/movie/list?${this.apiKey}`;
    const body = await this.getDataFromServer(url);
    return body;
  };
}
