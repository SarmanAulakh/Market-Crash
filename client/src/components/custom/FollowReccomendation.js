import React, { Component } from 'react'
import PropTypes from 'prop-types';

// Material UI
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';

export class FollowReccomendation extends Component {
  render() {
    const { classes } = this.props
    return (
      <Paper className={classes.paper}>
        FollowReccomendation
      </Paper>
    )
  }
}

const styles = (theme) => ({
  ...theme.global
});

FollowReccomendation.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FollowReccomendation);
