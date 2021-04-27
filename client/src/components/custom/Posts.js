import React, { Component } from 'react'
import PropTypes from 'prop-types';

// Components
import Scream from '../scream/Scream';
import ScreamSkeleton from '../skeletons/ScreamSkeleton';

// Material UI
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Redux
import { connect } from 'react-redux';

export class Posts extends Component {

  render() {
    const { screams, loading } = this.props.data;
    const { classes, screamId } = this.props;

    const screamsMarkup = loading ? (
      <ScreamSkeleton />
    ) : screams === null ? (
      <p>No screams from this user</p>
    ) : !screamId ? (
      screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      screams.map((scream) => {
        if (scream.screamId !== screamId)
          return <Scream key={scream.screamId} scream={scream} />;
        else return <Scream key={scream.screamId} scream={scream} openDialog />;
      })
    );

    return (
      <Paper className={classes.paper} style={{ minWidth: "500px" }}>
        <Typography color="primary" variant="h5">
            Recent Activity
        </Typography>
        {screamsMarkup}
      </Paper>
    )
  }
}

Posts.propTypes = {
  data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

const styles = (theme) => ({
  ...theme.global
});

export default connect(mapStateToProps)(withStyles(styles)(Posts));

