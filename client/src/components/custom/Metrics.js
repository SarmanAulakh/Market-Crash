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
import { Fragment } from 'react';

const FlexibleXYPlot = makeWidthFlexible(XYPlot)

const styles = (theme) => ({
  ...theme.global
});

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
    let arr = []
    arr.push(this.props.data.history[index])
    this.setState({crosshairValues: arr});
  };

  render() {
    const { classes, data, loading } = this.props;

    const chart = (data.msg === "No data available" || Object.keys(data).length === 0 || data.history.length < 2) ? (
      <Fragment>
        <FlexibleXYPlot
                style={{ position: "relative" }}
                dontCheckIfEmpty
                xDomain={[0, 3]}
                yDomain={[10, 3]}
                height={300}
              >
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis hideTicks title="Empty Chart: Portfolio must be active for atleast 2 days" />
                <YAxis hideTicks />
              </FlexibleXYPlot>
              <p
              style={{
                position: "absolute",
                right: "50%",
                top: "50%",
                transform: "translate(50%, -100%)",
                fontSize: "24px",
                fontStyle: "strong",
                color: "grey"
              }}
              x={300 / 2}
              y={600 / 2}
            >
              Insufficient Data
            </p>
      </Fragment>
    ) : (
      
      <FlexibleXYPlot onMouseLeave={this._onMouseLeave} height={300} xType="ordinal" margin={{left: 70, right: 50, bottom: 80 }}>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis tickLabelAngle={-45} />
        <YAxis tickTotal={10}/>
        <LineSeries
          className="area-series-example"
          color="#D2042D"
          curve="curveLinear"
          data={data.history}
          onNearestX={this._onNearestX}
        />
        <Crosshair
          values={this.state.crosshairValues}
          className={"test-class-name"}
        />
      </FlexibleXYPlot>
    ); 

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
                  <span style={{"color": "black"}}>: ${(data.total_current_value || 0).toFixed(2)}</span>
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography color="secondary" variant="h6">
                  Gain
                  <span style={{"color": "black"}}>: ${((data.total_current_value - data.total_invested) || 0).toFixed(2)}</span>
                </Typography>
              </Grid>
              <Grid item sm={4}>
                <Typography color="secondary" variant="h6">
                  Percentage
                  <span style={{"color": "black"}}>: {(data.gain_percentage || 0 ).toFixed(2)}%</span>
                </Typography>
              </Grid>
          </Grid>
          <Grid item sm={12} style={{ position: "relative" }}>
            {chart}
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
