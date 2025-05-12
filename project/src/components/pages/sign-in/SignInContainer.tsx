"use client";

import Image from "next/image";
import { styled, Typography, Button } from "@mui/material";
import { CottageOutlined } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";

import { signIn } from "@/service/auth";
import { mixinFlex, mixinBorderRadius, mixinContainer, mixinMuiButtonNoShadow } from "@/styles/mixins";

/**
 * 로그인 페이지 컨테이너 컴포넌트
 * 카카오 로그인 및 홈페이지 이동 기능 제공
 */
const SignInContainer = () => {
  // 카카오 로그인 처리 함수
  const handleSignIn = async () => {
    const { error } = await signIn();

    if (error) {
      enqueueSnackbar("로그인 오류가 발생했습니다", { variant: "error" });
    }
  };

  return (
    <Container>
      <TextWrap>
        <HeadingText variant="h5" fontWeight="bold">
          환영합니다!
        </HeadingText>
        <BodyText variant="body2" align="center">
          카카오 계정으로 간편하게 로그인하고
          <br />
          다양한 서비스를 이용해보세요
        </BodyText>
      </TextWrap>

      <LogoImage src="/img/logo-512.png" alt="로고 이미지" width={200} height={200} priority />

      <ButtonWrap>
        <HomeButton href="/" variant="contained" startIcon={<CottageOutlined />}>
          홈페이지 바로가기
        </HomeButton>

        <KakaoButton
          onClick={handleSignIn}
          variant="contained"
          startIcon={<Image src="/svg/kakao-icon.svg" alt="카카오 아이콘" width={20} height={20} />}
          sx={{
            backgroundColor: "#fee500",
            "&:hover": { backgroundColor: "#efd300" },
          }}
        >
          카카오로 로그인
        </KakaoButton>
      </ButtonWrap>
    </Container>
  );
};

export default SignInContainer;

// 스타일 컴포넌트
const Container = styled("div")`
  ${mixinContainer()};
  ${mixinFlex("column")};
  justify-content: space-evenly;
  height: 100vh;
  padding: 24px;
  max-width: 480px;
`;

const TextWrap = styled("div")`
  ${mixinFlex("column")};
  gap: 16px;
  margin-bottom: 8px;
`;

const HeadingText = styled(Typography)``;

const BodyText = styled(Typography)``;

const LogoImage = styled(Image)`
  ${mixinBorderRadius("medium")};
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
`;

const ButtonWrap = styled("div")`
  ${mixinFlex("column")};
  gap: 16px;
  width: 100%;
  margin-top: 16px;
`;

const HomeButton = styled(Button)`
  ${mixinMuiButtonNoShadow}

  width: 100%;
  height: 48px;
  font-weight: 500;
  text-transform: none;
  color: ${({ theme }) => theme.palette.text.white};
`;

const KakaoButton = styled(Button)`
  ${mixinMuiButtonNoShadow}

  width: 100%;
  height: 48px;
  background-color: #fee500;
  font-weight: 500;
  text-transform: none;

  &.MuiButton-contained {
    background-color: #fee500;
    &:hover {
      background-color: #efd300;
    }
  }
`;
