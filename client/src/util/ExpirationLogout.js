// Authentication
// const token = localStorage.FBIdToken;
// if (token) {
//   const decodedToken = jwtDecode(token);
//   //expiry date in milliseconds so * 1000 to get seconds
//   if (decodedToken.exp * 1000 < Date.now()) {
//     store.dispatch(logoutUser());
//     window.location.href = '/login';
//   } else {
//     store.dispatch({ type: SET_AUTHENTICATED });
//     //set in userAction, but also needed here since headers are reset on reload
//     axios.defaults.headers.common['Authorization'] = token;
//     store.dispatch(getUserData());
//   }
// }

// setInterval(() => {
//   const token = localStorage.FBIdToken
//   if(token){
//     const decodedToken = jwtDecode(token)
//     if((decodedToken.exp * 1000) < Date.now){
      
//       store.dispatch(logoutUser())
//       window.location.href = '/login'
//       console.log('logged out')
//     }
//     console.log(decodedToken)
//   }
// }, 300000)  //5 minutes: 300000