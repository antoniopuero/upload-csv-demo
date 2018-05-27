import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { toast } from 'react-toastify';
import isEmpty from 'lodash/isEmpty';
import AutoSuggest from './AutoSuggest';
import { getData } from '../actions/apiActions';

class ResultTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {}
    };
  }

  getData(query, limit) {
    return getData(query, limit).then(data => {
      if (data.error) {
        toast.error(data.error);
        return [];
      }
      return data;
    });
  }

  showSelected(selected) {
    this.setState({
      selected: selected
    });
  }

  render() {
    const { selected } = this.state;
    const isSelected = !isEmpty(selected);
    let initials;
    if (isSelected) {
      initials = selected.name
        .split(/\s/)
        .map(word => word[0])
        .join('')
        .toUpperCase();
    }
    return (
      <Paper>
        <AutoSuggest
          id="searchField"
          labelKey="name"
          getSuggestions={query => this.getData(query)}
          onSuggestionSelected={suggestion => this.showSelected(suggestion)}
        />
        {isSelected ? (
          <Card>
            <CardHeader
              avatar={<Avatar aria-label="initials">{initials}</Avatar>}
              title={selected.name}
            />
            <CardContent>
              <Typography>
                <b>ID:</b> {selected.id}
              </Typography>
              <Typography>
                <b>Age:</b> {selected.age}
              </Typography>
              <Typography>
                <b>Address:</b> {selected.address}
              </Typography>
              <Typography>
                <b>Team:</b> {selected.team}
              </Typography>
            </CardContent>
          </Card>
        ) : null}
      </Paper>
    );
  }
}

export default ResultTable;
