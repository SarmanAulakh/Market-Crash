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
import { getPublicUser } from '../redux/actions/dataAction';

export class User extends Component {
  state = {
    profile: null,
    postIdParam: null,
  };

  componentDidMount() {
    //match holds info about url, params, etc. (see Route path in App.js)
    const handle = this.props.match.params.handle;
    const postId = this.props.match.params.postId;

    if (postId) this.setState({ postIdParam: postId });
    this.props.getPublicUser(handle);
  }

  render() {
    return (
      <Fragment>
        <Grid container spacing={2}>
          <Grid item sm={3} xs={12}>
            <Sidebar />
          </Grid>
          <Grid item sm={9} xs={12}>
            {!this.props.profile.users ? (
              <ProfileSkeleton />
            ) : (
              // If logged in user equals public page user
              this.props.profile.users.handle === this.props.user.handle ?
              (
                <UserProfile profile={this.props.user} loggedInUser={true} />
              ) : (
                <UserProfile profile={this.props.profile.users} loggedInUser={false}/>
              )
            )}
            <br  />
            <Portfolio handle={this.props.match.params.handle}  />
            <br  />
            <Metrics />
            <br  />
            <Posts postId={this.state.postIdParam}  />
          </Grid>
        </Grid>
        <Footer />
      </Fragment>
    );;
  }
}

User.propTypes = {
  getPublicUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.data,
  user: state.user.credentials
});

export default connect(mapStateToProps,{ getPublicUser })(User);
