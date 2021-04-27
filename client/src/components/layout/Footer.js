import React, { Component } from 'react'
import PropTypes from 'prop-types';

// Material UI
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = (theme) => ({
  ...theme.global
});

export class Footer extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <hr style={{"margin": "20px 0px 10px 0px"}}/>
        <Typography color="primary" variant="h6">
            Social Media
        </Typography>
        <Grid item sm={12}>
            <Grid container>
                <Grid item sm={4}>
                  <b>
                    <p>About</p>
                    <p>Community Guidelines</p>
                    <p>Privacy & Terms</p>
                    <p>Careers</p>
                  </b>
                </Grid>
                <Grid item sm={4}>
                  <b>
                    <p>About</p>
                    <p>Community Guidelines</p>
                    <p>Privacy & Terms</p>
                    <p>Careers</p>
                  </b>
                </Grid>
            </Grid>
        </Grid>
      </div>
    )
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Footer);
