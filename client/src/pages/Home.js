import React, { Component } from 'react'
import PropTypes from 'prop-types';
// Material UI
import Grid from '@material-ui/core/Grid'

// Components
import { Scream, Profile } from '../components'
import ScreamSkeleton from '../components/skeletons/ScreamSkeleton'
import ProfileSkeleton from '../components/skeletons/ProfileSkeleton'

// Redux
import { connect } from 'react-redux';
import { getScreams } from '../redux/actions/dataAction';

export class Home extends Component {
  componentDidMount(){
    this.props.getScreams()
  }

  render() {
    const { screams, loading } = this.props.data

    let recentScreamMarkup = !loading ? (
      screams.map(scream => <Scream key={scream.screamId} scream={scream}/>)
    ) : (
      <ScreamSkeleton />
    )

    let profileMarkup = !loading ? (
      <Profile />
    ) : (
      <ProfileSkeleton />
    )

    return (
     <Grid container spacing={2}>
       <Grid item sm={4} xs={12}>
         {profileMarkup}
       </Grid>
       <Grid item sm={8} xs={12}>
         {recentScreamMarkup}
       </Grid>
     </Grid>
    )
  }
}

Home.propTypes = {
  getScreams: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(mapStateToProps, { getScreams })(Home);
