const isEmpty = (string) => (string.trim() === '') ? true : false

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(regEx) ? true : false
}

const validateSignup = (newUser) => {
  let errors = {}

  if(isEmpty(newUser.email)) 
    errors.email= 'Must not be empty'
  else if(!isEmail(newUser.email)) 
    errors.email = 'Must be a valid email address'

  if(isEmpty(newUser.password)) errors.password = 'Must not be empty'
  if(newUser.password != newUser.confirmPassword) errors.confirmPassword = 'Passwords must match'
  if(isEmpty(newUser.handle)) errors.handle = 'Must not be empty'

  return {
    errors: errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

const validateLogin = (user) => {
  let errors = {}
  if(isEmpty(user.email)) errors.email= 'Must not be empty'
  if(isEmpty(user.password)) errors.password = 'Must not be empty'

  return {
    errors: errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

const reduceUserDetails = (data) => {
  let userDetails = {};

  if(!isEmpty(data.bio.trim())) userDetails.bio = data.bio

  // https://website.com, then save as is, otherwise add http (no "s" since we dont no if it has ssl certificate)
  if(!isEmpty(data.website.trim())) userDetails.website = data.website.trim().includes('http') ? data.website : `http://${data.website}`

  if(!isEmpty(data.location.trim())) userDetails.location = data.location

  return userDetails
}

module.exports = { isEmpty, isEmail, validateSignup, validateLogin, reduceUserDetails }