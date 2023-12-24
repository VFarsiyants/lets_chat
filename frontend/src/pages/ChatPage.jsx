import Contacts from "../features/contacts/Contacts";
import { useWebsoket } from "../contexts/WebsockerContext";
import { useChat } from "../contexts/ChatContext";
import Chat from "../features/chat/Chat";
import UserProfile from "../features/userProfile/UserProfile";
import { HorizontalContainer } from "../ui/HorizontalContainer";

export default function ChatPage() {
  const { chat } = useChat();
  const { websocketReady } = useWebsoket();

  if (websocketReady)
    return (
      <HorizontalContainer>
        <UserProfile>
          <Contacts />
          {chat ? <Chat chat={chat} /> : <p>Select contact to start chating</p>}
          <UserProfile.Page />
        </UserProfile>
      </HorizontalContainer>
    );

  return <p>Loading...</p>;
}
