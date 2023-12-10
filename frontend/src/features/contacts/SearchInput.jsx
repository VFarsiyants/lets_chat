import React from "react";
import { IoSearch } from "react-icons/io5";
import { InputWrapper, StyledInput } from "./StyledComponents";

export default function SearchInput() {
  return (
    <InputWrapper>
      <StyledInput type="text" placeholder="Search" />
      <IoSearch size="24px" color="#8287A0" />
    </InputWrapper>
  );
}
