import React from 'react'
import {Switch, Route} from 'react-router-dom'
import './App.css'

import PopularMovies from './components/PopularMovies'
import TopRatedMovies from './components/TopRatedMovies'
import UpcomingMovies from './components/UpcomingMovies'
import SingleMovieDetails from './components/SingleMovieDetails'
import SearchedMovies from './components/SearchedMovies'

const routeConfigs = [
  {
    path: '/',
    key: 'PopularMovies',
    exact: true,
    component: PopularMovies,
  },
  {
    path: '/top-rated',
    key: 'TopRatedMovies',
    exact: true,
    component: TopRatedMovies,
  },
  {
    path: '/upcoming',
    key: 'UpcomingMovies',
    exact: true,
    component: UpcomingMovies,
  },
  {
    path: '/movies/:id',
    key: 'SingleMovieDetails',
    exact: true,
    component: SingleMovieDetails,
  },
  {
    path: '/movies/search/:search',
    key: 'SearchedMovies',
    exact: true,
    component: SearchedMovies,
  },
]

const App = () => {
  return (
    <Switch>
      {routeConfigs.map(({path, key, exact, component: Component}) => (
        <Route
          key={key}
          path={path}
          exact={exact}
          render={props => <Component {...props} />}
        />
      ))}
    </Switch>
  )
}

export default App
