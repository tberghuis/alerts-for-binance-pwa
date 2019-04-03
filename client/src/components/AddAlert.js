import React, { useState, useRef } from "react";
import { Button, Label, Header, Form, Radio, Input } from "semantic-ui-react";
import trim from "lodash/trim";
import isEmpty from "lodash/isEmpty";
import PairingInput from "./PairingInput";
import axios from "axios";
import math from "mathjs";

const AddAlert = props => {
  const [formErrors, setFormErrors] = useState({});
  const [alertType, setAlertType] = useState(null);
  const [pairingSymbol, setPairingSymbol] = useState("");

  // const pairingRef = useRef();
  const priceRef = useRef();

  const handleSubmit = async e => {
    e.preventDefault();

    const pairing = pairingSymbol;
    const priceString = trim(priceRef.current.inputRef.current.value);
    const price = Number(math.eval(priceString));

    // validate form
    let formErrors = {};

    // validate pairing
    // check not empty
    if (pairing === "") {
      console.log("pairing empty", pairing);
      formErrors.pairing = "Please enter a Pairing Symbol";
    }

    // validate price
    if (priceString === "") {
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

  const handleClickCurrentPrice = async () => {
    try {
      const res = await axios.get(`/api/price/${pairingSymbol}`);
      console.log("res", res);
      // update price input
      priceRef.current.inputRef.current.value = res.data.price;
      // give focus
      priceRef.current.inputRef.current.focus();
    } catch (error) {
      console.log("error", error);
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
          <PairingInput setPairingSymbol={setPairingSymbol} />
          {!!formErrors.pairing && <Label pointing>{formErrors.pairing}</Label>}
        </Form.Field>
        <Form.Field error={!!formErrors.price}>
          <label>Price</label>
          <div style={{ display: "flex" }}>
            <Input
              ref={priceRef}
              placeholder="Enter Price (can perform math e.g. PRICE * 1.05 for 5% price increase)"
            />
            <Button
              onClick={handleClickCurrentPrice}
              type="button"
              style={{ whiteSpace: "nowrap" }}
            >
              Current Price
            </Button>
          </div>

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
