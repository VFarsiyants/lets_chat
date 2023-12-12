import SearchBar from "./SearchBar";
import ContactItem from "./ContactItem";
import { ContactsBox, ContactsItemWraper } from "./StyledComponents";
import { useWebsoket } from "../../contexts/WebsockerContext";
import { useEffect, useState } from "react";

export default function Contacts() {
  const { websocket } = useWebsoket();
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    websocket.waitForSocketConnection(() => {
      websocket.sendMessage({
        type: "get.chats",
      });
      websocket.addCallbacks({
        "get.chats": (payload) => {
          setContacts(payload);
        },
      });
    });
  }, [websocket]);

  return (
    <ContactsBox>
      <SearchBar />
      <ContactsItemWraper>
        {contacts.map((item) => (
          <ContactItem key={item.id} contact={item} />
        ))}
      </ContactsItemWraper>
    </ContactsBox>
  );
}
