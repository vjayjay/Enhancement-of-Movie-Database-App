import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import MovieNavBar from '../MovieNavBar'
import MoviePoster from '../MoviePoster'

import './index.css'
import Pagination from '../Pagination'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inprogress: 'INPROGRESS',
  failure: 'FAILURE',
}

const PopularMovies = () => {
  const [moviesList, setMoviesList] = useState([])
  const [fetchApiStatus, setFetchApiStatus] = useState(apiStatus.initial)
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPages, setMaxPages] = useState()
  const totalPages = 10

  const onPageChange = page => {
    setCurrentPage(page)
  }

  const onPrevClick = () => {
    if (currentPage > 1) {
      const pageNo = currentPage - 1
      setCurrentPage(pageNo)
    }
  }

  const onNextClick = () => {
    if (currentPage < maxPages) {
      const pageNo = currentPage + 1
      setCurrentPage(pageNo)
    }
  }

  const updatedMovieData = data => {
    const moviesDataList = data.results
    setMaxPages(data.length)

    const updatedMoviesDataList = moviesDataList.map(eachMovie => ({
      movieId: eachMovie.id,
      movieName: eachMovie.title,
      movieImage: eachMovie.poster_path,
      rating: eachMovie.vote_average,
    }))

    setMoviesList(updatedMoviesDataList)
  }

  useEffect(() => {
    const getPopularMoviesURL = `https://api.themoviedb.org/3/movie/popular?api_key=dde4f5dce0f6f5e3e11d2871ce02db75&language=en-US&page=${currentPage}`

    const options = {
      method: 'GET',
    }
    setFetchApiStatus(apiStatus.inprogress)
    const fetchData = async () => {
      try {
        const response = await fetch(getPopularMoviesURL, options)
        const data = await response.json()
        if (response.ok) {
          setFetchApiStatus(apiStatus.success)
          updatedMovieData(data)
        } else {
          console.error(data.error)
          setFetchApiStatus(apiStatus.failure)
        }
      } catch (error) {
        console.error('Error during API call:', error)
        setFetchApiStatus(apiStatus.failure)
      }
    }
    fetchData()
  }, [currentPage])

  const loadingPage = () => (
    <div className="loader-style">
      <Loader type="ThreeDots" color="#3b82f6" height="80" width="80" />
    </div>
  )

  const successPage = () => (
    <>
      <h1 className="popular-movie-heading">Popular</h1>
      <ul className="movies-list">
        {moviesList.map(eachMovieData => (
          <MoviePoster
            movieDetails={eachMovieData}
            key={eachMovieData.movieId}
          />
        ))}
      </ul>
    </>
  )

  const failurePage = () => (
    <div className="error-message">
      <p>Something went wrong. Please try again later.</p>
    </div>
  )

  const switchCase = () => {
    switch (fetchApiStatus) {
      case apiStatus.inprogress:
        return loadingPage()
      case apiStatus.success:
        return successPage()
      case apiStatus.failure:
        return failurePage()
      default:
        return null
    }
  }

  return (
    <div className="bg-color">
      <MovieNavBar />
      {switchCase()}
      <Pagination
        currentPage={currentPage}
        totalPages={maxPages || totalPages}
        onNextClick={onNextClick}
        onPrevClick={onPrevClick}
        onSelectPage={onPageChange}
      />
    </div>
  )
}

export default PopularMovies
