import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';

// Components
import UserProfile from '../components/profile/UserProfile';
import Grid from '@material-ui/core/Grid';
import ProfileSkeleton from '../components/skeletons/ProfileSkeleton';
import Sidebar from '../components/layout/Sidebar'
import Portfolio from '../components/custom/Portfolio'
import Metrics from '../components/custom/Metrics';
import Footer  from '../components/layout/Footer'
import Posts from '../components/custom/Posts'

// Redux
import { connect } from 'react-redux';
import { getPublicUserPosts } from '../redux/actions/dataAction';

export class User extends Component {
  state = {
    profile: null,
    screamIdParam: null
  }

  componentDidMount() {
    //match holds info about url, params, etc. (see Route path in App.js)
    const handle = this.props.match.params.handle;
    const screamId = this.props.match.params.screamId;

    if (screamId) this.setState({ screamIdParam: screamId });

    // TODO: combine below calls to 1 action (think about public/private pages) 
    //gets the users posts only
    this.props.getPublicUserPosts(handle);

    //gets the users details
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        this.setState({
          profile: res.data.user
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <Fragment>
        <Grid container spacing={2}>
          <Grid item sm={3} xs={12}>
            <Sidebar />
          </Grid>
          <Grid item sm={9} xs={12}>
            {this.state.profile === null ? (
              <ProfileSkeleton />
            ) : (
              <UserProfile profile={this.state.profile} />
            )}
            <br/>
            <Portfolio handle={this.props.match.params.handle}/>
            <br/>
            <Metrics />
            <br/>
            <Posts screamId={this.state.screamIdParam}/>
          </Grid>
        </Grid>
        <Footer />
      </Fragment>
    )
  }
}

User.propTypes = {
  getPublicUserPosts: PropTypes.func.isRequired
};

// const mapStateToProps = (state) => ({
//   profile: state.data
// });

export default connect(null,{ getPublicUserPosts })(User);
