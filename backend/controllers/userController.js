import bcrypt from 'bcryptjs';
import data from '../data.js';  //Get Data to Seed Users
import User from '../models/user.js';   //User Model
import {smsGateway, smsGatewayMessage} from '../send_sms.js';  //import SMS to send OTP
import {
    generateToken, mailgun
} from '../utils.js';   //importing email service and the token generation template

//View Top Sellers
const topSellers = async (req, res) => {
    const topSellers = await User.find({
            isSeller: true
        })
        .sort({
            'seller.rating': -1
        })
        .limit(3);
    res.send(topSellers);
}

//Seed Users
const seed = async (req, res) => {
    // await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({
        createdUsers
    });
}

//LOG IN
const logging = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    });
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isSeller: user.isSeller,
                token: generateToken(user),
            });
            return;
        }
    }
    res.status(401).send({
        message: 'Invalid email or password'
    });
}

//Send Message Gateway 
const send_message = (req, res) => {
    const { recipient } = req.query;
    const code = Math.floor(Math.random()*90000) + 10000
    const sms = smsGateway(recipient, code);
    res.json(code);
}
//User Registration
const register = async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: bcrypt.hashSync(req.body.password, 8),
    });
    
    const createdUser = await user.save();
    const messages = "You Have Successfully Registered to Emporium";
    const message = smsGatewayMessage(user.mobile, messages);
    mailgun()
      .messages()
      .send({
          from: "Emporium <asqarrsl@gmail.com>",
          to: `${user.name} <${user.email}>`,
          subject: `Wellcome to Emproium`,
          html: "You Have Successfully Registered to Emporium",
        },
        (error, body) => {
          if (error) {
            console.log(error);
          } else {
            console.log(body);
          }
        }
      );
    res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        isSeller: user.isSeller,
        token: generateToken(createdUser),
    });

}

//View User
const show = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        res.send(user);
    } else {
        res.status(404).send({
            message: 'User Not Found'
        });
    }
}


//User Profile
const profile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isSeller = req.body.isSeller || user.isSeller;
        if (user.isSeller) {
            user.seller.name = req.body.sellerName || user.seller.name;
            user.seller.logo = req.body.sellerLogo || user.seller.logo;
            user.seller.description =
                req.body.sellerDescription || user.seller.description;
        }
        if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
        }
        const updatedUser = await user.save();
        res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            isSeller: user.isSeller,
            token: generateToken(updatedUser),
        });
    }
}

//View All Users
const index = async (req, res) => {
    const users = await User.find({});
    res.send(users);
}

//Delete Users
const deletes = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if (user.email === 'admin@example.com') {
            res.status(400).send({
                message: 'Can Not Delete Admin User'
            });
            return;
        }
        const deleteUser = await user.remove();
        res.send({
            message: 'User Deleted',
            user: deleteUser
        });
    } else {
        res.status(404).send({
            message: 'User Not Found'
        });
    }
}

// Update User
const update = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isSeller = Boolean(req.body.isSeller);
        user.isAdmin = Boolean(req.body.isAdmin);
        // user.isAdmin = req.body.isAdmin || user.isAdmin;
        const updatedUser = await user.save();
        res.send({
            message: 'User Updated',
            user: updatedUser
        });
    } else {
        res.status(404).send({
            message: 'User Not Found'
        });
    }
}

export {
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
};