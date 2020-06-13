import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
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

const importAll = (r) => {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace('./', '')] = r(item);
  });
  return images;
};

const images = importAll(require.context('../images', false, /\.(png|jpe?g|svg)$/));

const Current = (props) => {
  const classes = useStyles();
  const [notification, setNotification] = useState('');
  const [bc, setBC] = useState(false);

  const labelColor = (label) => {
    if (label === 'Minor Accident') {
      return '';
    } else if (label === 'Major Accident') {
      return '';
    } else {
      return '';
    }
  };

  return (
    <Grid container direction='row' className={classes.card} spacing={2}>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <Typography variant='h5' style={{ marginBottom: '10px' }}>
          Report
        </Typography>
        <Report />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <Grid container direction='column'>
          <Typography variant='h5' style={{ marginBottom: '10px' }}>
            Respondents
          </Typography>
          <Card className={classes.cardR}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid container direction='column' className={classes.textResp}>
                <Grid container direction='row' className={classes.cardResp}>
                  <Typography variant='body2' className={classes.logoUsername}>
                    13:00, 04/05/2020
                  </Typography>
                  <Typography variant='body2' className={classes.logoUsername}>
                    Jefferson Sie
                  </Typography>
                  <Typography variant='body2' className={classes.logoUsername}>
                    91234567
                  </Typography>
                </Grid>
                <Typography variant='h6' className={classes.textResp}>
                  Car crash, injured humans.
                </Typography>
              </Grid>
            </Grid>
          </Card>
          <Card className={classes.cardR}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid container direction='column' className={classes.textResp}>
                <Grid container direction='row' className={classes.cardResp}>
                  <Typography variant='body2' className={classes.logoUsername}>
                    13:50, 04/05/2020
                  </Typography>
                  <Typography variant='body2' className={classes.logoUsername}>
                    Andy Chan
                  </Typography>
                  <Typography variant='body2' className={classes.logoUsername}>
                    91234567
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={8}>
                  <CardMedia component='img' className={classes.media} title={'02.jpg'} image={images[`02.jpg`]} />
                </Grid>
              </Grid>
            </Grid>
          </Card>
          <Card className={classes.cardR}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid container direction='column' className={classes.textResp}>
                <Grid container direction='row' className={classes.cardResp}>
                  <Typography variant='body2' className={classes.logoUsername}>
                    13:00, 04/05/2020
                  </Typography>
                  <Typography variant='body2' className={classes.logoUsername}>
                    Jefferson Sie
                  </Typography>
                  <Typography variant='body2' className={classes.logoUsername}>
                    91234567
                  </Typography>
                </Grid>
                <Typography variant='h6' className={classes.textResp}>
                  Car crash, injured humans.
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};
const mapStateToProps = (state) => ({
  selectedReport: state.reducer.selectedReport,
});
export default connect(mapStateToProps)(Current);
