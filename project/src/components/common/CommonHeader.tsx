"use client";

import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  styled,
  Grid2,
} from "@mui/material";
import { mixinFlex } from "@/styles/mixins";
import { useAuthStore } from "@/store";
import { GavelRounded, PersonOutline, Menu as MenuIcon, ListAlt, AddCircleOutline } from "@mui/icons-material";
import { templateInfo } from "@/utils/templateInfo";
import { useLoadingRouter } from "@/hooks/useLoadingRouter";

/**
 * 헤더 컴포넌트 - 웹사이트의 상단 네비게이션 바를 표시합니다.
 * 로고, 메뉴 버튼, 네비게이션 링크를 포함합니다.
 * 모바일과 데스크톱 화면에 따라 반응형으로 표시됩니다.
 */
const CommonHeader = () => {
  /////////////////////////////// Store ///////////////////////////////
  // 사용자 인증 정보 가져오기
  const { user } = useAuthStore();

  /////////////////////////////// Hooks ///////////////////////////////

  ////////// State
  // 모바일 메뉴 상태 관리
  const [mobileOpen, setMobileOpen] = React.useState(false);

  /////////////////////////////// Functions ///////////////////////////////
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  /////////////////////////////// Variables ///////////////////////////////
  const drawerWidth = 250;
  const navItems = [
    { title: "메뉴1", path: "/", icon: <ListAlt /> },
    { title: "메뉴2", path: "/", icon: <AddCircleOutline /> },
    user.isSignIn
      ? { title: "마이페이지", path: "/my-page", icon: <PersonOutline /> }
      : { title: "로그인", path: "/auth/sign-in", icon: <PersonOutline /> },
  ];

  // 로딩 라우터 훅
  const { navigateWithLoading } = useLoadingRouter();

  // 툴바 섹션
  const ToolbarSection = () => {
    return (
      <StyledToolbar>
        {/* 로고 섹션 */}
        <LogoContainer onClick={() => navigateWithLoading("/")}>
          <IconButton color="inherit">
            <GavelRounded />
          </IconButton>
          <Typography variant="h6" sx={{ textDecoration: "none", color: "inherit" }}>
            {templateInfo.name}
          </Typography>
        </LogoContainer>

        {/* /* 모바일 메뉴바 아이콘 */}
        <IconButton color="inherit" onClick={handleDrawerToggle} sx={{ display: { xs: "block", sm: "none" } }}>
          <MenuIcon />
        </IconButton>

        {/* /* 데스크톱 메뉴 섹션 */}
        <Grid2
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          gap={1}
          sx={{ display: { xs: "none", sm: "flex" }, width: "100%" }}
        >
          {navItems.map((item) => (
            <Button
              key={item.title}
              onClick={() => navigateWithLoading(item.path)}
              color="inherit"
              sx={{ textAlign: "center" }}
            >
              {item.title}
            </Button>
          ))}
        </Grid2>
      </StyledToolbar>
    );
  };

  // 드로어 섹션
  const DrawerSection = () => {
    return (
      <Box onClick={handleDrawerToggle}>
        {/* 헤더 */}
        <Grid2 container justifyContent="center" alignItems="center">
          <IconButton onClick={() => navigateWithLoading("/")} color="primary">
            <GavelRounded />
          </IconButton>
          <Typography variant="h6" sx={{ my: 2 }} color="primary">
            {templateInfo.name}
          </Typography>
        </Grid2>
        {/* 구분선 */}
        <Divider />
        {/* 메뉴 목록 */}
        <List>
          {navItems.map((item) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                onClick={() => navigateWithLoading(item.path)}
                sx={{ columnGap: 2, "& svg": { color: (theme) => theme.palette.primary.main } }}
              >
                {item.icon}
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  /////////////////////////////// Render ///////////////////////////////
  return (
    <div>
      {/* 앱 바 */}
      <StyledAppBar position="fixed" elevation={0}>
        {/* 툴 바 */}
        <ToolbarSection />
        {/* 드로어 */}
        <Drawer
          anchor="right"
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // 모바일 성능 향상
          }}
          sx={{
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
            display: { xs: "block", sm: "none" },
          }}
        >
          <DrawerSection />
        </Drawer>
      </StyledAppBar>
    </div>
  );
};

export default CommonHeader;

/////////////////////////////// 스타일 컴포넌트 ///////////////////////////////
const StyledAppBar = styled(AppBar)`
  background-color: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.primary.main};
  border-bottom: 1px solid ${({ theme }) => theme.palette.gray[200]};
`;

// 커스텀 Toolbar 스타일
const StyledToolbar = styled(Toolbar)`
  ${mixinFlex("row")}; // 가로 방향 플렉스 레이아웃
  justify-content: space-between;
  padding: 0 16px;
`;

// 로고 컨테이너 스타일
const LogoContainer = styled(Box)`
  ${mixinFlex("row")}; // 가로 방향 플렉스 레이아웃
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
`;
