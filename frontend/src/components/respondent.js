import React, { useState, useCallback, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';

import reports from '../data/reports.json';

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
    marginRight: '15px',
    marginTop: '5px',
  },
  button: {
    marginTop: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const Respondent = (props) => {
  const classes = useStyles();
  const [respMsgs, setRespMsgs] = useState([]);

  const importAll = (r) => {
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace('./', '')] = r(item);
    });
    return images;
  };

  const images = importAll(require.context('../images', false, /\.(png|jpe?g|svg)$/));

  useEffect(() => {
    if (props.selectedImage === 2) {
      setRespMsgs(reports[0]);
    }
    if (props.selectedImage === 3) {
      setRespMsgs(reports[1]);
    }
    if (props.selectedImage === 4) {
      setRespMsgs(reports[2]);
    }
  }, [props.selectedImage, props.predictionLabel]);

  return (
    <>
      {props.selectedImage === 1 && (
        <Typography variant='h6' className={classes.textResp}>
          No respondent messages
        </Typography>
      )}
      {respMsgs.map((msg, index) => (
        <Card key={index} className={classes.cardR}>
          <Grid container direction='column' className={classes.textResp}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Grid container direction='row' className={classes.cardResp}>
                <Typography variant='body2' className={classes.logoUsername}>
                  {msg.date}
                </Typography>
                <Typography variant='body2' className={classes.logoUsername}>
                  {msg.name}
                </Typography>
                <Typography variant='body2' className={classes.logoUsername}>
                  {msg.contactNum}
                </Typography>
              </Grid>
              <Grid item xs={11} sm={11} md={11} lg={11}>
                <Typography variant='h6' className={classes.textResp}>
                  {msg.text}
                </Typography>
              </Grid>
              {msg.image !== '' && (
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <CardMedia
                    component='img'
                    className={classes.media}
                    title={'02.jpg'}
                    image={images[`${msg.image}.jpg`]}
                    style={{ height: '400px' }}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Card>
      ))}
    </>
  );
};

const mapStateToProps = (state) => ({
  selectedImage: state.reducer.selectedImage,
  predictionLabel: state.reducer.predictionLabel,
});
export default connect(mapStateToProps)(Respondent);
