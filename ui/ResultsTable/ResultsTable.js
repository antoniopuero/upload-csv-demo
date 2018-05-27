import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import AutoSuggest from './AutoSuggest';

const data = [
  { id: 1, name: 'name', age: 20, address: 'dfafadf', team: 'teamA' },
  { id: 2, name: 'name1', age: 20, address: 'dfafadf', team: 'teamA' },
  { id: 3, name: 'name2', age: 20, address: 'dfafadf', team: 'teamA' },
  { id: 4, name: 'name2', age: 20, address: 'dfafadf', team: 'teamA' },
  { id: 5, name: 'name2', age: 20, address: 'dfafadf', team: 'teamA' },
  { id: 6, name: 'name2', age: 20, address: 'dfafadf', team: 'teamA' },
  { id: 7, name: 'name2', age: 20, address: 'dfafadf', team: 'teamA' },
  { id: 8, name: 'name2', age: 20, address: 'dfafadf', team: 'teamA' },
  { id: 10, name: 'name2', age: 20, address: 'dfafadf', team: 'teamA' },
  { id: 11, name: 'name2', age: 20, address: 'dfafadf', team: 'teamA' },
  { id: 12, name: 'name2', age: 20, address: 'dfafadf', team: 'teamA' },
  { id: 13, name: 'name2', age: 20, address: 'dfafadf', team: 'teamA' },
  { id: 14, name: 'name2', age: 20, address: 'dfafadf', team: 'teamA' },
  { id: 15, name: 'name2', age: 20, address: 'dfafadf', team: 'teamA' },
  { id: 16, name: 'name2', age: 20, address: 'dfafadf', team: 'teamA' },
  { id: 17, name: 'name2', age: 20, address: 'dfafadf', team: 'teamA' },
  { id: 9, name: 'name3', age: 20, address: 'dfafadf', team: 'teamA' }
];

class ResultTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10
    };
  }
  handleChangePage(page) {
    this.setState({ page });
  }

  handleChangeRowsPerPage(rowsPerPage) {
    this.setState({ rowsPerPage });
  }
  render() {
    const { page, rowsPerPage } = this.state;
    return (
      <Paper>
        <AutoSuggest
          id="searchField"
          labelKey="name"
          getSuggestions={() => Promise.resolve(data)}
          onSuggestionSelected={suggestion => console.log(suggestion)}
        />
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
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(dataPoint => {
                return (
                  <TableRow key={dataPoint.id}>
                    <TableCell component="th" scope="row" numeric>
                      {dataPoint.id}
                    </TableCell>
                    <TableCell>{dataPoint.name}</TableCell>
                    <TableCell numeric>{dataPoint.age}</TableCell>
                    <TableCell>{dataPoint.address}</TableCell>
                    <TableCell>{dataPoint.team}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page'
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page'
          }}
          onChangePage={(event, pageNumber) =>
            this.handleChangePage(pageNumber)
          }
          onChangeRowsPerPage={event =>
            this.handleChangeRowsPerPage(event.target.value)
          }
        />
      </Paper>
    );
  }
}

ResultTable.propTypes = {};
export default ResultTable;
