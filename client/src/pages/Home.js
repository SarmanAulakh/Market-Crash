import React, { Component } from 'react'
import PropTypes from 'prop-types';
// Material UI
import Grid from '@material-ui/core/Grid'

// Components
import { Post } from "../components";
import PostSkeleton from "../components/skeletons/PostSkeleton";

// Redux
import { connect } from 'react-redux';
import { getPosts } from "../redux/actions/dataAction";

export class Home extends Component {
  componentDidMount(){
    this.props.getPosts();
  }

  render() {
    const { posts, loading } = this.props.data;

    let recentPostMarkup = !loading ? (
      posts.map((post) => <Post key={post.postId} post={post} />)
    ) : (
      <PostSkeleton />
    );

    return (
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12}>
          hi
        </Grid>
        <Grid item sm={8} xs={12}>
          {recentPostMarkup}
        </Grid>
      </Grid>
    );
  }
}

Home.propTypes = {
  getPosts: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(mapStateToProps, { getPosts })(Home);
