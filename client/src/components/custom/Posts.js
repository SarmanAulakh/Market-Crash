import React, { Component } from 'react'
import PropTypes from 'prop-types';

// Components
import Post from "../post/Post";
import PostSkeleton from "../skeletons/PostSkeleton";

// Material UI
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Redux
import { connect } from 'react-redux';

export class Posts extends Component {

  render() {
    const { posts, loading } = this.props.data;
    const { classes, postId } = this.props;

    const postsMarkup = loading ? (
      <PostSkeleton />
    ) : posts === null ? (
      <p>No posts from this user</p>
    ) : !postId ? (
      posts.map((post) => <Post key={post.postId} post={post} />)
    ) : (
      posts.map((post) => {
        if (post.postId !== postId)
          return <Post key={post.postId} post={post} />;
        else return <Post key={post.postId} post={post} openDialog />;
      })
    );

    return (
      <Paper className={classes.paper} style={{ minWidth: "500px" }}>
        <Typography color="primary" variant="h5">
          Recent Activity
        </Typography>
        {postsMarkup}
      </Paper>
    );
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

