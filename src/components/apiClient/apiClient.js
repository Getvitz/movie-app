

export default class ApiClient {

    apiKey = 'api_key=2e3929e3fdbe72846ccea38bd13b28b2'

    apiBase = 'https://api.themoviedb.org/3'

    apiUrl = `${this.apiBase}/discover/movie?with_genres=18&primary_release_year=2021&${this.apiKey}`

    apiImg = 'https://image.tmdb.org/t/p/w500/'

    async getDataFromServer() {
        try {
          const res = await fetch(this.apiUrl);
          if (!res.ok) {
            throw new Error(`${res.status}`);
          }
          const body = await res.json();
          return body.results;
        } catch (err) {
          console.error('Cant load data from DataBase: ', err.message);
          return err.message;
        }
      }
}