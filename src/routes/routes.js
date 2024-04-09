import express from 'express';
import { createUser, deleteUser } from '../controller/ControllerUser.js';
import { loginUser } from '../controller/ControllerUser.js';
import { privateRoute } from '../controller/ControllerUser.js';
import { checkToken } from '../controller/ControllerUser.js';
import { allUsers } from '../controller/ControllerUser.js';

const router = express.Router();

router.post('/auth/register', createUser);

router.post('/auth/login', loginUser);

router.get('/users', allUsers);

router.get('/user/:id', privateRoute)

router.delete('/user/:id', deleteUser);

export default router;
