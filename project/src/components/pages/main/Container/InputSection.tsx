import { useTistoryStore } from "@/store/page/main/tistoryStore";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import TistoryArticlePreview from "./TistoryArticlePreview";
import { createArticleList } from "@/service/bucket/articles";
import { useWordpressStore } from "@/store/page/main/wordpressStore";
import api from "@/lib/apiClient";

const InputSection = () => {
  //////////////////////////////////////// 상태 ////////////////////////////////////////

  // 티스토리 스토어
  const { tistoryArticles, setTistoryArticles } = useTistoryStore();

  // 워드프레스 스토어
  const { wpUrl, wpId, wpApplicationPw, setWpUrl, setWpId, setWpApplicationPw } = useWordpressStore();

  // URL 유효성 상태
  const [urlError, setUrlError] = useState<boolean>(false);
  const [urlHelperText, setUrlHelperText] = useState<string>("");

  // 마이그레이션 상태
  const [isMigrating, setIsMigrating] = useState<boolean>(false);

  //////////////////////////////////////// 훅 ////////////////////////////////////////
  // 폴더 선택기 참조
  const fileInputRef = useRef<HTMLInputElement>(null);

  // URL 유효성 검사 실행
  useEffect(() => {
    isValidWpUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wpUrl]);

  //////////////////////////////////////// 함수 ////////////////////////////////////////
  // URL 유효성 검사 함수
  const isValidWpUrl = (): boolean => {
    // http:// 또는 https://로 시작하고, 마지막에 슬래시(/)가 없는 URL만 허용
    const urlPattern = /^(https?:\/\/)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;

    const isValid = urlPattern.test(wpUrl);

    if (wpUrl) {
      if (wpUrl.endsWith("/")) {
        setWpUrl(wpUrl.slice(0, -1));
      }

      setUrlError(!isValid);
      setUrlHelperText(isValid ? "" : "올바른 URL 형식이 아닙니다");
    } else {
      setUrlError(false);
      setUrlHelperText("");
    }

    return isValid;
  };

  // 폴더 선택 이벤트 핸들러
  const selectFolder = (files: FileList | null) => {
    if (!files) {
      enqueueSnackbar("폴더를 선택해주세요.", {
        variant: "error",
      });
      return;
    }

    setTistoryArticles(files);
  };

  ////////// 마이그레이션 버튼 클릭
  async function handleMoveArticles() {
    // 마이그레이션 상태 설정
    setIsMigrating(true);

    // 마이그레이션 조건 확인
    if (!migrateCheck()) {
      return;
    }

    // API 요청
    const response = await api.post("/migrate", { wpId, wpApplicationPw, wpUrl });
    console.log(response.data);
    return;

    // 파일 업로드
    const { error: createArticleError } = await createArticleList(wpId, tistoryArticles);

    // 티스토리 데이터 가져오기 실패
    // 티스토리 데이터 가져오기 실패
    if (createArticleError) {
      enqueueSnackbar("마이그레이션 실패", { variant: "error" });
      return;
    }

    // 마이그레이션 상태 초기화
    setIsMigrating(false);
  }

  ////////// 마이그레이션 조건 확인
  function migrateCheck() {
    if (!wpUrl || !wpId || !wpApplicationPw) {
      enqueueSnackbar("모든 정보를 입력해주세요.", { variant: "error" });
      return false;
    }

    if (urlError) {
      enqueueSnackbar("올바른 워드프레스 URL을 입력해주세요.", { variant: "error" });
      return false;
    }

    if (!tistoryArticles || tistoryArticles.length === 0) {
      enqueueSnackbar("티스토리 백업 폴더에 데이터가 없습니다.", { variant: "error" });
      return false;
    }

    return true;
  }

  //////////////////////////////////////// 렌더링 ////////////////////////////////////////
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <h1>{isMigrating && "마이그레이션 중..."}</h1>
      {/* 폴더 선택 */}
      <div>
        <Typography>{tistoryArticles ? `(${tistoryArticles.length}개 파일)` : "선택된 폴더 없음"}</Typography>
        <Button variant="outlined" onClick={() => fileInputRef.current?.click()} sx={{ mr: 2 }}>
          폴더 선택
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => selectFolder(e.target.files as FileList)}
          style={{ display: "none" }}
          {...{ webkitdirectory: "", directory: "" }}
        />
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
        error={urlError}
        helperText={urlHelperText}
      />

      {/* 마이그레이션 버튼 */}
      <Button variant="contained" onClick={handleMoveArticles} disabled={!tistoryArticles} fullWidth>
        마이그레이션
      </Button>

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
