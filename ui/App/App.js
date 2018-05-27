import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResultsTable from '../ResultsTable/ResultsTable';
import UploadWidget from '../UploadWidget/UploadWidget';
import { importFile } from '../actions/apiActions';
import '../actions/socketActions';
import './App.css';

export default class App extends Component {
  onFileSubmit(file) {
    importFile(file).then(response => {
      if (response.error) {
        toast.error(`Import failed: ${response.error}`);
      }
    });
  }
  render() {
    return (
      <div className="app-container">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
        <UploadWidget onSubmit={file => this.onFileSubmit(file)} />
        <ResultsTable />
      </div>
    );
  }
}
