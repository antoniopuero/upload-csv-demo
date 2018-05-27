import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import findIndex from 'lodash/findIndex';
import debounce from 'lodash/debounce';
import './AutoSuggest.css';

function customMatch(text, query) {
  const results = [];
  const trimmedQuery = query.trim().toLowerCase();
  const textLower = text.toLowerCase();
  const queryLength = trimmedQuery.length;
  let indexOf = textLower.indexOf(trimmedQuery);
  while (indexOf > -1) {
    results.push([indexOf, indexOf + queryLength]);
    indexOf = textLower.indexOf(query, indexOf + queryLength);
  }
  return results;
}

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

function renderSuggestion(suggestion, index, { query, isHighlighted }) {
  const matches = customMatch(suggestion, query);
  const parts = parse(suggestion, matches);
  return (
    <MenuItem selected={isHighlighted} component="div">
      <div id={`result-${index}`}>
        {parts.map((part, index) => {
          return part.highlight ? (
            <strong key={String(index)} style={{ fontWeight: 800 }}>
              {part.text}
            </strong>
          ) : (
            <span key={String(index)}>{part.text}</span>
          );
        })}
      </div>
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
    this.handleSuggestionsFetchDebounce = debounce(
      ({ value }) => this.handleSuggestionsFetchRequested(value),
      200
    );
  }

  getSuggestionValue(suggestion) {
    return suggestion[this.props.labelKey];
  }

  getSuggestionIndex(suggestion) {
    return findIndex(this.state.suggestions, suggestion);
  }

  handleSuggestionsFetchRequested(value) {
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
            this.handleSuggestionsFetchDebounce(e)
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
