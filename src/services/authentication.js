import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

function getAuthHeader(accessToken) {
  return { 'Authorization': `Bearer ${accessToken}` };
}

var params = {
  'grant_type': 'authorization_code',
  'client_id': process.env.UID,
  'client_secret': process.env.SECRET,
  'code': '',
  'redirect_uri': process.env.RURI
}

async function getAccessToken(code) {
  // post request
  params.code = code;
  // send code to 42 api
  let { data } = await axios.post(process.env.AC_URI, {}, {
    params: params
  });
  // if success return access token
  // errors will be catched out of scope
  return data.access_token;
}


async function getUserData(accessToken) {
  const header = getAuthHeader(accessToken);
  // send request with Authorization header
  let { data } = await axios.get(process.env.DATA_URI, {
    headers: header
  });
  // if success return user data
  // errors will be catched out of scope

  // get only info we are interested in
  let user = {
    id: data.id,
    email: data.email,
    login: data.login,
    image_url: data.new_image_url
  }
  return user;
}


export { getAccessToken, getUserData }

var usrEX = {
  "id": 53954,
  "email": "keddib@student.1337.ma",
  "login": "keddib",
  "new_image_url": "https://profile.intra.42.fr/users/keddib/photo",
}
