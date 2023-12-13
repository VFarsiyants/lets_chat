import SearchBar from "./SearchBar";
import ContactItem from "./ContactItem";
import { ContactsBox, ContactsItemWraper } from "./StyledComponents";
import { useWebsoket } from "../../contexts/WebsockerContext";
import { useEffect, useState } from "react";

export default function Contacts() {
  const { websocket } = useWebsoket();
  const [contacts, setContacts] = useState([]);

  function changeContactOnlineStatus(payload) {
    const { user_id: userId, is_online: isOnline } = payload;
    setContacts((contacts) =>
      contacts.map((item) =>
        item.user_id === userId ? { ...item, is_online: isOnline } : item
      )
    );
  }

  useEffect(() => {
    websocket.waitForSocketConnection(() => {
      websocket.sendMessage({
        type: "get.chats",
      });
      websocket.addCallbacks({
        "get.chats": (payload) => {
          setContacts(payload);
        },
        "user.online": (payload) => {
          changeContactOnlineStatus(payload);
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
