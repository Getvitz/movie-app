

export default class ApiClient {

    apiKey = 'api_key=2e3929e3fdbe72846ccea38bd13b28b2'

    apiBase = 'https://api.themoviedb.org/3'

    apiStart = `${this.apiBase}/discover/movie?with_genres=18&primary_release_year=2021&${this.apiKey}`

    apiSearch = `${this.apiBase}/search/movie?${this.apiKey}&language=en-US&page=1&include_adult=false&query=`

    apiImg = 'https://image.tmdb.org/t/p/w500/'

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
      }

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
}