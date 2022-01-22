import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { register } from "../actions/user";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { validateEmail, validateName, validatePassword,validateMobile } from "../validation";

export default function RegisterScreen(props) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validation, setvalidation] = useState(null);
  const [recipient, setrecipient] = useState(null);
  const [recipientvalid, setrecipientvalid] = useState(null);
  const [mobile, setmobile] = useState(null);
  const [code, setcode] = useState(null);
  const [Otps, setOtps] = useState(null);

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error } = userRegister;

  const dispatch = useDispatch();

  const otpgen = async(e) =>{

    e.preventDefault()
    const setnumber = recipient;
    setrecipientvalid(setnumber);
    // alert(setnumber);
    const MobileResponse = validateMobile(setnumber);
    if(MobileResponse !== "true"){
      return setvalidation(MobileResponse);
    }else{
      try{  
        setmobile(setnumber);
        const {data} = await axios.get(`/api/users/send-text?recipient=${setnumber}`);
        setcode(data);
      }catch(e){
      }
      setvalidation(true);
    }
  }

  const submitHandler = (e) => {
    e.preventDefault();
    // await setOtps(e.target.elements.otp.value);
    const nameResponse = validateName(name);
    const emailResponse = validateEmail(email);
    const passwordResponse = validatePassword(password);

    if (
      emailResponse !== "true" ||
      passwordResponse !== "true" ||
      nameResponse !== "true" || 
      password !== confirmPassword ||
      recipient !== recipientvalid ||
      !Otps.trim().length  || 
      Otps != code
    ) {
      if (nameResponse !== "true") return setvalidation(nameResponse);
      if (emailResponse !== "true") return setvalidation(emailResponse);
      if (recipient !== recipientvalid) return setvalidation("Not Verified Number");
      if (!Otps.trim().length) return setvalidation("Validate you Number Using OTP code");
      if (Otps != code) return setvalidation("OTP code Invalid");
      if (passwordResponse !== "true") return setvalidation(passwordResponse);
      if (password !== confirmPassword)
        return setvalidation("Password and confirm password are not match");
    } else {
      setvalidation(true);
      dispatch(register(name, email,mobile, password));
    }
  };
  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [props.history, redirect, userInfo]);
  
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Create Account</h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {validation && validation !== true && (
          <MessageBox variant="danger">{validation}</MessageBox>
        )}
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter name"
            required
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="text">Mobile address</label>
          <input
            type="text"
            id="mobile"
            placeholder="Enter mobile"
            required
            onChange={(e) => setrecipient(e.target.value)}
          ></input>
          <button className="primary" onClick={otpgen}>
            Send OTP
          </button>
        </div>
        
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Enter confirm password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="text">OTP code</label>
          <input
            type="text"
            id="otp"
            placeholder="Enter OTP"
            required
            onChange={(e) => setOtps(e.target.value)}
          ></input>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Register
          </button>
        </div>
        <div>
          <label />
          <div>
            Already have an account?{" "}
            <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
