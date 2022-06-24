import { Router } from "express";
import fsPromises from "fs/promises";
import path from 'path';
import { __dirname } from '../config/dirname.js';
import { createRequire } from "module";
import { getAccessToken, getUserData } from "../services/authentication.js";
import jwt from "jsonwebtoken";
const require = createRequire(import.meta.url);

const router = Router();



function getJWTtokens(username) {
  const accessToken = jwt.sign(
    { "login": username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30s' }
  );
  const refreshToken = jwt.sign(
    { "login": username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d ' }
  );

  return [accessToken, refreshToken];
}


var data = {
  users: require('../data/users.json'),
  setUsers: function setUsers(data) {
    this.users = data;
  }
}

router.route('/')
  .get((req, res) => {
    res.json({
      messaage: 'welcome to authentication api'
    })
  })

  .post(async (req, res) => {
    // get code from query string
    let code = req.query?.code;
    // if not return 400
    if (!code) {
      res.status(400).json({ 'Bad Request': 'code is required' });
      return;
    }
    try {
      const aToken = await getAccessToken(code);
      const newUser = await getUserData(aToken);
      // if user already exict return user data with 200 OK status
      // otherwise add user return  user data with 201 created status
      // check if user already exict
      const exist = data.users.find((usr) => {
        return usr.id == newUser.id;
      });

      const [accessToken, refreshToken] = getJWTtokens(newUser.username);

      if (exist) {
        exist.refreshToken = refreshToken;
        await fsPromises.writeFile(
          path.join(__dirname, "..", "data", "users.json"),
          JSON.stringify(data.users)
        );
        console.log(data.users);
        res.json(newUser);
        return;
      }

      // add user to data
      let addedUser = newUser;
      addedUser.refreshToken = refreshToken;
      data.setUsers([...data.users, addedUser]);
      await fsPromises.writeFile(
        path.join(__dirname, "..", "data", "users.json"),
        JSON.stringify(data.users)
      );
      console.log(data.users);
      return res.status(201).json(newUser);

    } catch (e) {
      if (e.response) {
        res.status(e.response.status).json(e.response.data);
        return;
      }
      res.status(500).json({ message: e.messaage });
    }
  })

export default router;
