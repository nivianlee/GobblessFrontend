import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Report from '../components/report';
import Respondent from '../components/respondent';

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

const Current = (props) => {
  const classes = useStyles();
  const [notification, setNotification] = useState('');
  const [bc, setBC] = useState(false);

  return (
    <Grid container direction='row' className={classes.card} spacing={2}>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <Typography variant='h5' style={{ marginBottom: '10px' }}>
          Report
        </Typography>
        <Report />
      </Grid>
      <Grid item xs={12} sm={12} md={8} lg={8}>
        <Grid container direction='column'>
          <Typography variant='h5' style={{ marginBottom: '10px' }}>
            Respondents
          </Typography>
        </Grid>
        <Respondent />
      </Grid>
    </Grid>
  );
};
const mapStateToProps = (state) => ({
  selectedReport: state.reducer.selectedReport,
});
export default connect(mapStateToProps)(Current);
