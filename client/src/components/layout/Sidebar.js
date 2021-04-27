import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Components
import AdBlock from '../custom/AdBlock';
import FollowReccomendation from '../custom/FollowReccomendation';

// Material UI
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  ...theme.global
});

export class Sidebar extends Component {
  render() {
    return (
      <Fragment>
        <AdBlock />
        <br/>
        <FollowReccomendation />
      </Fragment>
    )
  }
}

export default withStyles(styles)(Sidebar)
