import React from "react";
import { ContactsItemBox } from "./StyledComponents";
import { HiOutlineUserCircle } from "react-icons/hi2";
import SearchInput from "./SearchInput";
import UserProfile from "../userProfile/UserProfile";

export default function SearchBar() {
  return (
    <ContactsItemBox>
      <UserProfile.Open>
        <HiOutlineUserCircle size="24px" color="#6A6C87" />
      </UserProfile.Open>
      <SearchInput />
    </ContactsItemBox>
  );
}
