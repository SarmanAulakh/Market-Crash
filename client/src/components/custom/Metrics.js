import React, { Component } from 'react'
import PropTypes from 'prop-types';

// Material UI
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

// React-vis - Charts
import '../../../node_modules/react-vis/dist/style.css';
import {
  XYPlot, 
  makeWidthFlexible,
  XAxis, 
  YAxis, 
  LineSeries, 
  VerticalGridLines, 
  HorizontalGridLines,
  Crosshair
} from 'react-vis';

// Redux
import { connect } from 'react-redux';

const FlexibleXYPlot = makeWidthFlexible(XYPlot)

const styles = (theme) => ({
  ...theme.global
});

const DATA = [
  [{x: 1, y: 10}, {x: 2, y: 5}, {x: 3, y: 15}]
];



export class Metrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crosshairValues: []
    };
  }

  _onMouseLeave = () => {
    this.setState({crosshairValues: []});
  };

  _onNearestX = (value, {index}) => {
    this.setState({crosshairValues: DATA.map(d => d[index])});
  };

  render() {
    const { classes, data, loading } = this.props;

    const markup = loading ? (
      <p>loading</p>
    ) : Object.keys(data).length === 0  ? (
      <p>No data</p>
    ) : (
      <Grid item sm={12}>
          <Grid container>
              <Grid item sm={4}>
                <Typography color="secondary" variant="h6">
                  Balance
                  <span style={{"color": "black"}}>: ${data.total_current_value}</span>
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography color="secondary" variant="h6">
                  Gain
                  <span style={{"color": "black"}}>: ${data.total_current_value - data.total_invested}</span>
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography color="secondary" variant="h6">
                  Percentage
                  <span style={{"color": "black"}}>: {data.gain_percentage.toFixed(2)}%</span>
                </Typography>
              </Grid>
          </Grid>
          <Grid item sm={12}>
          <FlexibleXYPlot onMouseLeave={this._onMouseLeave} height={300}>
            <VerticalGridLines />
            <HorizontalGridLines />
            {/* <XAxis hideTicks/> */}
            <XAxis />
            <YAxis />
            <LineSeries
              className="area-series-example"
              color="#D2042D"
              curve="curveNatural"
              data={data.weekly_balances || [{x: 1, y: 10}, {x: 2, y: 5}, {x: 3, y: 15}]}
              onNearestX={this._onNearestX}
            />
            <Crosshair
              values={this.state.crosshairValues}
              className={'test-class-name'}
            />
          </FlexibleXYPlot>
          </Grid>
        </Grid>
    )


    return (
      <Paper className={classes.paper} style={{ minWidth: "500px" }}>
        <Typography color="primary" variant="h5">
            Portfolio Metrics
        </Typography>
        {markup}
      </Paper>
    );
  }
}


Metrics.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.portfolio.portfolio,
  loading: state.portfolio.loading
});

export default connect(mapStateToProps)(withStyles(styles)(Metrics));
