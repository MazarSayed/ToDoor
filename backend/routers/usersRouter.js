import express from 'express';
import catchAsync from 'express-async-handler';

import {
    isAdmin,
    isAuth
} from '../utils.js';

import {
    topSellers,
    seed,
    logging,
    index,
    update,
    register,
    show,
    profile,
    deletes,
    send_message
} from '../controllers/userController.js';

const userRouter = express.Router();

// =>/api/users/top-sellers
userRouter.get('/top-sellers', catchAsync(topSellers));

// =>/api/users/seed
userRouter.get('/seed', catchAsync(seed));

// =>/api/users/signin
userRouter.post('/signin', catchAsync(logging));

// =>/api/users/send-text
userRouter.get('/send-text',catchAsync(send_message));

// =>/api/users/register
userRouter.post('/register', catchAsync(register));

// =>/api/users/profile
userRouter.put('/profile', isAuth, catchAsync(profile));

// =>/api/users/
userRouter.get('/', isAuth, isAdmin, catchAsync(index));

// =>/api/users/:id
userRouter.get('/:id', catchAsync(show));

// =>/api/users/:id
userRouter.delete('/:id', isAuth, isAdmin, catchAsync(deletes));

// =>/api/users/:id
userRouter.put('/:id', isAuth, isAdmin, catchAsync(update));


export default userRouter;