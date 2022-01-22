import Order from "../models/order.js";   // Order Model
import User from "../models/user.js";   // User Model
import Product from "../models/product.js";   // Product Model

import {
  mailgun,
  payOrderEmailTemplate
} from "../utils.js";     //importing email service and the email template

import { smsGatewayMessage } from "../send_sms.js";   //importing SMS Service to send OTP

//All Orders
const index = async (req, res) => {
  const seller = req.query.seller || "";
  const sellerFilter = seller ? {
    seller
  } : {};

  const orders = await Order.find({
    ...sellerFilter
  }).populate(
    "user",
    "name"
  );
  res.send(orders);
}

//Summary of Products
const summary = async (req, res) => {
  const orders = await Order.aggregate([{
    $group: {
      _id: null,
      numOrders: {
        $sum: 1
      },
      totalSales: {
        $sum: "$totalPrice"
      },
    },
  }, ]);
  const users = await User.aggregate([{
    $group: {
      _id: null,
      numUsers: {
        $sum: 1
      },
    },
  }, ]);
  const dailyOrders = await Order.aggregate([{
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt"
          }
        },
        orders: {
          $sum: 1
        },
        sales: {
          $sum: "$totalPrice"
        },
      },
    },
    {
      $sort: {
        _id: 1
      }
    },
  ]);
  const productCategories = await Product.aggregate([{
    $group: {
      _id: "$category",
      count: {
        $sum: 1
      },
    },
  }, ]);
  res.send({
    users,
    orders,
    dailyOrders,
    productCategories
  });
}

//My Orders
const mine = async (req, res) => {
  const orders = await Order.find({
    user: req.user._id
  });
  res.send(orders);
}

//Add Orders
const store = async (req, res) => {
  if (req.body.orderItems.length === 0) {
    res.status(400).send({
      message: "Cart is empty"
    });
  } else {
    const order = new Order({
      seller: req.body.orderItems[0].seller,
      orderItems: req.body.orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });
    const createdOrder = await order.save();
    res
      .status(201)
      .send({
        message: "New Order Created",
        order: createdOrder
      });
  }
}

//View Order
const show = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    res.send(order);
  } else {
    res.status(404).send({
      message: "Order Not Found"
    });
  }
}

//Update Order
const update = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "email name mobile"
  );
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    const updatedOrder = await order.save();
    mailgun()
      .messages()
      .send({
          from: "Emporium <asqarrsl@gmail.com>",
          to: `${order.user.name} <${order.user.email}>`,
          subject: `New order ${order._id}`,
          html: payOrderEmailTemplate(order),
        },
        (error, body) => {
          if (error) {
            console.log(error);
          } else {
            console.log(body);
          }
        }
      );
    const messages = "Payment Has Been Confirmed, Your Order will be Delivered in 5-10 days";
    const {message} = smsGatewayMessage(order.user.mobile, messages);
    
    res.send({
      message: "Order Paid",
      order: updatedOrder
    });
  } else {
    res.status(404).send({
      message: "Order Not Found"
    });
  }
}

//Delete Order
const deletes = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    const deleteOrder = await order.remove();
    res.send({
      message: "Order Deleted",
      order: deleteOrder
    });
  } else {
    res.status(404).send({
      message: "Order Not Found"
    });
  }
}

//Deliver Order
const deliver = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.send({
      message: "Order Delivered",
      order: updatedOrder
    });
  } else {
    res.status(404).send({
      message: "Order Not Found"
    });
  }
}


export {
  index,
  summary,
  mine,
  store,
  show,
  update,
  deletes,
  deliver
};