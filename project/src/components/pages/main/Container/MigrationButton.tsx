import { createWordpressArticleList } from "@/service/api/migrate";
import { createArticleList, readArticlesPathList } from "@/service/bucket/articles";
import { useTistoryStore } from "@/store/page/main/tistoryStore";
import { useWordpressStore } from "@/store/page/main/wordpressStore";
import { LocalShippingRounded } from "@mui/icons-material";
import { Box, Button, styled } from "@mui/material";
import { enqueueSnackbar } from "notistack";

const MigrationButton = () => {
  const { tistoryArticles } = useTistoryStore();
  const { wpUrl, wpId, wpApplicationPw, wpUrlError } = useWordpressStore();

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
      // 마이그레이션 조건 확인
      migrateCheck();

      // 파일 업로드
      const { error: createArticleError } = await createArticleList(wpId, tistoryArticles);

      // 파일 업로드 실패
      if (createArticleError) {
        throw new Error("파일 업로드 실패");
      }

      // 게시물 경로 가져오기
      const { data: articlesPathList, error: readArticlesPathListError } = await readArticlesPathList(wpId);

      if (readArticlesPathListError) {
        throw new Error("게시물 경로 가져오기 실패");
      }

      // 워드프레스 게시물 생성
      const { error: createWordpressArticleListError } = await createWordpressArticleList({
        wpInfo: { wpId, wpApplicationPw, wpUrl },
        articlePathList: articlesPathList as string[],
      });

      if (createWordpressArticleListError) {
        throw new Error("워드프레스 게시물 생성 실패");
      }
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
  border-radius: 16px;
  font-size: 24px;
  font-weight: bold;

  & .MuiSvgIcon-root {
    font-size: 32px;
  }
`;
