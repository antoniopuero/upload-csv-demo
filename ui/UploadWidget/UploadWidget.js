import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dropzone from 'react-dropzone';
import isFunction from 'lodash/isFunction';
import {
  subscribeToUploadStart,
  subscribeToUploadProgress,
  subscribeToUploadFinished,
  subscribeToUploadFailed
} from '../actions/socketActions';
import './UploadWidget.css';

class UploadWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      progress: 0,
      file: null
    };
  }
  componentDidMount() {
    this.subscribeToEvents();
  }

  subscribeToEvents() {
    subscribeToUploadStart(({ progress }) => {
      this.onProgressUpdate(progress);
      this.showUploading(true);
    });
    subscribeToUploadProgress(({ progress }) => {
      this.onProgressUpdate(progress);
      this.showUploading(true);
    });
    subscribeToUploadFinished(({ progress }) => {
      this.onProgressUpdate(progress);
      // show the full progress and only then hide progress bar
      setTimeout(() => {
        this.showUploading(false);
      }, 1000);
    });
    subscribeToUploadFailed(() => {
      this.showUploading(false);
    });
  }

  onProgressUpdate(progress) {
    let calculatedProgress;
    if (progress.allSent) {
      calculatedProgress = Math.floor(100 * progress.processed / progress.sent);
    } else {
      // fake progress until we know the row count from the file
      calculatedProgress = this.state.progress + 1;
    }
    this.setState({
      progress: calculatedProgress
    });
  }

  onDrop([file]) {
    this.setState({ file });
    if (isFunction(this.props.onDrop)) {
      this.props.onDrop(file);
    }
  }

  showUploading(isUploading = true) {
    this.setState({
      uploading: isUploading,
      progress: isUploading ? this.state.progress : 0
    });
  }

  onSubmit() {
    if (isFunction(this.props.onSubmit)) {
      this.props.onSubmit(this.state.file);
    }
    this.setState({ file: null });
  }

  render() {
    return (
      <div className="upload-container">
        {this.state.uploading ? (
          <div className="upload-progress">
            <Typography variant="title" className="upload-title">
              Uploading
            </Typography>
            <LinearProgress variant="determinate" value={this.state.progress} />
          </div>
        ) : (
          <Dropzone
            onDrop={file => this.onDrop(file)}
            multiple={false}
            inputProps={{ id: 'uploadField' }}
            accept="text/csv"
            className="upload-dropzone"
            activeClassName="upload-dropzone--active"
          >
            {this.state.file ? (
              <Typography variant="title" className="upload-title">
                {this.state.file.name}
              </Typography>
            ) : (
              <Typography variant="title" className="upload-title">
                Drug your csv file here or click in the area
              </Typography>
            )}
            <Button
              variant="raised"
              color="primary"
              disabled={!this.state.file}
              className="upload-button"
              id="uploadButton"
              onClick={e => {
                e.stopPropagation();
                this.onSubmit(e);
              }}
            >
              Upload
            </Button>
          </Dropzone>
        )}
      </div>
    );
  }
}

UploadWidget.propTypes = {
  onDrop: PropTypes.func,
  onSubmit: PropTypes.func
};

export default UploadWidget;
