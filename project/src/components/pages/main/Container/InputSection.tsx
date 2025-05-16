import { useTistoryStore } from "@/store/page/main/tistoryStore";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import React, { useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import TistoryArticlePreview from "./TistoryArticlePreview";
import { useWordpressStore } from "@/store/page/main/wordpressStore";

const InputSection = () => {
  //////////////////////////////////////// 상태 ////////////////////////////////////////

  // 티스토리 스토어
  const { tistoryArticles } = useTistoryStore();

  // 워드프레스 스토어
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

  //////////////////////////////////////// 이펙트 ////////////////////////////////////////

  ////////// URL 유효성 검사 실행
  useEffect(() => {
    isValidWpUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wpUrl]);

  //////////////////////////////////////// 렌더링 ////////////////////////////////////////
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      {/* 폴더 선택 */}
      <div>
        <Typography>{tistoryArticles ? `(${tistoryArticles.length}개 파일)` : "선택된 폴더 없음"}</Typography>
      </div>

      {/* 워드프레스 id 입력 */}
      <TextField
        label="워드프레스 아이디"
        fullWidth
        value={wpId}
        onChange={(e) => setWpId(e.target.value)}
        placeholder="https://your-wordpress-site.com"
        sx={{ mb: 2 }}
      />

      {/* 응용 프로그램 비밀번호 입력 */}
      <TextField
        label="응용 프로그램 비밀번호"
        fullWidth
        value={wpApplicationPw}
        onChange={(e) => setWpApplicationPw(e.target.value)}
        placeholder="https://your-wordpress-site.com"
        sx={{ mb: 2 }}
      />
      <Button
        variant="outlined"
        onClick={() => {
          if (wpUrl) {
            window.open(`${wpUrl}/wp-admin/profile.php`, "_blank");
          } else {
            enqueueSnackbar("워드프레스 URL을 입력해주세요.", { variant: "error" });
          }
        }}
      >
        응용 프로그램 비밀번호 발급 방법
      </Button>

      {/* 워드프레스 URL 입력 */}
      <TextField
        label="WordPress URL"
        fullWidth
        value={wpUrl}
        onChange={(e) => setWpUrl(e.target.value)}
        placeholder="https://your-wordpress-site.com"
        sx={{ mb: 2 }}
        error={wpUrlError}
        helperText={wpUrlError ? "올바른 URL 형식이 아닙니다 (예: https://your-wordpress-site.com)" : ""}
      />

      {/* 티스토리 데이터 미리보기 */}
      {tistoryArticles && tistoryArticles?.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            가져온 게시글: {tistoryArticles.length}개
          </Typography>
          <TistoryArticlePreview tistoryArticles={tistoryArticles} />
        </Box>
      )}
    </Paper>
  );
};

export default InputSection;
