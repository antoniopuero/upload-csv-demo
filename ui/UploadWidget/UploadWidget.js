import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dropzone from 'react-dropzone';
import isFunction from 'lodash/isFunction';
import './UploadWidget.css';

class UploadWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      file: null
    };
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  onDrop([file]) {
    this.setState({ file });
    if (isFunction(this.props.onDrop)) {
      this.props.onDrop(file);
    }
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
      </div>
    );
  }
}

UploadWidget.propTypes = {
  onDrop: PropTypes.func,
  onSubmit: PropTypes.func
};

export default UploadWidget;
