import { useAuthStore } from "@/store";
import { mixinFlex } from "@/styles/mixins";
import { styled, Typography, Stack } from "@mui/material";
import Image from "next/image";
import { enqueueSnackbar } from "notistack";

const Header = () => {
  //////////////////////////////////////// Render ////////////////////////////////////////
  const { user } = useAuthStore();

  function handleProfileImgClick() {
    enqueueSnackbar("개발 중인 기능입니다.", { variant: "info" });
  }
  return (
    <Container>
      <Title variant="h6">프로필</Title>

      {/* 프로필 카드 */}
      <ProfileCard>
        {/* 프로필 이미지 */}
        <ProfileImg
          src="/img/logo-192.png"
          alt={`${user.email}의 프로필 이미지`}
          width={80}
          height={80}
          onClick={handleProfileImgClick}
        />

        {/* 프로필 정보 */}
        <ProfileInfo>
          <NicknameText variant="body1">{user.email}</NicknameText>
          <StatusText variant="body2">일반 회원</StatusText>
        </ProfileInfo>
      </ProfileCard>
    </Container>
  );
};

export default Header;

//////////////////////////////////////// Styles ////////////////////////////////////////

// 헤더 컨테이너 스타일
const Container = styled(Stack)`
  width: 100%;
  row-gap: 4px;
`;

const Title = styled(Typography)`
  font-weight: bold;
  color: ${({ theme }) => theme.palette.primary.main};
`;

// 프로필 카드 스타일
const ProfileCard = styled(Stack)`
  ${mixinFlex("row", "flex-start", "center")};
  width: 100%;
  padding: 16px;
  column-gap: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.palette.primary.main};
  background-color: ${({ theme }) => theme.palette.background.paper};
`;

// 프로필 이미지 스타일
const ProfileImg = styled(Image)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

// 프로필 정보 컨테이너 스타일
const ProfileInfo = styled("div")`
  ${mixinFlex("column")};
  align-items: flex-start;
  gap: 4px;
`;

// 닉네임 텍스트 스타일
const NicknameText = styled(Typography)`
  color: ${({ theme }) => theme.palette.text.primary};
`;

// 상태 텍스트 스타일
const StatusText = styled(Typography)`
  color: ${({ theme }) => theme.palette.text.secondary};
`;
