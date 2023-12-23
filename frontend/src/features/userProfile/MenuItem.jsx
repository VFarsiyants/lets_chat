import React from "react";
import styled from "styled-components";

const ItemContainer = styled.div`
  padding: 8px 16px;
`;

const Button = styled.button`
  display: flex;
  padding: 0;
  gap: 12px;
  align-items: center;
  background-color: transparent;
  border: none;
`;

const ImgWrapper = styled.div`
  width: 24px;
  height: 24px;
  padding: 4px;
  border-radius: var(--Radius-Corner-radius-8, 8px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => (props.$iconColor ? props.$iconColor : "#FFFFFF")};
`;

export default function MenuItem({
  children,
  icon,
  iconColor,
  onHandle,
  style = {},
}) {
  return (
    <ItemContainer style={style}>
      <Button onClick={onHandle}>
        <ImgWrapper $iconColor={iconColor}>
          <img src={icon} />
        </ImgWrapper>
        {children}
      </Button>
    </ItemContainer>
  );
}
