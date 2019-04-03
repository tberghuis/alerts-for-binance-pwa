import axios from "axios";
import React, { useState, useEffect } from "react";
import { Dropdown } from "semantic-ui-react";

const PairingInput = ({ setPairingSymbol }) => {
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [filteredDropdownOptions, setFilteredDropdownOptions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/pairings");
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
