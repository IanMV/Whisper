const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE = import.meta.env.VITE_TMDB_API_BASE;

// Função genérica para fazer requisições
async function tmdbFetch(endpoint, params = {}) {
  const url = new URL(`${API_BASE}/${endpoint}`);

  // params enviados pelo usuário
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

// Endpoints estruturados
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
};
