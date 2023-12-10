import React from "react";
import { ContactsItemBox } from "./StyledComponents";
import { HiOutlineUserCircle } from "react-icons/hi2";
import SearchInput from "./SearchInput";

export default function SearchBar() {
  return (
    <ContactsItemBox>
      <HiOutlineUserCircle size="24px" color="#6A6C87" />
      <SearchInput />
    </ContactsItemBox>
  );
}
