import styled from "styled-components";
import MenuItem from "./MenuItem";

import Exit from "/exit.svg";
import { useAuth } from "../../contexts/AuthContext";
import { useWebsoket } from "../../contexts/WebsockerContext";

const Container = styled.div`
  padding: var(--Spacing-8, 8px) var(--Spacing-0, 0px);
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export default function UserMenu() {
  const { logout } = useAuth();
  const { disconnect } = useWebsoket();

  return (
    <Container>
      <MenuItem
        icon={Exit}
        iconColor="#F56565"
        style={{ marginTop: "auto" }}
        onHandle={() => {
          disconnect();
          logout();
        }}
      >
        Exit
      </MenuItem>
    </Container>
  );
}
