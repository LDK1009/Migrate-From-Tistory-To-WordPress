import { signOut } from "@/service/auth";
import { useAuthStore } from "@/store";
import { mixinMuiButtonNoShadow } from "@/styles/mixins";
import { styled, Button, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { LogoutOutlined } from "@mui/icons-material";

//////////////////////////////////////// Component ////////////////////////////////////////

// 버튼 그룹 컴포넌트
// 로그아웃 및 회원탈퇴 기능 제공
const ButtonGroup = () => {
  //////////////////////////////////////// State ////////////////////////////////////////

  //////////////////////////////////////// Store ////////////////////////////////////////

  // 전역 상태 관리
  const { initUser } = useAuthStore();

  //////////////////////////////////////// Hooks ////////////////////////////////////////

  // 라우터 훅
  const router = useRouter();

  //////////////////////////////////////// Handlers ////////////////////////////////////////

  /**
   * 로그아웃 처리 함수
   */
  async function handleSignOut() {
    const { error } = await signOut();
    if (!error) {
      enqueueSnackbar("로그아웃 되었습니다", { variant: "success" });
      initUser();
      router.push("/");
    } else {
      enqueueSnackbar("로그아웃 중 오류가 발생했습니다", { variant: "error" });
    }
  }

  //////////////////////////////////////// Render ////////////////////////////////////////

  return (
    <Container>
      {/* 로그아웃 버튼 */}
      <LogoutButton variant="contained" startIcon={<LogoutOutlined />} onClick={handleSignOut}>
        로그아웃
      </LogoutButton>
    </Container>
  );
};

export default ButtonGroup;

//////////////////////////////////////// Styles ////////////////////////////////////////

// 버튼 그룹 컨테이너 스타일
const Container = styled(Stack)`
  width: 100%;
  row-gap: 4px;
`;

// 로그아웃 버튼 스타일
const LogoutButton = styled(Button)`
  width: 100%;
  color: ${({ theme }) => theme.palette.text.white};
  ${mixinMuiButtonNoShadow}
`;
