import React, { useState, useEffect } from 'react';
import '../App.css';

import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import AddAlert from '@material-ui/icons/AddAlert';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import Fab from '@material-ui/core/Fab';
import Snackbar from '@material-ui/core/Snackbar';
import { ThemeProvider } from '@material-ui/styles';

import Sidebar from '../components/sidebar';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 500,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: 240,
      flexShrink: 0,
    },
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const chatTheme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        // padding: "0px 0px 0px 24px"
      },
    },
  },
});

const Test = (props) => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(1);
  const [notification, setNotification] = useState('');
  const [bc, setBC] = useState(false);

  return (
    <Grid container direction='row' className={classes.card} spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Card>
          <CardContent>
            <Grid container direction='row' spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                <Card>something</Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Card>something</Card>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Card>something</Card>
      </Grid>
    </Grid>
  );
};
const mapStateToProps = (state) => ({
  fdsManagers: state.reducer.fdsManagers,
});
export default connect(mapStateToProps)(Test);
