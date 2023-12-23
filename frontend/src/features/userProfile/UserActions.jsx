import React from "react";
import styled from "styled-components";

import UserContact from "./UserContact";
import BackButton from "./BackButton";
import UserProfile from "./UserProfile";
import UserMenu from "./UserMenu";

const Container = styled.div`
  max-width: 300px;
  width: 100%;
  flex-shrink: 0;
  border: 1px solid var(--stroke-default, #edeef5);
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

export default function UserActions() {
  return (
    <Container>
      <UserProfile.Close>
        <BackButton />
      </UserProfile.Close>
      <UserContact />
      <UserMenu />
    </Container>
  );
}
