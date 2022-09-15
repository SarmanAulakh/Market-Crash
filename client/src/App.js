
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MuiThemeProvider } from '@material-ui/core/styles';
import createTheme from '@material-ui/core/styles/createMuiStrictModeTheme';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import './App.css';

// Pages
import { Home, Login, Signup, User } from './pages/index';

// Components
import { Navbar } from './components/index';

// Util
import ThemeObj from './util/Theme'
import AuthRoute from './util/AuthRoute'

// Redux
import { Provider } from 'react-redux'
import store from './redux/store'
import { SET_AUTHENTICATED } from './redux/types'
import { logoutUser, getUserData } from './redux/actions/userAction'

const theme = createTheme(ThemeObj)
//"proxy": "https://us-central1-socialmedia-5f158.cloudfunctions.net/api" in package.json only works for dev (not prd)
axios.defaults.baseURL = 'https://us-central1-socialmedia-5f158.cloudfunctions.net/api'


// Authentication - Token lasts for 60 mins and refreshes (no need to relogin) unless one of the following happens:
/*
  -User logs out
  -The user is deleted
  -The user is disabled
  -A major account change is detected for the user. This includes events like password or email address updates.
*/
const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  //expiry date in milliseconds so * 1000 to get seconds
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = '/login';
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    //set in userAction, but also needed here since headers are reset on reload
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <AuthRoute exact path="/login" component={Login} />
              <AuthRoute exact path="/signup" component={Signup} />
              <Route exact path="/users/:handle" render={(props) => <User {...props} key={Date.now()}/>} />
              <Route
                exact
                path="/users/:handle/post/:postId"
                component={User}
              />
            </Switch>
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
