import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE = import.meta.env.VITE_TMDB_API_BASE;

async function tmdbFetch(endpoint, params = {}) {
  const url = new URL(`${API_BASE}/${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB error: ${response.status}`);
  }

  return response.json();
}

export const tmdbApi = {
  getPopularMovies() {
    return tmdbFetch("movie/popular");
  },
  getMovieById(id) {
    return tmdbFetch(`movie/${id}`);
  },
  searchMovies(query) {
    return tmdbFetch("search/movie", { query });
  },
  searchImage(id) {
    return tmdbFetch(`movie/${id}/images`);
  },
  searchVideo(id) {
    return tmdbFetch(`movie/${id}/videos`);
  },
  async fetchKeywordId(keyword) {
    const res = await axios.get(
      `${API}/search/keyword?api_key=${KEY}&query=${keyword}`
    );
    if (res.data.results.length > 0) return res.data.results[0].id;
    return null;
  },
  async fetchMoviesByTheme(params) {
    const page = Math.floor(Math.random() * 5) + 1;
    const res = await axios.get(
      `${API}/discover/movie?api_key=${KEY}&language=pt-BR&${params}&page=${page}`
    );
    return res.data.results.filter((movie) => movie.poster_path).slice(0, 20);
  },
  async fetchMovie(id) {
    const res = await axios.get(
      `${API}/movie/${id}?api_key=${KEY}&language=pt-BR`
    );
    return res.data;
  },
  async loadKeywordCarousels(KEYWORDS) {
    const carouselsWithKeywords = [];
    for (const k of KEYWORDS) {
      const id = await this.fetchKeywordId(k.keyword);
      if (!id) continue;
      const page = Math.floor(Math.random() * 5) + 1;
      const res = await axios.get(
        `${API}/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=27&with_keywords=${id}&sort_by=vote_average.asc&page=${page}`
      );
      const moviesWithPoster = res.data.results
        .filter((m) => m.poster_path)
        .slice(0, 20);
      if (moviesWithPoster.length > 0)
        carouselsWithKeywords.push({
          title: k.title,
          movies: moviesWithPoster,
        });
    }
    return carouselsWithKeywords;
  },
};
