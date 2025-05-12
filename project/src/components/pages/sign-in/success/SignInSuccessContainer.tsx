"use client";

import { mixinBorderRadius, mixinContainer, mixinFlex, mixinMuiButtonNoShadow } from "@/styles/mixins";
import { Button, styled, Typography } from "@mui/material";
import Image from "next/image";
import React, { useEffect } from "react";
import { CottageOutlined } from "@mui/icons-material";
import { getCurrentUser } from "@/service/auth";
import { enqueueSnackbar } from "notistack";
import { useAuthStore } from "@/store";

const SignInSuccessContainer = () => {
  // Store
  const { setUser } = useAuthStore();

  // useEffect
  useEffect(() => {
    async function getUserInfo() {
      const { data, error } = await getCurrentUser();
      if (!error) {
        const userData = {
          email: data.user.email as string,
          uid: data.user.id as string,
          isSignIn: true,
          created_at: data.user.created_at as string,
        };

        setUser(userData);
      } else {
        enqueueSnackbar("유저 정보 가져오기 오류 발생", { variant: "error" });
      }
    }
    getUserInfo();
  }, [setUser]);

  return (
    <Container>
      <TextWrap>
        <HeadingText variant="h5" fontWeight={"bold"}>
          로그인 완료!
        </HeadingText>
        <BodyText variant="body2" align="center">
          로그인이 성공적으로 완료되었습니다.
          <br />
          이제 모든 서비스를 이용하실 수 있습니다.
        </BodyText>
      </TextWrap>

      <Img src={"/img/logo-512.png"} alt="" width={200} height={200} />
      <ButtonWrap>
        <HomeButton href="/" variant="contained" startIcon={<CottageOutlined />}>
          홈으로
        </HomeButton>
      </ButtonWrap>
    </Container>
  );
};

export default SignInSuccessContainer;

const Container = styled("div")`
  ${mixinContainer()};
  ${mixinFlex("column")};
  justify-content: space-evenly;
  width: 100%;
  height: 100vh;
  padding: 24px;
`;

const TextWrap = styled("div")`
  ${mixinFlex("column")};
  row-gap: 8px;
`;

const HeadingText = styled(Typography)``;

const BodyText = styled(Typography)``;

const Img = styled(Image)`
  ${mixinBorderRadius("medium")};
`;

const ButtonWrap = styled("div")`
  ${mixinFlex("column")};
  row-gap: 8px;
  width: 100%;
`;

const HomeButton = styled(Button)`
  ${mixinMuiButtonNoShadow}

  width: 100%;
  height: 48px;
  color: ${({ theme }) => theme.palette.text.white};
`;
