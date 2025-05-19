import { useMigrateStore } from "@/store/page/main/migrate";
import { useWordpressStore } from "@/store/page/main/wordpressStore";
import { ArrowForwardIosRounded, ReplayRounded } from "@mui/icons-material";
import { Button, LinearProgress, Stack, styled, Typography } from "@mui/material";

const MigrateStateSection = () => {
  const { migrateState, setMigrateState } = useMigrateStore();
  const { wpUrl } = useWordpressStore();

  const text = {
    idle: "",
    fileUpload: "파일 업로드 중...",
    articleMigrate: "마이그레이션 중...",
    success: "마이그레이션 성공",
    error: "마이그레이션 실패",
  };

  function handleGoToBlog() {
    window.open(wpUrl, "_blank");
  }

  return (
    <Container>
      {migrateState !== "success" && migrateState !== "error" && (
        <WaitingText variant="caption">잠시 기다려주세요</WaitingText>
      )}
      <Text variant="h4">{text[migrateState]}</Text>
      {(migrateState === "fileUpload" || migrateState === "articleMigrate") && <LinearProgress />}
      {migrateState === "success" && (
        <>
          <GoToBlogButton variant="contained" endIcon={<ArrowForwardIosRounded />} onClick={handleGoToBlog}>
            블로그 보러가기
          </GoToBlogButton>
          <RetryButton variant="outlined" endIcon={<ReplayRounded />} onClick={() => setMigrateState("idle")}>
            다시하기
          </RetryButton>
        </>
      )}
    </Container>
  );
};

export default MigrateStateSection;

const Container = styled(Stack)`
  width: 100%;
  row-gap: 16px;
`;

const Text = styled(Typography)`
  text-align: center;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const WaitingText = styled(Typography)`
  text-align: center;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const GoToBlogButton = styled(Button)`
  width: 100%;
  height: 60px;
  border-radius: 8px;
  font-size: 24px;
  font-weight: bold;

  & .MuiSvgIcon-root {
    font-size: 32px;
  }
`;

const RetryButton = styled(GoToBlogButton)`
  &:hover {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;
