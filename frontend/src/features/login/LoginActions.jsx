import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLoginActions = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-left: auto;
  :last-child {
    margin-left: auto;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: var(--text-secondary);
`;

export default function LoginActions({ children }) {
  return <StyledLoginActions>{children}</StyledLoginActions>;
}
