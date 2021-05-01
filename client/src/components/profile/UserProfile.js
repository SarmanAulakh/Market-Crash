import React, { Component } from 'react'
import PropTypes from 'prop-types';

// Components
import CustomButton from '../custom/CustomButton'
import EditDetails from './EditDetails'

// Material UI
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

//Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';


// Redux
import { connect } from 'react-redux'
import { uploadImage } from '../../redux/actions/userAction';
import { Fragment } from 'react';


const styles = (theme) => ({
  ...theme.global
});

export class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.editImage = React.createRef()
  }

  handleImageChange = (event) => {
    const image = event.target.files[0]
    const formData = new FormData()
    formData.append('image', image, image.name)
    this.props.uploadImage(formData)
  }

  handleEditPicture = () => {
    this.editImage.current.click()
  }

  render() {
    const {
      classes,
      profile: { handle, imageUrl, bio, website, location },
      loggedInUser
    } = this.props;
    return (
      <Paper className={classes.paper} style={{ minWidth: "500px" }}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img src={imageUrl} alt="profile" className="profile-image" />
            {loggedInUser ? (
              <Fragment>
                <input
                  type="file"
                  ref={this.editImage}
                  hidden="hidden"
                  onChange={this.handleImageChange}
                />
                <CustomButton
                  tip="Edit profile picture"
                  onClick={this.handleEditPicture}
                  btnClassName="button"
                >
                  <EditIcon color="primary" />
                </CustomButton>
              </Fragment>
            ) : null}
            <div className="content-wrapper">
              <div style={{ position: "relative" }}>
                <Typography color="primary" variant="h5">
                  {handle}
                </Typography>
                <p>{bio}</p>
                <p>{location}</p>
                <p>{website}</p>
              </div>

              <div
                style={{
                  textAlign: "center",
                }}
              >
                <p>
                  Posts <br /> 0
                </p>
                <p>
                  Followers <br /> 0
                </p>
                <p>
                  Folllowing <br /> 0
                </p>
              </div>
            </div>
          </div>
        </div>
      </Paper>
    );
  }
}

UserProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default connect(null, {uploadImage})(withStyles(styles)(UserProfile))

