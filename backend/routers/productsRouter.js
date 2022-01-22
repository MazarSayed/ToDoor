import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import {
    isAdmin,
    isAuth,
    isSellerOrAdmin
} from '../utils.js';
import {
    index,
    categories,
    seed,
    show,
    store,
    update,
    deletes,
    postReviews
} from "../controllers/productController.js";


const productRouter = express.Router();

// =>/api/products/
productRouter.get('/', expressAsyncHandler(index));

// =>/api/products/categories
productRouter.get('/categories', expressAsyncHandler(categories));

// =>/api/products/seed
productRouter.get('/seed', expressAsyncHandler(seed));

// =>/api/products/:id
productRouter.get('/:id', expressAsyncHandler(show));

// =>/api/products/
productRouter.post('/', isAuth, isSellerOrAdmin, expressAsyncHandler(store));

// =>/api/products/:id
productRouter.put('/:id', isAuth, isSellerOrAdmin, expressAsyncHandler(update));

// =>/api/products/:id
productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(deletes));

// =>/api/products/:id/reviews
productRouter.post('/:id/reviews', isAuth, expressAsyncHandler(postReviews));


export default productRouter;