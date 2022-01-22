import express from "express";
import catchAsync from "express-async-handler";

import {
    index,
    summary,
    mine,
    store,
    show,
    update,
    deletes,
    deliver
} from "../controllers/ordersController.js";

import {
    isAdmin,
    isAuth,
    isSellerOrAdmin
} from "../utils.js";

const orderRouter = express.Router();

// => /api/orders/
orderRouter.get("/", isAuth, isSellerOrAdmin, catchAsync(index));

// => /api/orders/summary
orderRouter.get("/summary", isAuth, isAdmin, catchAsync(summary));

// => /api/orders/mine
orderRouter.get("/mine", isAuth, catchAsync(mine));

// => /api/orders/
orderRouter.post("/", isAuth, catchAsync(store));

// => /api/orders/:id
orderRouter.get("/:id", isAuth, catchAsync(show));

// => /api/orders/:id/pay
orderRouter.put("/:id/pay", isAuth, catchAsync(update));

// => /api/orders/
orderRouter.delete("/:id", isAuth, isAdmin, catchAsync(deletes));

// => /api/orders/
orderRouter.put("/:id/deliver", isAuth, isAdmin, catchAsync(deliver));

export default orderRouter;