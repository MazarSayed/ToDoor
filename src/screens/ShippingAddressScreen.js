import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../actions/cart";
import CheckoutSteps from "../components/CheckoutSteps";
import MessageBox from "../components/MessageBox";
import { validateName, validatePostalCode } from "../validation";

export default function ShippingAddressScreen(props) {

  const userSignin = useSelector((state) => state.userSignin);

  const { userInfo } = userSignin;
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!userInfo) {
    props.history.push("/signin");
  }

  const [fullName, setFullName] = useState(shippingAddress.fullName);
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);
  const [validation, setvalidation] = useState(null);
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    
    e.preventDefault();

    let moveOn = true;

    const nameResponse = validateName(fullName);
    const postalcodeResponse = validatePostalCode(postalCode);

    if (
      postalcodeResponse !== "true" ||
      nameResponse !== "true" ||
      !address.trim().length ||
      !city.trim().length ||
      !country.trim().length
    ) {
      if (nameResponse !== "true") return setvalidation(nameResponse);
      if (postalcodeResponse !== "true")
        return setvalidation(postalcodeResponse);
      if (!address.trim().length) return setvalidation("Address is invalid");
      if (!city.trim().length) return setvalidation("City is invalid");
      if (!country.trim().length) return setvalidation("Country is invalid");
    } else {
      setvalidation(true);
      if (moveOn) {
        dispatch(
          saveShippingAddress({
            fullName,
            address,
            city,
            postalCode,
            country,
            lat: "",
            lng: "",
          })
        );
        props.history.push("/payment");
      }
    }
  };

  return (
    <div>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1 class="mainh1">Shipping Address</h1>
        </div>
        {validation && validation !== true && (
          <MessageBox variant="danger">{validation}</MessageBox>
        )}
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            placeholder="Enter full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            placeholder="Enter postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            placeholder="Enter country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          ></input>
        </div>

        <div>
          <label />
          <button className="primary" type="submit">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
