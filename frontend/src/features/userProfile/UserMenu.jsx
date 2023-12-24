import styled from "styled-components";
import MenuItem from "./MenuItem";

import Exit from "/exit.svg";
import { useAuth } from "../../contexts/AuthContext";
import { useWebsoket } from "../../contexts/WebsockerContext";
import { FullHeightContainer } from "../../ui/FullHeightContainer";

const Container = styled(FullHeightContainer)`
  padding: var(--Spacing-8, 8px) var(--Spacing-0, 0px);
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
