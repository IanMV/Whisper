import { defineStore } from 'pinia'
import axios from 'axios'

export const useSearchStore = defineStore('searchStore', {
  state: () => ({
    query: '',
    results: [],
    loading: false,
    error: null,
  }),

  actions: {
    async search() {
      const q = this.query.trim()
      if (!q) {
        this.results = []
        return
      }

      this.loading = true
      this.error = null

      const TMDB = "817aab6edd675cf23cb2adfd4ddfcfab"
      const HORROR_GENRE_ID = 27

      try {
        const movieRes = await axios.get("https://api.themoviedb.org/3/search/movie", {
          params: {
            api_key: TMDB,
            language: "pt-BR",
            query: q,
            include_adult: false,
          }
        })

        const horrorMovies = (movieRes.data.results || []).filter(movie =>
          (movie.genre_ids || []).includes(HORROR_GENRE_ID)
        )

        this.results = horrorMovies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))

      } catch (err) {
        console.error("Erro no searchStore:", err)
        this.error = "Erro ao buscar filmes de terror."
        this.results = []
      } finally {
        this.loading = false
      }
    }
  }
})
