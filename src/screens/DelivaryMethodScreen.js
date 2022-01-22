import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';

export default function DelivaryMethodScreen(props) {

  const [delivaryMethod, setDelivaryMethod] = useState('DHL');

  const submitHandler = (e) => {
    e.preventDefault();
    props.history.push('/placeorder');
  };
  
  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Delivery Method</h1>
        </div>
        <div>
          <div>
          <label htmlFor="dhl">
            <input
              type="radio"
              id="delivery"
              value="dhl"
              name="delivery"
              checked 
              onChange={(e) => setDelivaryMethod(e.target.value)}
              ></input>
              &nbsp;
            DHL</label>
          </div>
          <br></br>
          <div>
          <label htmlFor="domex">
            <input
              type="radio"
              id="delivery"
              value="domex"
              name="delivery"
              onChange={(e) => setDelivaryMethod(e.target.value)}
            ></input>
            &nbsp;
            Domex</label>
          </div>
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
