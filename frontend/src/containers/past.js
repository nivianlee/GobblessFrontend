import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Report from '../components/report';

import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: '0%',
    alignItems: 'left',
    justifyContent: 'left',
  },
  cardMedia: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  cardResp: {
    marginTop: '5px',
    marginBottom: '10px',
    marginRight: '20px',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  cardR: {
    marginBottom: '20px',
  },
  textGrid: {
    margin: '4%',
  },
  textLabel: {
    marginRight: '10px',
    background: '#213065',
    color: '#fff',
    borderRadius: '5px',
    width: '60%',
  },
  textInput: {
    marginBottom: '3%',
  },
  textResp: {
    margin: '5px',
  },
  logoUsername: {
    marginRight: '2%',
    marginTop: '1%',
  },
  button: {
    marginTop: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const Past = (props) => {
  const classes = useStyles();

  return (
    <Grid container direction='column' className={classes.card} spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Typography variant='h5' style={{ marginBottom: '10px' }}>
          Report
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={3}>
        <Report />
      </Grid>
    </Grid>
  );
};
const mapStateToProps = (state) => ({
  reports: state.reducer.reports,
});
export default connect(mapStateToProps)(Past);
