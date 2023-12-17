import SearchBar from "./SearchBar";
import ContactItem from "./ContactItem";
import { ContactsBox, ContactsItemWraper } from "./StyledComponents";
import { useWebsoket } from "../../contexts/WebsockerContext";
import { useCallback, useEffect, useState } from "react";
import { useChat } from "../../contexts/ChatContext";
import { useAuth } from "../../contexts/AuthContext";

export default function Contacts() {
  const { websocket } = useWebsoket();
  const [contacts, setContacts] = useState([]);
  const { chat: selectedChat, setChat: setSelectedChat } = useChat();
  const { user: currentUserId } = useAuth();

  const changeContactOnlineStatus = useCallback(
    function changeContactOnlineStatus(payload) {
      const { id: userId, is_online: isOnline, last_seen: lastSeen } = payload;
      setContacts((contacts) =>
        contacts.map((item) => {
          if (userId === currentUserId) return item;
          if (
            item.chat_participants.includes(userId) &&
            item.chat_type == "PE"
          ) {
            return { ...item, is_online: isOnline, last_seen: lastSeen };
          }
          return item;
        })
      );
    },
    [currentUserId]
  );

  function changeContactUnreadMessagesCount(payload) {
    const { chat_id: chatId, unread_count: unreadCount } = payload;
    setContacts((contacts) =>
      contacts.map((item) =>
        item.id === chatId ? { ...item, unread_count: unreadCount } : item
      )
    );
  }

  useEffect(() => {
    if (selectedChat) {
      setSelectedChat(contacts.find((chat) => chat.id === selectedChat.id));
    }
  }, [selectedChat, contacts, setSelectedChat]);

  useEffect(() => {
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
      "message.receipt": (payload) => {
        changeContactUnreadMessagesCount(payload);
      },
      "refetch.chat": (payload) => {
        setContacts((contacts) =>
          contacts.map((item) => (item.id === payload.id ? payload : item))
        );
      },
    });
  }, [websocket, currentUserId, changeContactOnlineStatus]);

  return (
    <ContactsBox>
      <SearchBar />
      <ContactsItemWraper>
        {contacts.map((item) => (
          <ContactItem
            key={item.id}
            contact={item}
            active={selectedChat?.id === item.id}
            onChatSelect={() => setSelectedChat(item)}
          />
        ))}
      </ContactsItemWraper>
    </ContactsBox>
  );
}
