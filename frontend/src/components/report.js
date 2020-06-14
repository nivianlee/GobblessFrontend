import React, { useState, useCallback, useEffect } from 'react';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import AddAlert from '@material-ui/icons/AddAlert';

import reports from '../data/reports.json';

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
  blue: {
    color: '#fff',
    backgroundColor: '#0000FF',
  },
  inputRoot: {
    marginTop: 20,
    paddingTop: 20,
  },
  labelRoot: {
    fontSize: 28,
    fontWeight: 500,
    color: 'black',
    marginBottom: 20,
  },
  labelFocused: {},
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
  const [notification, setNotification] = useState('');
  const [bc, setBC] = useState(false);
  const [model, setModel] = useState(undefined);
  const [preview, setPreview] = useState(undefined);
  const [resultsCanvas, setResultsCanvas] = useState(undefined);
  const [openRes, setOpenRes] = useState(false);
  const [openAcc, setOpenAcc] = useState(false);
  const [openEm, setOpenEm] = useState(false);
  const [emMessage, setEmMessage] = useState('Accident at ');
  const [resolved, setResolved] = useState(false);
  const [accident, setAccident] = useState(false);
  const [value, setValue] = useState(undefined);
  const [report, setReport] = useState({});

  useEffect(() => {
    console.log(reports[0]);
    if (props.selectedImage === 2) {
      setReport(reports[0]);
    }
    if (props.selectedImage === 3) {
      setReport(reports[1]);
    }
    if (props.selectedImage === 4) {
      setReport(reports[2]);
    }
  }, [props.selectedImage, props.predictionLabel]);

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
        //const label = `${prediction.label} ${(prediction.score * 100).toFixed(1)}%`;
        const label = 'Analysed';
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

  useEffect(() => {
    props.dispatch({
      type: 'SET_SELECTED_IMAGE',
      data: props.selectedImage + 1,
    });
  }, [props.predictionLabel]);

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

  const handleClickOpenAcc = () => {
    setAccident(true);
    setOpenAcc(true);
  };

  const handleCloseAcc = () => {
    setOpenAcc(false);
  };

  const handleClickOpenRes = () => {
    setAccident(false);
    setOpenRes(true);
  };

  const handleCloseRes = () => {
    setOpenRes(false);
  };

  const handleClickOpenEm = () => {
    setOpenEm(true);
  };

  const handleCloseEm = () => {
    setOpenEm(false);
  };

  const handleCloseResYes = () => {
    setOpenRes(false);
    setResolved(true);
  };

  const handleChange = (event) => {
    setOpenAcc(false);
    props.dispatch({
      type: 'SET_PREDICTION_LABEL',
      data: event.target.value,
    });
  };
  const showNotification = () => {
    setBC(true);
    setTimeout(function () {
      setBC(false);
    }, 6000);
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
                <Button
                  variant='contained'
                  style={{
                    background: '#ff1206',
                    color: '#fff',
                    borderRadius: '5px',
                    width: '180px',
                    textAlign: 'center',
                    marginRight: '10px',
                    padding: '4px',
                  }}
                  onClick={() => handleClickOpenAcc()}
                >
                  {props.predictionLabel}
                </Button>
              ) : (
                <Button
                  variant='contained'
                  style={{
                    background: '#fdfd96',
                    color: '#000',
                    borderRadius: '5px',
                    width: '180px',
                    textAlign: 'center',
                    marginRight: '10px',
                    padding: '4px',
                  }}
                  onClick={() => handleClickOpenAcc()}
                >
                  {props.predictionLabel}
                </Button>
              )}
              {resolved ? (
                <Button
                  variant='contained'
                  style={{
                    background: '#77dd77',
                    color: '#fff',
                    borderRadius: '5px',
                    width: '180px',
                    textAlign: 'center',
                    padding: '4px',
                  }}
                  onClick={() => handleClickOpenRes()}
                  disabled={true}
                >
                  Resolved
                </Button>
              ) : (
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
              )}
            </Grid>
            <Grid item xs={11} sm={11} md={11} lg={11} className={classes.textInput}>
              <Typography variant='h6'>{report.date}</Typography>
            </Grid>
            <Grid item xs={11} sm={11} md={11} lg={11} className={classes.textInput}>
              <Typography variant='body1'>{report.location}</Typography>
            </Grid>
            <Grid item xs={11} sm={11} md={11} lg={11} className={classes.textInput}>
              <Divider />
            </Grid>
            <Grid item xs={11} sm={11} md={11} lg={11} className={classes.textInput}>
              <TextField
                id='standard-full-width'
                name='Emergency Message'
                fullWidth
                label='Emergency Message'
                InputProps={{
                  classes: { root: classes.inputRoot },
                }}
                InputLabelProps={{
                  classes: {
                    root: classes.labelRoot,
                    focused: classes.labelFocused,
                  },
                }}
                helperText='Broadcast to drivers and passengers near accidents e.g. Accident at AYE near Exit 9a, avoid Lane 4'
                value={emMessage}
                onChange={(event) => setEmMessage(event.target.value)}
              />
              <Button
                variant='contained'
                onClick={handleClickOpenEm}
                style={{ marginTop: '20px', background: '#213065', color: '#fff' }}
              >
                Broadcast message
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
      {accident ? (
        <Dialog
          fullWidth='sm'
          maxWidth='sm'
          onClose={handleCloseAcc}
          aria-labelledby='customized-dialog-title'
          open={openAcc}
        >
          <DialogTitle id='customized-dialog-title' onClose={handleCloseAcc}>
            Reclassify Accident Severity
          </DialogTitle>
          <FormControl
            component='fieldset'
            style={{
              marginLeft: '20px',
              marginBottom: '20px',
            }}
          >
            <RadioGroup
              aria-label='accident severity'
              name='accident severity1'
              value={props.predictionLabel}
              onChange={handleChange}
            >
              <FormControlLabel value='minor accident' control={<Radio />} label='Minor Accident' />
              <FormControlLabel value='major accident' control={<Radio />} label='Major Accident' />
              <FormControlLabel value='normal' control={<Radio />} label='Normal' />
            </RadioGroup>
          </FormControl>
        </Dialog>
      ) : (
        <Dialog
          fullWidth='sm'
          maxWidth='sm'
          onClose={handleCloseRes}
          aria-labelledby='customized-dialog-title'
          open={openRes}
        >
          <DialogTitle id='customized-dialog-title' onClose={handleCloseRes}>
            Resolve Report
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom> Has this report been resolved? </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCloseResYes} color='primary'>
              Yes
            </Button>
            <Button autoFocus onClick={handleCloseRes} color='primary'>
              No
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog onClose={handleCloseEm} aria-labelledby='customized-dialog-title' open={openEm}>
        <DialogTitle id='customized-dialog-title' onClose={handleCloseEm}>
          Broadcast Message
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>Click 'Send Message' to confirm broadcast message.</Typography>
          <Typography gutterBottom variant='h6'>
            {emMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              handleCloseEm();
              setNotification('Success! Message has been broadcasted');
              showNotification();
            }}
            color='primary'
          >
            Save changes
          </Button>
          <Button
            autoFocus
            onClick={() => {
              handleCloseEm();
              setNotification('Cancelled. No message was broadcasted');
              showNotification();
            }}
            color='primary'
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth onClose={handleCloseRes} aria-labelledby='customized-dialog-title' open={openRes}>
        <DialogTitle id='customized-dialog-title' onClose={handleCloseRes}>
          Resolve Report
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom> Has this report been resolved? </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseResYes} color='primary'>
            Yes
          </Button>
          <Button autoFocus onClick={handleCloseRes} color='primary'>
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container justify={'center'}>
        <Grid item xs={12} sm={12} md={10} lg={8}>
          <Grid container>
            <Grid item xs={12} sm={12} md={4}>
              <Snackbar
                place='bc'
                color='info'
                icon={<AddAlert />}
                message={notification}
                open={bc}
                onClose={() => setBC(false)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  predictionLabel: state.reducer.predictionLabel,
  selectedImage: state.reducer.selectedImage,
});

export default connect(mapStateToProps)(Report);
