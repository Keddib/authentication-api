import { Router } from "express";
import fsPromises from "fs/promises";
import path from 'path';
import { __dirname } from '../config/dirname.js';
import { createRequire } from "module";
import { getAccessToken, getUserData } from "../services/authentication.js";
const require = createRequire(import.meta.url);

const router = Router();

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
    // if not return 401
    if (!code) {
      res.status(401).json({ 'Not Authorized': 'code is required' });
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

      if (exist) {
        res.json(newUser);
        return;
      }

      // add user to data
      data.setUsers([...data.users, newUser]);
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
