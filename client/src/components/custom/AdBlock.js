import React from 'react'
import PropTypes from 'prop-types';

// Material UI
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';

export function AdBlock(props) {
  return (
    <Paper className={props.classes.paper}>
      <p>AD</p>
    </Paper>
  )
}

const styles = (theme) => ({
  ...theme.global
});

AdBlock.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AdBlock);