import React, { Fragment } from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Component
import CustomButton from '../custom/CustomButton'
import PostPost from '../post/PostPost'
import Notifications from './Notifications'
import EditDetails from '../profile/EditDetails'

// Material UI - importing seperately rather than destructuring @material-ui/core since its a big file 
import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/ToolBar'
import Button from '@material-ui/core/Button'
import { fade, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// Icons
import HomeIcon from '@material-ui/icons/Home';

// Redux
import { connect } from 'react-redux';
import { logoutUser } from '../../redux/actions/userAction';

export function Navbar(props) {
  const { authenticated, user: { imageUrl, handle } } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    props.logoutUser();
    handleMenuClose();
  }

  return (
    <div className={classes.grow}>
      <AppBar>
        <ToolBar className={classes.wrapper}>
          <Typography className={classes.title} variant="h6" noWrap>
            Social Media
          </Typography>
          <div className={classes.grow} />
          {authenticated ? (
            <Fragment>
              <div className={classes.grow} />
              <PostPost />
              <Link to="/">
                <CustomButton tip="Home">
                  <HomeIcon />
                </CustomButton>
              </Link>
              <Notifications />
              <MenuItem onClick={handleProfileMenuOpen}>
                <CustomButton tip="">
                  <img
                    src={imageUrl}
                    alt="profile"
                    className={classes.profileImg}
                  />
                </CustomButton>
              </MenuItem>
            </Fragment>
          ) : (
            <Fragment>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </Fragment>
          )}
        </ToolBar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        id={1}
        keepMounted
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        style={{ "top": "40px" }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={logout}>
          <Link to="/login">Logout</Link>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Link to={`/users/${handle}`}>View Profile</Link>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditDetails />
        </MenuItem>
      </Menu>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  wrapper: {
    [theme.breakpoints.up('lg')]: {
      width: "1200px",
      margin: "0 auto",
    },
  },
}));

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  user: state.user.credentials
});

export default connect(mapStateToProps, { logoutUser })(Navbar);
