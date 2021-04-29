import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';

// Component
import CustomButton from './CustomButton'

// Material UI
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import CloseIcon from '@material-ui/icons/Close';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// Icons
import UnfoldMore from '@material-ui/icons/UnfoldMore';

// Redux stuff
import { connect } from 'react-redux';
import { clearErrors } from '../../redux/actions/dataAction';
import { postStock } from '../../redux/actions/portfolioAction';
import { Grid } from '@material-ui/core';


export class UpdatePortfolioDialog extends Component {
  state = {
    open: false,
    price: 0,
    symbol: null,
    shares: 0,
    postUpdate: true,
    errors: {}
  }

  componentDidMount() {
    if (this.props.openDialog) {
      this.handleOpen();
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.clearErrors();
    this.setState({ open: false, errors: {} });
  };

  handleChange = (prop) => (event) => {
    this.setState({[prop]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault()
    let current_data = {
      avg_price: 0,
      shares: 0
    }

    if(Object.keys(this.props.data).length !== 0 && this.props.data.portfolioData[this.state.symbol]){
      current_data = {
        avg_price: this.props.data.portfolioData[this.state.symbol].avg_price || 0,
        shares: this.props.data.portfolioData[this.state.symbol].shares || 0
      }
    }

    this.props.postStock({
      symbol: this.state.symbol,
      shares: parseInt(this.state.shares),
      price: parseFloat(this.state.price),
      current_data: current_data,
      post: this.state.postUpdate
    });
  }

  render() {
    const { errors } = this.state;
    const { classes, UI: { loading }} = this.props;
    return (
      <Fragment>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" color="secondary" onClick={this.handleOpen}>
            <span style={{ fontWeight: "bold" }}>Update</span>
          </Button>
        </div>
        <Dialog open={this.state.open} >
          <Grid>
            <Grid container alignItems="center" justify="center">
              <Grid item>
                <DialogTitle>Update Portfolio</DialogTitle>
              </Grid>
              <Grid item>
                <CustomButton
                  tip="Close"
                  onClick={this.handleClose}
                  tipClassName={classes.closeButton}
                >
                  <CloseIcon />
                </CustomButton>
              </Grid>
            </Grid>
          </Grid>
          


          
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <Grid>
                <Grid container spacing={2} alignItems="center" justify="center">
                  <Grid item>
                    <TextField
                      id="standard-number"
                      label="Symbol"
                      type="text"
                      variant="outlined"
                      error={errors.body ? true : false}
                      helperText={errors.body}
                      onChange={this.handleChange("symbol")}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={6} alignItems="center" justify="center">
                  <Grid item>
                    <TextField
                      id="standard-number"
                      label="Shares"
                      type="number"
                      variant="outlined"
                      onChange={this.handleChange("shares")}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center" justify="center">
                  <Grid item>
                    <TextField
                      id="standard-number"
                      label="Price/Share ($)"
                      type="number"
                      variant="outlined"
                      onChange={this.handleChange("price")}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center" justify="center">
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={this.state.postUpdate} 
                          onChange={(e) => this.setState({postUpdate: e.target.checked })} 
                        />
                      }
                      label="Post Update"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center" justify="center">
                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={classes.submitButton}
                      disabled={loading}
                    >
                      Submit
                      {loading && (
                        <CircularProgress
                          size={30}
                          className={classes.progressSpinner}
                        />
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

UpdatePortfolioDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

const styles = (theme) => ({
  ...theme.global,
  submitButton: {
    position: 'relative',
    float: 'right',
    marginTop: 10
  },
  progressSpinner: {
    position: 'absolute'
  }
});

const mapStateToProps = (state) => ({
  UI: state.UI,
  data: state.portfolio.portfolio
});

export default connect(mapStateToProps, { postStock, clearErrors })(withStyles(styles)(UpdatePortfolioDialog));