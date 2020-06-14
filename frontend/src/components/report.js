import React, { useState, useCallback, useEffect } from 'react';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import MagicDropzone from 'react-magic-dropzone';
import models from '@cloud-annotations/models';

import { connect } from 'react-redux';

import styles from './App.module.css';
import './styles.css';

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

const dialogStyles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const Report = (props) => {
  const classes = useStyles();
  const [model, setModel] = useState(undefined);
  const [preview, setPreview] = useState(undefined);
  const [resultsCanvas, setResultsCanvas] = useState(undefined);
  const [buttonAnalyse, setButtonAnalyse] = useState(false);
  const [openRes, setOpenRes] = useState(false);
  const [openAcc, setOpenAcc] = useState(false);

  const getRetinaContext = (canvas) => {
    const ctx = canvas.getContext('2d');
    const scale = window.devicePixelRatio;
    let width = canvas.width / scale;
    let height = canvas.height / scale;
    return {
      setWidth: (w) => {
        width = w;
        canvas.style.width = w + 'px';
        canvas.width = w * scale;
      },
      setHeight: (h) => {
        height = h;
        canvas.style.height = h + 'px';
        canvas.height = h * scale;
      },
      width: width,
      height: height,
      clearAll: () => {
        return ctx.clearRect(0, 0, width * scale, height * scale);
      },
      clearRect: (x, y, width, height) => {
        return ctx.clearRect(x * scale, y * scale, width * scale, height * scale);
      },
      setFont: (font) => {
        const size = parseInt(font, 10) * scale;
        const retinaFont = font.replace(/^\d+px/, size + 'px');
        ctx.font = retinaFont;
      },
      setTextBaseLine: (textBaseline) => {
        ctx.textBaseline = textBaseline;
      },
      setStrokeStyle: (strokeStyle) => {
        ctx.strokeStyle = strokeStyle;
      },
      setLineWidth: (lineWidth) => {
        ctx.lineWidth = lineWidth * scale;
      },
      strokeRect: (x, y, width, height) => {
        return ctx.strokeRect(x * scale, y * scale, width * scale, height * scale);
      },
      setFillStyle: (fillStyle) => {
        ctx.fillStyle = fillStyle;
      },
      measureText: (text) => {
        const metrics = ctx.measureText(text);
        return {
          width: metrics.width / scale,
          actualBoundingBoxLeft: metrics.actualBoundingBoxLeft / scale,
          actualBoundingBoxRight: metrics.actualBoundingBoxRight / scale,
          actualBoundingBoxAscent: metrics.actualBoundingBoxAscent / scale,
          actualBoundingBoxDescent: metrics.actualBoundingBoxDescent / scale,
        };
      },
      fillRect: (x, y, width, height) => {
        return ctx.fillRect(x * scale, y * scale, width * scale, height * scale);
      },
      fillText: (text, x, y) => {
        return ctx.fillText(text, x * scale, y * scale);
      },
    };
  };

  const renderObjectDetection = (ctx, predictions) => {
    ctx.clearAll();
    // Font options.
    const font = `${14}px 'ibm-plex-sans', Helvetica Neue, Arial, sans-serif`;
    ctx.setFont(font);
    ctx.setTextBaseLine('top');
    const border = 2;
    const xPadding = 8;
    const yPadding = 4;
    const offset = 2;
    const textHeight = parseInt(font, 10); // base 10

    predictions.forEach((prediction) => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.setStrokeStyle('#0062ff');
      ctx.setLineWidth(border);

      ctx.strokeRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
      // Draw the label background.
      ctx.setFillStyle('#0062ff');
      const textWidth = ctx.measureText(prediction.label).width;
      ctx.fillRect(
        Math.round(x - border / 2),
        Math.round(y - (textHeight + yPadding) - offset),
        Math.round(textWidth + xPadding),
        Math.round(textHeight + yPadding)
      );
    });

    predictions.forEach((prediction) => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      // Draw the text last to ensure it's on top.
      ctx.setFillStyle('#ffffff');
      ctx.fillText(
        prediction.label,
        Math.round(x - border / 2 + xPadding / 2),
        Math.round(y - (textHeight + yPadding) - offset + yPadding / 2)
      );
    });
  };

  const renderClassification = (ctx, predictions) => {
    ctx.clearAll();

    const font = `${14}px 'ibm-plex-sans', Helvetica Neue, Arial, sans-serif`;
    const textHeight = parseInt(font, 10); // base 10
    const xPadding = 8;
    const yPadding = 4;
    const offset = 2;
    ctx.setFont(font);
    ctx.setTextBaseLine('top');

    predictions
      .filter((prediction) => prediction.score > 0.5)
      .forEach((prediction, i) => {
        console.log(prediction.label);
        const label = `${prediction.label} ${(prediction.score * 100).toFixed(1)}%`;
        props.dispatch({
          type: 'SET_PREDICTION_LABEL',
          data: prediction.label,
        });
        // Draw the label background.
        ctx.setFillStyle('#0062ff');
        const textWidth = ctx.measureText(label).width;
        ctx.fillRect(
          Math.round(xPadding),
          Math.round(xPadding + i * (textHeight + yPadding + offset)),
          Math.round(textWidth + xPadding),
          Math.round(textHeight + yPadding)
        );
        // Draw the text last to ensure it's on top.
        ctx.setFillStyle('#ffffff');
        ctx.fillText(
          label,
          Math.round(xPadding + 0 + xPadding / 2),
          Math.round(xPadding + i * (textHeight + yPadding + offset) + yPadding / 2)
        );
      });
  };

  useEffect(() => {
    models.load('/model_web').then(async (model) => {
      // warm up the model
      const image = new ImageData(1, 1);
      if (model.type === 'detection') {
        await model.detect(image);
      } else {
        await model.classify(image);
      }
      setModel(model);
    });
  }, []);

  useEffect(() => {
    setPreview(undefined);
    if (resultsCanvas) {
      const ctx = getRetinaContext(resultsCanvas);
      ctx.clearAll();
      ctx.setWidth(0);
      ctx.setHeight(0);
    }
  }, [model, resultsCanvas]); // if model changes kill preview.

  const onDrop = useCallback((accepted, _, links) => {
    setPreview(accepted[0].preview || links[0]);
  }, []);

  const onImageChange = useCallback(
    async (e) => {
      const imgWidth = e.target.clientWidth;
      const imgHeight = e.target.clientHeight;

      const ctx = getRetinaContext(resultsCanvas);
      ctx.setWidth(imgWidth);
      ctx.setHeight(imgHeight);

      if (model.type === 'detection') {
        const predictions = await model.detect(e.target);
        renderObjectDetection(ctx, predictions);
      } else {
        const predictions = await model.classify(e.target);
        renderClassification(ctx, predictions);
      }
    },
    [model, resultsCanvas]
  );

  const importAll = (r) => {
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace('./', '')] = r(item);
    });
    return images;
  };

  const images = importAll(require.context('../images', false, /\.(png|jpe?g|svg)$/));

  const isMajor = (label) => {
    return label === 'major accident';
  };

  const DialogTitle = withStyles(dialogStyles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant='h6'>{children}</Typography>
        {onClose ? (
          <IconButton aria-label='close' className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiDialogContent);

  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);

  const handleClickOpenRes = () => {
    setOpenRes(true);
  };
  const handleCloseRes = () => {
    setOpenRes(false);
  };

  return (
    <Card>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <div className={styles.wrapper}>
          <MagicDropzone
            className={styles.dropzone}
            accept='image/jpeg, image/png, .jpg, .jpeg, .png'
            multiple={false}
            onDrop={onDrop}
          >
            {preview ? (
              <div className={styles.imageWrapper}>
                <img alt='upload preview' onLoad={onImageChange} className={styles.image} src={preview} />
              </div>
            ) : model !== undefined ? (
              'Drag & Drop an Image to Test'
            ) : (
              'Loading model...'
            )}
            <canvas ref={setResultsCanvas} className={styles.canvas} />
          </MagicDropzone>
        </div>
        {props.predictionLabel !== '' && (
          <Grid container direction='column' className={classes.textGrid}>
            <Grid container direction='row' style={{ justifyContent: 'flex-start', marginBottom: '20px' }}>
              {isMajor(props.predictionLabel) ? (
                <Typography
                  variant='button'
                  style={{
                    background: '#ff1206',
                    color: '#fff',
                    borderRadius: '5px',
                    width: '180px',
                    textAlign: 'center',
                    marginRight: '10px',
                    padding: '4px',
                  }}
                >
                  {props.predictionLabel}
                </Typography>
              ) : (
                <Typography
                  variant='button'
                  style={{
                    background: '#fdfd96',
                    color: '#000',
                    borderRadius: '5px',
                    width: '180px',
                    textAlign: 'center',
                    marginRight: '10px',
                    padding: '4px',
                  }}
                >
                  {props.predictionLabel}
                </Typography>
              )}
              <Button
                variant='contained'
                style={{
                  background: '#ffb347',
                  color: '#fff',
                  borderRadius: '5px',
                  width: '180px',
                  textAlign: 'center',
                  padding: '4px',
                }}
                onClick={() => handleClickOpenRes()}
              >
                Unresolved
              </Button>
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
        )}
      </Grid>
      <Dialog onClose={handleCloseRes} aria-labelledby='customized-dialog-title' open={openRes}>
        <DialogTitle id='customized-dialog-title' onClose={handleCloseRes}>
          Modal title
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget
            quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </Typography>
          <Typography gutterBottom>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet
            rutrum faucibus dolor auctor.
          </Typography>
          <Typography gutterBottom>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl
            consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseRes} color='primary'>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
const mapStateToProps = (state) => ({
  predictionLabel: state.reducer.predictionLabel,
});
export default connect(mapStateToProps)(Report);
