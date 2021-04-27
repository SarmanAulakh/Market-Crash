import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


const styles = (theme) => ({
  ...theme.global
});

const UserProfile = (props) => {
  const {
    classes,
    profile: { handle, imageUrl, bio, website, location }
  } = props;

  return (
    <Paper className={classes.paper} style={{"minWidth": "500px"}}>
      <div className={classes.profile}>
        <div style={customStyles.wrapper}>
          <img src={imageUrl} alt="profile" className="profile-image" style={customStyles.profileImage}/>
          <div style={{...customStyles.wrapper, 
            "paddingLeft": 20, 
            "justifyContent": "space-between",
            "width": "100%"
            }}>
            <div>
              <Typography color="primary" variant="h5" >
                  {handle}
              </Typography>
              <p>{bio}</p>
              <p>{location}</p>
              <p>{website}</p>
            </div>
            <div style={{
              "textAlign": "center"
            }}>
              <p>Posts <br/> 0</p>
              <p>Followers  <br/> 0</p>
              <p>Folllowing  <br/> 0</p>
            </div>
          </div>
        </div>
      </div>
    </Paper>
  )
}

const customStyles = {
  profileImage: {
    width: 150,
    height: 150
  },
  wrapper: {
    display: "flex",
    flexWrap: "nowrap",
  }
}



UserProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UserProfile);
