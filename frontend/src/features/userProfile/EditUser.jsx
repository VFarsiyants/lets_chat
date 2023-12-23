import React from "react";
import styled from "styled-components";

import { Avatar, StatusP } from "./StyledElements";
import { useAuth } from "../../contexts/AuthContext";
import { getMediaUrl } from "../../utils";

const Container = styled.div`
  width: 100%;
  padding: 56px 80px;
`;

const UserInfoContainer = styled.div`
  display: flex;
  padding: var(--Spacing-16, 16px);
  align-items: center;
  gap: var(--Spacing-12, 12px);
  border-radius: var(--Radius-Corner-radius-8, 8px);
  background: #fff;
`;

const UserStatus = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--Spacing-8, 8px);
  align-items: flex-start;
  flex: 1 0 0;
`;

const Hr = styled.div`
  height: 1px;
  width: 100%;
  background: var(--Stroke-default, #edeef5);
`;

export default function EditUser() {
  const { userInfo } = useAuth();

  return (
    <Container>
      <UserInfoContainer>
        <Avatar src={getMediaUrl(userInfo?.avatar_url)} />
        <UserStatus>
          <p>{userInfo?.user_contact_name}</p>
          <Hr />
          <StatusP>Uknown status</StatusP>
        </UserStatus>
      </UserInfoContainer>
    </Container>
  );
}
