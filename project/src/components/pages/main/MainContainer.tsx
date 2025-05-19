"use client";

import { mixinContainer, mixinFlex } from "@/styles/mixins";
import { styled, Box } from "@mui/material";
import InputSection from "./Container/InputSection";
import FolderSelector from "./Container/FolderSelector";
import MigrationButton from "./Container/MigrationButton";
import MigrateStateSection from "./Container/MigrateStateSection";
import { useMigrateStore } from "@/store/page/main/migrate";
import TistoryArticlePreview from "./Container/TistoryArticlePreview";
import { useTistoryStore } from "@/store/page/main/tistoryStore";
//////////////////////////////////////// Component ////////////////////////////////////////

/**
 * 메인 페이지 컨테이너 컴포넌트
 * 프로젝트 소개 및 README 내용을 표시
 */
const MainContainer = () => {
  const { migrateState } = useMigrateStore();
  const { tistoryArticles } = useTistoryStore();

  //////////////////////////////////////// Render ////////////////////////////////////////

  return (
    <Container>
      {migrateState !== "idle" ? (
        <MigrateStateSection />
      ) : (
        <>
          <InputSection />
          <FolderSelector />
          {tistoryArticles.length > 0 && <TistoryArticlePreview />}
          <MigrationButton />
        </>
      )}
    </Container>
  );
};

export default MainContainer;

//////////////////////////////////////// Styles ////////////////////////////////////////

// 메인 컨테이너 스타일
const Container = styled(Box)`
  ${mixinContainer()};
  ${mixinFlex("column", "center", "center")};
  padding-top: 40px;
  padding-bottom: 40px;
  row-gap: 32px;
`;
