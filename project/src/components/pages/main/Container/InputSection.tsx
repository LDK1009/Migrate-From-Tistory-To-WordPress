import { TextField, Button, Stack, styled } from "@mui/material";
import React, { useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { useWordpressStore } from "@/store/page/main/wordpressStore";
import { HelpOutline } from "@mui/icons-material";

const InputSection = () => {
  //////////////////////////////////////// 상태 ////////////////////////////////////////
  ////////// 워드프레스 스토어
  const { wpUrl, wpId, wpApplicationPw, setWpUrl, setWpId, setWpApplicationPw, wpUrlError, setWpUrlError } =
    useWordpressStore();

  //////////////////////////////////////// 함수 ////////////////////////////////////////
  ////////// URL 유효성 검사
  const isValidWpUrl = () => {
    // 1. http:// 또는 https://로 시작
    // 2. 마지막에 슬래시(/)가 없는 URL만 허용
    const urlPattern = /^(https?:\/\/)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;

    // URL 형식 검사
    const isValid = urlPattern.test(wpUrl);

    // URL 형식 검사 결과 업데이트
    if (wpUrl) {
      // 마지막에 슬래시(/)로 끝나면 알림
      if (wpUrl.endsWith("/")) {
        enqueueSnackbar("URL 마지막에 슬래시(/)가 있습니다.", { variant: "warning" });
      }

      setWpUrlError(!isValid);
    } else {
      setWpUrlError(false);
    }

    return isValid;
  };

  ////////// '응용 프로그램 비밀번호 발급 방법' 버튼 클릭
  const handleHowToGetAppPw = () => {
    if (wpUrl) {
      window.open(`${wpUrl}/wp-admin/profile.php`, "_blank");
    } else {
      enqueueSnackbar("워드프레스 URL을 입력해주세요.", { variant: "error" });
    }
  };
  //////////////////////////////////////// 이펙트 ////////////////////////////////////////
  ////////// URL 변경 시 유효성 검사
  useEffect(() => {
    isValidWpUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wpUrl]);

  //////////////////////////////////////// 렌더링 ////////////////////////////////////////
  return (
    <Container>
      {/* 헤더 */}
      <Header>
        <HowToGetAppPwButton onClick={handleHowToGetAppPw} variant="text" startIcon={<HelpOutline />}>
          응용 프로그램 비밀번호 발급 방법
        </HowToGetAppPwButton>
      </Header>

      {/* 입력 필드 컨테이너 */}
      <InputContainer>
        {/* 워드프레스 URL 입력 */}
        <WpUrlInput
          label="워드프레스 URL"
          value={wpUrl}
          onChange={(e) => setWpUrl(e.target.value)}
          placeholder="https://your-wordpress-site.com"
          error={wpUrlError}
          helperText={wpUrlError ? "올바른 URL 형식이 아닙니다 (예: https://your-wordpress-site.com)" : ""}
        />

        {/* 워드프레스 아이디 입력 */}
        <WpIdInput
          label="워드프레스 ID"
          value={wpId}
          onChange={(e) => setWpId(e.target.value)}
          placeholder="워드프레스 ID"
        />

        {/* 응용 프로그램 비밀번호 입력 */}
        <WpAppPwInput
          label="응용 프로그램 비밀번호"
          value={wpApplicationPw}
          onChange={(e) => setWpApplicationPw(e.target.value)}
          placeholder="A1B2 C3D4 E5F6 ...."
        />
      </InputContainer>
    </Container>
  );
};

export default InputSection;

const Container = styled(Stack)`
  row-gap: 16px;
`;

const Header = styled(Stack)`
  flex-direction: row;
  justify-content: flex-end;
`;

const HowToGetAppPwButton = styled(Button)`
  &:hover {
    color: ${({ theme }) => theme.palette.primary.dark};
  }
`;

const InputContainer = styled(Stack)`
  flex-direction: row;
  column-gap: 16px;
`;

const WpIdInput = styled(TextField)`
  flex: 1;
`;

const WpAppPwInput = styled(TextField)`
  flex: 1;
`;

const WpUrlInput = styled(TextField)`
  flex: 2;
`;
