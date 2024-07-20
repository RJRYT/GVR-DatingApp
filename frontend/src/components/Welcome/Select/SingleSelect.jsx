import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

const customStyles = {
  control: (base, state) => ({
    ...base,
    border: "0px solid transparent",
    borderRadius: "0px",
    backgroundColor: "transparent",
    borderBottom: "1px solid #c7b7cf",
    boxShadow: state.isFocused ? null : null,
    "&:hover": {
      borderBottom: "2px solid #e81d62",
      backgroundColor: "transparent",
      cursor: "pointer",
    },
  }),
  placeholder: (styles) => {
    return {
      ...styles,
      textAlign: "start",
      color: "white",
      paddingLeft: "20px",
    };
  },
  input: (styles) => {
    return {
      ...styles,
      textAlign: "start",
      color: "white",
      paddingLeft: "10px",
    };
  },
  valueContainer: (styles) => {
    return {
      ...styles,
      paddingLeft: "20px",
    };
  },
  menu: (styles) => {
    return {
      ...styles,
      zIndex: "10",
    };
  },
  menuList: (styles) => {
    return {
      ...styles,
      color: "black",
      fontWeight: "bold",
    };
  },
  singleValue: (styles) => {
    return {
      ...styles,
      textAlign: "start",
      color: "white",
      paddingLeft: "10px",
    };
  },
};

const createOption = (label) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ""),
});

const CustomSelect = ({
  Options,
  Placeholder,
  OnChange,
  Disabled,
  name,
  AllowNew,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(Options);
  const [value, setValue] = useState(null);

  const handleCreate = (inputValue) => {
    setIsLoading(true);
    const newOption = createOption(inputValue);
    setOptions((prev) => [...prev, newOption]);
    handleInputChange(newOption);
  };

  const handleInputChange = (e) => {
    setIsLoading(true);
    setValue(e);
    const Obj = {
      target: {
        name,
        value: e?.value || null,
      },
    };
    OnChange(Obj);
    setIsLoading(false);
  };

  return AllowNew ? (
    <CreatableSelect
      isClearable
      classNamePrefix={"dropdown"}
      isDisabled={Disabled}
      isLoading={isLoading}
      styles={customStyles}
      options={options}
      onCreateOption={handleCreate}
      placeholder={Placeholder}
      onChange={handleInputChange}
      value={value}
    />
  ) : (
    <Select
      isClearable
      classNamePrefix={"dropdown"}
      isDisabled={Disabled}
      isLoading={isLoading}
      styles={customStyles}
      options={options}
      onCreateOption={handleCreate}
      placeholder={Placeholder}
      onChange={handleInputChange}
      value={value}
    />
  );
};

export default CustomSelect;
