import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

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
  blue: {
    color: '#fff',
    backgroundColor: '#0000FF',
  },
}));

const Report = (props) => {
  const classes = useStyles();

  const importAll = (r) => {
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace('./', '')] = r(item);
    });
    return images;
  };

  const images = importAll(require.context('../images', false, /\.(png|jpe?g|svg)$/));

  return (
    <Card>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Grid container direction='column' className={classes.cardMedia}>
          <CardMedia component='img' className={classes.media} title={'01.jpg'} image={images[`01.jpg`]} />
        </Grid>
        <Grid container direction='column' className={classes.textGrid}>
          <Grid container direction='row' style={{ justifyContent: 'flex-start', marginBottom: '20px' }}>
            <Typography
              variant='body1'
              style={{
                background: '#213065',
                color: '#fff',
                borderRadius: '5px',
                width: '150px',
                textAlign: 'center',
                marginRight: '10px',
                padding: '4px',
              }}
            >
              Minor Accident
            </Typography>
            <Typography
              variant='body1'
              style={{
                background: '#213065',
                color: '#fff',
                borderRadius: '5px',
                width: '150px',
                textAlign: 'center',
                padding: '4px',
              }}
            >
              Resolved
            </Typography>
          </Grid>
          <Grid item xs={11} sm={11} md={11} lg={11} className={classes.textInput}>
            <Typography variant='h6'>Date</Typography>
          </Grid>
          <Grid item xs={11} sm={11} md={11} lg={11} className={classes.textInput}>
            <Typography variant='body1'>Title</Typography>
          </Grid>
          <Grid item xs={11} sm={11} md={11} lg={11} className={classes.textInput}>
            <Typography variant='body1'>Location</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Report;
