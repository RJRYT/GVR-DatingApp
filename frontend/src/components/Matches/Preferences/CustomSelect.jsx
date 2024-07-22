import React, { useState, useEffect } from "react";
import Select from "react-select";

const customStyles = {
  control: (base, state) => ({
    ...base,
    border: "1px solid #c7b7cf",
    boxShadow: state.isFocused ? null : null,
    "&:hover": {
      cursor: "pointer",
    },
  }),
  placeholder: (styles) => {
    return {
      ...styles,
      textAlign: "start",
      color: "#e81d62",
    };
  },
  input: (styles) => {
    return {
      ...styles,
      textAlign: "start",
      color: "#e81d62",
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
      color: "#e81d62",
    };
  },
  multiValue: (styles) => {
    return {
      ...styles,
      backgroundColor: "#f9d9df",
    };
  },
  multiValueLabel: (styles) => ({
    ...styles,
    color: "#454545",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: "#454545",
    ":hover": {
      backgroundColor: "#fdb7ef",
    },
  }),
};

const CustomSelect = ({
  Options,
  Placeholder,
  OnChange,
  Name,
  Value,
  AllowMultiple,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(null);

  useEffect(()=>{
    if (AllowMultiple) {
      const _output = Options.filter((opt) => Value.includes(opt.value));
      if (_output) setValue(_output);
    } else {
      const _output = Options.find(opt=>opt.value === Value);
      if(_output) setValue(_output);
    }
    setIsLoading(false);
  },[Value]);

  const handleInputChange = (e) => {
    setIsLoading(true);
    setValue(e);
    if (AllowMultiple) {
      const Obj = {
        target: {
          name: Name,
          value: e?.map((item) => item.value) || [],
        },
      };
      OnChange(Obj);
    } else {
      const Obj = {
        target: {
          name: Name,
          value: e?.value || null,
        },
      };
      OnChange(Obj);
    }
    setIsLoading(false);
  };

  return (
    <Select
      isClearable
      isMulti={AllowMultiple}
      classNamePrefix={"popup"}
      isLoading={isLoading}
      styles={customStyles}
      options={Options}
      placeholder={Placeholder}
      onChange={handleInputChange}
      value={value}
    />
  );
};

export default CustomSelect;
