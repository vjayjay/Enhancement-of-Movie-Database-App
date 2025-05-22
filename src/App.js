import React, {useState, useEffect, useCallback} from 'react'
import {Switch, Route, useLocation} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import './App.css'

const routeConfigs = [
  {
    path: '/',
    key: 'PopularMovies',
    exact: true,
    test: path => path === '/',
    importPath: './components/PopularMovies',
  },
  {
    path: '/top-rated',
    key: 'TopRatedMovies',
    exact: true,
    test: path => path === '/top-rated',
    importPath: './components/TopRatedMovies',
  },
  {
    path: '/upcoming',
    key: 'UpcomingMovies',
    exact: true,
    test: path => path === '/upcoming',
    importPath: './components/UpcomingMovies',
  },
  {
    path: '/movies/:id',
    key: 'SingleMovieDetails',
    exact: true,
    test: path => /^\/movies\/[^/]+$/.test(path),
    importPath: './components/SingleMovieDetails',
  },
  {
    path: '/movies/search/:search',
    key: 'SearchedMovies',
    exact: true,
    test: path => path.startsWith('/movies/search/'),
    importPath: './components/SearchedMovies',
  },
]

const App = () => {
  const location = useLocation()
  const [components, setComponents] = useState({
    PopularMovies: null,
    TopRatedMovies: null,
    UpcomingMovies: null,
    SingleMovieDetails: null,
    SearchedMovies: null,
  })

  const loadComponent = useCallback(
    async path => {
      const match = routeConfigs.find(
        ({key, test}) => test(path) && !components[key],
      )
      if (match) {
        try {
          const mod = await import(`${match.importPath}`)
          setComponents(prev => ({...prev, [match.key]: mod.default}))
        } catch (error) {
          console.error(`Failed to load ${match.key}:`, error)
        }
      }
    },
    [components],
  )

  useEffect(() => {
    loadComponent(location.pathname)
  }, [location.pathname, loadComponent])

  const renderLoader = () => (
    <div className="loader-style">
      <Loader type="ThreeDots" color="#3b82f6" height={80} width={80} />
    </div>
  )

  return (
    <Switch>
      {routeConfigs.map(({path, key, exact}) => (
        <Route
          key={path}
          path={path}
          exact={exact}
          render={props =>
            components[key]
              ? React.createElement(components[key], props)
              : renderLoader()
          }
        />
      ))}
    </Switch>
  )
}

export default App
