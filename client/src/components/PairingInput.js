import axios from "axios";
import React, { useState, useEffect } from "react";
import { Dropdown } from "semantic-ui-react";

const PairingInput = ({ setPairingSymbol }) => {
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [filteredDropdownOptions, setFilteredDropdownOptions] = useState([]);
  // const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/pairings");
        // console.log("res", res);
        const options = res.data.sort().map(pair => ({
          key: pair,
          value: pair,
          text: pair
        }));
        setDropdownOptions(options);
        setFilteredDropdownOptions(options);
      } catch (error) {
        console.log("error", error);
      }
    })();
  }, []);

  const onSearchChange = (event, data) => {
    // console.log("event", event);
    // console.log("data", data);
    if (!data.searchQuery || data.searchQuery.trim() === "") {
      setFilteredDropdownOptions(dropdownOptions);
      return;
    }

    setFilteredDropdownOptions(
      dropdownOptions.filter(option =>
        option.key.startsWith(data.searchQuery.trim().toUpperCase())
      )
    );
  };

  const onChange = (event, data) => {
    // console.log("event", event);
    // console.log("data", data);
    // setInputValue(data.value);
    setPairingSymbol(data.value);
  };

  return (
    <Dropdown
      placeholder="Select Pairing"
      clearable
      fluid
      search
      selection
      onBlur={() => setFilteredDropdownOptions(dropdownOptions)}
      onClick={() => setFilteredDropdownOptions(dropdownOptions)}
      onChange={onChange}
      onSearchChange={onSearchChange}
      options={filteredDropdownOptions}
    />
  );
};

export default PairingInput;
