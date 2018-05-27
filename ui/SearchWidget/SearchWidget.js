import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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
    return (
      <Paper>
        <AutoSuggest
          id="searchField"
          labelKey="name"
          getSuggestions={query => this.getData(query)}
          onSuggestionSelected={suggestion => this.showSelected(suggestion)}
        />
        {isEmpty(selected) ? null : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell numeric>Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell numeric>Age</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Team</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={selected.id}>
                <TableCell component="th" scope="row" numeric>
                  {selected.id}
                </TableCell>
                <TableCell>{selected.name}</TableCell>
                <TableCell numeric>{selected.age}</TableCell>
                <TableCell>{selected.address}</TableCell>
                <TableCell>{selected.team}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </Paper>
    );
  }
}

export default ResultTable;
