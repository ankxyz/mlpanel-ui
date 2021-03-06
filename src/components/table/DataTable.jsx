import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Backdrop,
  CircularProgress,
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Typography,
  TableSortLabel
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { withRouter } from 'react-router';

import { getComparator, stableSort } from 'utils/sorting';

const useStyles = makeStyles(theme => ({
  table: {
    width: '100%'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  title: {
    fontWeight: 'bold'
  }
}));

const DataTable = ({
  tableFields,
  fetchRequest,
  data,
  isLoading,
  isError,
  additionalRequestProp,
  secondAdditionalRequestProp,
  twoProps,
  innerLevel
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  useEffect(() => {
    if (additionalRequestProp && secondAdditionalRequestProp && twoProps) {
      fetchRequest(additionalRequestProp, secondAdditionalRequestProp);
    } else if (!twoProps && additionalRequestProp) {
      fetchRequest(additionalRequestProp);
    } else if (fetchRequest) {
      fetchRequest();
    }
  }, [
    fetchRequest,
    additionalRequestProp,
    secondAdditionalRequestProp,
    twoProps
  ]);

  useEffect(() => {
    setOpen(isLoading);
  }, [isLoading]);

  if (isLoading) {
    return (
      <Backdrop timeout={0} className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!isLoading && isError) {
    return (
      <Alert variant="filled" severity="error">
        This is an error alert — check it out!
      </Alert>
    );
  }

  if (!isLoading && data.length === 0) {
    return (
      <Alert variant="filled" severity="warning">
        No data!
      </Alert>
    );
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler = property => event => {
    handleRequestSort(event, property);
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {tableFields().map(item => (
              <TableCell
                key={item.id}
                sortDirection={orderBy === item.name ? order : false}
              >
                {item.name ? (
                  <TableSortLabel
                    disabled={!item.name}
                    hideSortIcon={!item.name}
                    active={orderBy === item.name}
                    direction={orderBy === item.name ? order : 'asc'}
                    onClick={createSortHandler(item.name)}
                  >
                    <Typography className={classes.title}>
                      {item.title}
                    </Typography>
                  </TableSortLabel>
                ) : (
                  <Typography className={classes.title}>
                    {item.title}
                  </Typography>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            stableSort(data, getComparator(order, orderBy)).map(row => (
              <TableRow key={row.id || row.key}>
                {tableFields().map(field => {
                  const rowItem = innerLevel
                    ? row[innerLevel][field.name]
                    : row[field.name];

                  return (
                    <TableCell key={field.id}>
                      {field.format ? field.format(rowItem, row) : rowItem}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default withRouter(DataTable);
