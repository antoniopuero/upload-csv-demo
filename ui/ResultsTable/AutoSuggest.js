import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import findIndex from 'lodash/findIndex';
import './AutoSuggest.css';

function renderInput(inputProps) {
  const { ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: ref,
        ...other
      }}
    />
  );
}

function renderSuggestion(suggestion, index, { isHighlighted }) {
  return (
    <MenuItem selected={isHighlighted} component="div" id={`result-${index}`}>
      <div>{suggestion}</div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

class AutoSuggest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: []
    };
  }

  getSuggestionValue(suggestion) {
    return suggestion[this.props.labelKey];
  }

  getSuggestionIndex(suggestion) {
    return findIndex(this.state.suggestions, suggestion);
  }

  handleSuggestionsFetchRequested({ value }) {
    this.props.getSuggestions(value).then(suggestions => {
      this.setState({
        suggestions
      });
    });
  }

  handleSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  }

  handleSuggestionSelected(suggestion) {
    this.props.onSuggestionSelected(suggestion);
  }

  handleChange(event, { newValue }) {
    this.setState({
      value: newValue
    });
  }

  render() {
    return (
      <div className="auto-suggest-container">
        <Autosuggest
          renderInputComponent={renderInput}
          renderSuggestionsContainer={renderSuggestionsContainer}
          renderSuggestion={(suggestion, props) =>
            renderSuggestion(
              this.getSuggestionValue(suggestion),
              this.getSuggestionIndex(suggestion),
              props
            )
          }
          getSuggestionValue={suggestion => this.getSuggestionValue(suggestion)}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={e =>
            this.handleSuggestionsFetchRequested(e)
          }
          onSuggestionsClearRequested={e =>
            this.handleSuggestionsClearRequested(e)
          }
          onSuggestionSelected={(event, { suggestion }) =>
            this.handleSuggestionSelected(suggestion)
          }
          inputProps={{
            id: this.props.id,
            placeholder: 'Enter a search query',
            value: this.state.value,
            onChange: (e, props) => this.handleChange(e, props)
          }}
        />
      </div>
    );
  }
}

AutoSuggest.propTypes = {
  id: PropTypes.string.isRequired,
  labelKey: PropTypes.string.isRequired,
  getSuggestions: PropTypes.func.isRequired,
  onSuggestionSelected: PropTypes.func.isRequired
};

export default AutoSuggest;
