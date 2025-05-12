import { mixinFlex } from "@/styles/mixins";
import { styled, Typography, Box, Stack, Button } from "@mui/material";
import React from "react";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { InfoOutlined, NotificationsOutlined, SecurityOutlined } from "@mui/icons-material";

const MenuList = () => {
  //////////////////////////////////////// Variables ////////////////////////////////////////
  // 메뉴 리스트 데이터
  const MenuListProps = [
    {
      title: "메뉴",
      menus: [
        {
          name: "개인정보 관리",
          icon: <InfoOutlined />,
          onClick: () => {
            alert("개인정보 관리");
          },
        },
        {
          name: "알림",
          icon: <NotificationsOutlined />,
          onClick: () => {
            alert("알림 설정");
          },
        },
        {
          name: "보안",
          icon: <SecurityOutlined />,
          onClick: () => {
            alert("보안 설정");
          },
        },
      ],
    },
  ];

  //////////////////////////////////////// Render ////////////////////////////////////////
  return (
    <Container>
      {MenuListProps.map((el, idx) => (
        <CategoryContainer key={idx}>
          {/* 카테고리 헤더 */}
          {/* 섹션 제목 */}
          <Title variant="h6">{el.title}</Title>

          {/* 메뉴 목록 */}
          <MenuItemContainer>
            {el.menus.map((menu, menuIdx) => (
              <React.Fragment key={menuIdx}>
                {/* 메뉴 항목 */}
                <MenuItem onClick={menu.onClick}>
                  <IconTitleWrap>
                    <IconWrapper>{menu.icon}</IconWrapper>
                    <MenuTitle variant="body2">{menu.name}</MenuTitle>
                  </IconTitleWrap>
                  <ArrowIcon />
                </MenuItem>
              </React.Fragment>
            ))}
          </MenuItemContainer>
        </CategoryContainer>
      ))}
    </Container>
  );
};

export default MenuList;

//////////////////////////////////////// Styles ////////////////////////////////////////

// 메뉴 리스트 컨테이너 스타일
const Container = styled("div")`
  width: 100%;
  ${mixinFlex("column")};
  gap: 24px;
`;

// 카테고리 컨테이너
const CategoryContainer = styled(Stack)`
  width: 100%;
  row-gap: 4px;
`;

const Title = styled(Typography)`
  font-weight: bold;
  color: ${({ theme }) => theme.palette.primary.main};
`;

// 메뉴 항목 컨테이너 스타일
const MenuItemContainer = styled(Stack)`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.palette.primary.main};
`;

// 메뉴 항목 스타일
const MenuItem = styled(Button)`
  ${mixinFlex("row", "space-between", "center")};
  width: 100%;
  padding: 16px;
`;

// 아이콘과 제목을 감싸는 컨테이너 스타일
const IconTitleWrap = styled(Stack)`
  ${mixinFlex("row", "flex-start", "center")};
  column-gap: 8px;
`;

// 아이콘 래퍼 스타일
const IconWrapper = styled(Box)`
  ${mixinFlex()};
  color: ${({ theme }) => theme.palette.primary.main};
`;

// 화살표 아이콘 스타일
const ArrowIcon = styled(ArrowForwardIosOutlinedIcon)`
  color: ${({ theme }) => theme.palette.primary.main};
  width: 16px;
  height: 16px;
`;

// 메뉴 제목 스타일
const MenuTitle = styled(Typography)`
  color: ${({ theme }) => theme.palette.text.primary};
`;
