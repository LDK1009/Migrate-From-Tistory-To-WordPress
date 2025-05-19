import { createWordpressArticleList } from "@/service/api/migrate";
import { createArticleList, readArticlesPathList } from "@/service/bucket/articles";
import { useMigrateStore } from "@/store/page/main/migrate";
import { useTistoryStore } from "@/store/page/main/tistoryStore";
import { useWordpressStore } from "@/store/page/main/wordpressStore";
import { LocalShippingRounded } from "@mui/icons-material";
import { Box, Button, styled } from "@mui/material";
import { enqueueSnackbar } from "notistack";

const MigrationButton = () => {
  const { tistoryArticles } = useTistoryStore();
  const { wpUrl, wpId, wpApplicationPw, wpUrlError } = useWordpressStore();
  const { setMigrateState } = useMigrateStore();

  ////////// 마이그레이션 조건 확인
  function migrateCheck() {
    if (!wpUrl || !wpId || !wpApplicationPw) {
      throw new Error("모든 정보를 입력해주세요.");
    }

    if (wpUrlError) {
      throw new Error("올바른 워드프레스 URL을 입력해주세요.");
    }

    if (!tistoryArticles || tistoryArticles.length === 0) {
      throw new Error("티스토리 백업 폴더에 데이터가 없습니다.");
    }

    return true;
  }

  ////////// 마이그레이션 버튼 클릭
  async function handleMoveArticles() {
    try {
      setMigrateState("idle");

      // 마이그레이션 조건 확인
      migrateCheck();

      // 마이그레이션 상태 변경
      setMigrateState("fileUpload");

      // 파일 업로드
      const { error: createArticleError } = await createArticleList(wpId, tistoryArticles);

      // 파일 업로드 실패
      if (createArticleError) {
        setMigrateState("error");
        throw new Error("파일 업로드 실패");
      }

      // 마이그레이션 상태 변경
      setMigrateState("articleMigrate");

      // 게시물 경로 가져오기
      const { data: articlesPathList, error: readArticlesPathListError } = await readArticlesPathList(wpId);

      if (readArticlesPathListError) {
        setMigrateState("error");
        throw new Error("게시물 경로 가져오기 실패");
      }

      // 워드프레스 게시물 생성
      const { error: createWordpressArticleListError } = await createWordpressArticleList({
        wpInfo: { wpId, wpApplicationPw, wpUrl },
        articlePathList: articlesPathList as string[],
      });

      if (createWordpressArticleListError) {
        setMigrateState("error");
        throw new Error("워드프레스 게시물 생성 실패");
      }

      // 마이그레이션 상태 변경
      setMigrateState("success");
    } catch (error) {
      enqueueSnackbar((error as Error).message, { variant: "error" });
    }
  }
  return (
    <Container>
      {/* 마이그레이션 버튼 */}
      <MigrateButton
        variant="contained"
        onClick={handleMoveArticles}
        disabled={!tistoryArticles}
        endIcon={<LocalShippingRounded />}
        fullWidth
      >
        마이그레이션
      </MigrateButton>
    </Container>
  );
};

export default MigrationButton;

const Container = styled(Box)`
  width: 100%;
`;

const MigrateButton = styled(Button)`
  width: 100%;
  height: 60px;
  border-radius: 8px;
  font-size: 24px;
  font-weight: bold;

  & .MuiSvgIcon-root {
    font-size: 32px;
  }
`;
