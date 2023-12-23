import React from "react";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import { getMediaUrl } from "../../utils";
import { Avatar } from "./StyledElements";
import { StatusP } from "./StyledElements";

const Container = styled.div`
  display: flex;
  gap: var(--spacing-12, 12px);
  padding: var(--spacing-16, 16px) var(--spacing-12, 12px);
  border-top: 1px solid var(--stroke-default, #edeef5);
  border-right: 1px solid var(--stroke-default, #edeef5);
  border-bottom: 1px solid var(--stroke-default, #edeef5);
  background: var(--bg-secondary, #f5f7fb);
  align-items: center;
`;

const UserNameStatus = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4, 4px);
`;

export default function UserContact() {
  const { userInfo } = useAuth();
  if (userInfo)
    return (
      <Container>
        <Avatar alt="User avatar" src={getMediaUrl(userInfo.avatar_url)} />
        <UserNameStatus>
          <p>{userInfo.user_contact_name}</p>
          <StatusP>{userInfo.user_status || "status uknown"}</StatusP>
        </UserNameStatus>
      </Container>
    );
}
