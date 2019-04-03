import React, { useState, useRef } from "react";
import { Button, Label, Header, Form, Radio } from "semantic-ui-react";
import trim from "lodash/trim";
import isEmpty from "lodash/isEmpty";
import PairingInput from "./PairingInput";

const AddAlert = props => {
  const [formErrors, setFormErrors] = useState({});
  const [alertType, setAlertType] = useState(null);
  const [pairingSymbol, setPairingSymbol] = useState('');

  // const pairingRef = useRef();
  const priceRef = useRef();

  const handleSubmit = async e => {
    e.preventDefault();
    
    // const pairing = trim(pairingRef.current.value.toUpperCase());
    const pairing = pairingSymbol;
    const price = Number(trim(priceRef.current.value));
    
    // validate form
    let formErrors = {};

    // validate pairing
    // check not empty
    if (pairing === "") {
      console.log("pairing empty", pairing);
      formErrors.pairing = "Please enter a Pairing Symbol";
    }

    // validate price
    if (trim(priceRef.current.value) === "") {
      formErrors.price = "Please enter a Price";
    }
    // check is number
    if (isNaN(price)) {
      formErrors.price = "Invalid Price";
    }

    // validate alertType
    if (!alertType) {
      formErrors.alertType = "Please select alert type";
    }

    if (!isEmpty(formErrors)) {
      // console.log('formErrors', formErrors);
      setFormErrors(formErrors);
      return;
    }

    const alertData = {
      pairing,
      price,
      alertType
    };

    try {
      await props.addAlert(alertData);
      props.history.push("/alertslist");
    } catch (resErr) {
      // server validation failed, either, bad pairing symbol
      // or alertType + price not make sense for current price
      if (resErr.response) {
        setFormErrors(resErr.response.data);
      }
    }
  };

  return (
    <React.Fragment>
      <Header textAlign="center" as="h2">
        Add Alert
      </Header>
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Field error={!!formErrors.pairing}>
          <label>Pairing Symbol</label>
          {/* <input ref={pairingRef} placeholder="e.g. BTCUSDT" /> */}
          <PairingInput setPairingSymbol={setPairingSymbol} />
          {!!formErrors.pairing && <Label pointing>{formErrors.pairing}</Label>}
        </Form.Field>
        <Form.Field error={!!formErrors.price}>
          <label>Price</label>
          <input ref={priceRef} placeholder="e.g. 4000" />
          {!!formErrors.price && <Label pointing>{formErrors.price}</Label>}
        </Form.Field>
        <Form.Field error={!!formErrors.alertType}>
          <Radio
            label="Buy"
            name="radioGroup"
            value="BUY"
            checked={alertType === "BUY"}
            onChange={() => setAlertType("BUY")}
          />
          <Radio
            label="Sell"
            name="radioGroup"
            value="SELL"
            checked={alertType === "SELL"}
            onChange={() => setAlertType("SELL")}
          />
          {!!formErrors.alertType && (
            <Label pointing>{formErrors.alertType}</Label>
          )}
        </Form.Field>
        <Button>Add to alerts</Button>
      </Form>
    </React.Fragment>
  );
};

export default AddAlert;
