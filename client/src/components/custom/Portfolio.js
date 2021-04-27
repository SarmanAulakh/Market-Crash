import React, { Component } from 'react'
import PropTypes from 'prop-types';

// Components
import CustomButton from './CustomButton';
import UpdatePortfolioDialog from './UpdatePortfolioDialog';


// Material UI
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';

// Redux
import { connect } from 'react-redux';
import { getPortfolioData } from '../../redux/actions/portfolioAction';
import { deleteStock } from '../../redux/actions/portfolioAction';

export class Portfolio extends Component {
  componentDidMount() {
    this.props.getPortfolioData(this.props.handle);
  }

  deleteSymbol = (symbol) => {
    this.props.getPortfolioData(this.props.handle);
    this.props.deleteStock(symbol)
  }
  
  render() {
    const { classes, data, loading } = this.props;
    const rowsMarkup = loading ? (
      <p>loading</p>
    ) : Object.keys(data).length === 0  ? (
      <p>No data</p>
    ) : (
      Object.entries(data.portfolioData).map(([symbol,value],i)=>
        <StyledTableRow key={symbol+'-'+i}>
            <StyledTableCell component="th" scope="row">
              {symbol}
            </StyledTableCell>
            <StyledTableCell align="right">{value.shares}</StyledTableCell>
            <StyledTableCell align="right">{value.avg_price.toFixed(2)}</StyledTableCell>
            <StyledTableCell align="right">{value.current_price.toFixed(2)}</StyledTableCell>
            <StyledTableCell align="right">{value.total_value.toFixed(2)}</StyledTableCell>
            <StyledTableCell align="right">{value.total_gain.toFixed(2)}</StyledTableCell>
            <StyledTableCell align="right">
              <CustomButton 
                tip="delete" 
                className="no-padding" 
                customStyle={{"padding": 0}}
                value={symbol}
                onClick={() => this.props.deleteStock(symbol)}
                >
                <DeleteIcon />
              </CustomButton>
            </StyledTableCell>
          </StyledTableRow>
      )
    )
    return (
      <Paper className={classes.paper} style={{ minWidth: "500px" }}>
        <Grid item sm={12}>
            <Grid container>
                <Grid item sm={8}>
                  <Typography color="primary" variant="h5">
                    Main Portfolio
                  </Typography>
                </Grid>
                <Grid item sm={4}>
                  <UpdatePortfolioDialog />
                </Grid>
            </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table style={{ minWidth: "500px" }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Symbol</StyledTableCell>
                <StyledTableCell align="right">Shares</StyledTableCell>
                <StyledTableCell align="right">Avg Purchase Price</StyledTableCell>
                <StyledTableCell align="right">Current Price</StyledTableCell>
                <StyledTableCell align="right">Total Value</StyledTableCell>
                <StyledTableCell align="right">Total Gain (%)</StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsMarkup}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }
}

const styles = (theme) => ({
  ...theme.global
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

Portfolio.propTypes = {
  classes: PropTypes.object.isRequired,
  getPortfolioData: PropTypes.func.isRequired,
  deleteStock: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  data: state.portfolio.portfolio,
  loading: state.portfolio.loading
});


export default connect(mapStateToProps, {getPortfolioData, deleteStock})(withStyles(styles)(Portfolio));