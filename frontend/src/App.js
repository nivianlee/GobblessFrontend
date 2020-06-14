import React, { useState, useEffect } from 'react';
import './App.css';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';

import Past from './containers/past';
import Current from './containers/current';
import Sidebar from './components/sidebar';
import Topbar from './components/topbar';

import * as Reducer from './reducers/reducers.js';
//for the appbar and drawer
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

const rootReducer = combineReducers({
  reducer: Reducer.reducer,
});

const store = createStore(rootReducer);

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const App = (props) => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  let pathname = props.history.location.pathname;
  const [selectedItem, setSelectedItem] = useState(0);

  useEffect(() => {
    setMobileOpen(false);
    if (pathname === '/current') {
      setSelectedItem(0);
    }
  }, [props.history.location.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSelectedItem = (event, index) => {
    setSelectedItem(index);
    if (index === 0) {
      props.history.push('/current');
    }
  };

  return (
    <Provider store={store}>
      <div className={classes.root}>
        <CssBaseline />
        <Topbar handleDrawerToggle={handleDrawerToggle} pathname={pathname} />
        <nav className={classes.drawer} aria-label='mailbox folders'>
          <Sidebar
            handleDrawerToggle={handleDrawerToggle}
            mobileOpen={mobileOpen}
            handleSelectedItem={handleSelectedItem}
            selectedItem={selectedItem}
          />
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route exact path='/current' component={Current}></Route>
            <Redirect from='/' to={'current'} />
          </Switch>
        </main>
      </div>
    </Provider>
  );
};

export default withRouter(App);
