import SearchBar from "./SearchBar";
import ContactItem from "./ContactItem";
import { ContactsBox, ContactsItemWraper } from "./StyledComponents";

export default function Contacts() {
  return (
    <ContactsBox>
      <SearchBar />
      <ContactsItemWraper>
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem active={true} />
      </ContactsItemWraper>
    </ContactsBox>
  );
}
