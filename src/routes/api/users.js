import { Router } from "express";
import users from '../../data/users.js';

const router = Router();

var data = {
  users: users,
  setUsers: function setUsers(data) {
    this.users = data;
  }
}

router.route('/')

  .get((req, res) => {
    res.json(data.users);
  })

  .post((req, res) => {

    if (!req.body.name || !req.body.username) {
      res.status(400).json({ 'message': 'name and username are required!' })
      return;
    }
    const newUser = {
      id: data.users.at(-1).id + 1 || 1,
      name: req.body.name,
      username: req.body.username
    };
    data.setUsers([...data.users, newUser]);
    res.status(201).json(newUser);
  })

  .put((req, res) => {
    res.status(501).json({
      'error': '501 Not Implemented',
      'message': 'soon inchaallah'
    });
  })

  .delete((req, res) => {
    res.status(501).json({
      'error': '501 Not Implemented',
      'message': 'soon inchaallah'
    });
  })


router.route('/:id')
  .get((req, res) => {
    let usr = data.users.find((usr) => (usr.id == parseInt(req.params.id)));
    if (!usr) {
      res.status(404).json({ 'message': 'user not found' });
      return;
    }
    res.json(usr);
  })


export default router;
