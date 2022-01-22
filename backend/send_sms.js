import dotenv from 'dotenv';
import clients from 'twilio'

dotenv.config();

// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

const accountSid = process.env.TWILIO_ACCOUNT_SID; //account id
const authToken = process.env.TWILIO_AUTH_TOKEN; //account authetication key
const number = process.env.TWILIO_NUMBER; //phone number registered under Emorium to send messages

const client = clients(accountSid, authToken)

//Function to send OTP for Verification
const smsGateway = (to,code) =>{
  client.messages.create({
     body: `Your Verification Code is ${code}`, //body of message
     from: `+${number}`, //phone number registered under Emorium to send messages
     to: `+${to}` //recipient
   }).then(message => {return({message : message.sid})});
}

//Function to send Message 
const smsGatewayMessage = (to,message) =>{
  client.messages.create({
     body: `${message}`, //body of message
     from: `+${number}`, //number registered under Emorium to send messages
     to: `+${to}` //recipient
   }).then(message => {return({message : message.sid})});
}

export {smsGateway,smsGatewayMessage};