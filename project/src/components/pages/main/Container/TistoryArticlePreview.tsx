import { useTistoryStore } from "@/store/page/main/tistoryStore";
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, Stack, styled, Typography } from "@mui/material";
import { ExpandMoreRounded } from "@mui/icons-material";
import { mixinFlex, mixinHideScrollbar } from "@/styles/mixins";
import { useEffect } from "react";

const TistoryArticlePreview = () => {
  const { tistoryArticles, selectedArticleIndexList, setSelectedArticleIndexList } = useTistoryStore();

  function renderImages(images: File[]) {
    return images.map((image, idx) => {
      return (
        <DetailText key={idx} variant="body2">
          {idx + 1}. {image.name}
        </DetailText>
      );
    });
  }

  // 체크박스 변경 함수
  function handleCheckboxChange(idx: number) {
    // 이미 선택된 경우 제거s
    if (selectedArticleIndexList.includes(idx)) {
      setSelectedArticleIndexList(selectedArticleIndexList.filter((article) => article !== idx));
    } else {
      // 선택되지 않은 경우 추가
      setSelectedArticleIndexList([...selectedArticleIndexList, idx]);
    }
  }

  // 전체 체크박스 변경 함수
  function handleCheckboxAllChange() {
    if (selectedArticleIndexList.length === tistoryArticles.length) {
      setSelectedArticleIndexList([]);
    } else {
      setSelectedArticleIndexList(tistoryArticles.map((_, idx) => idx));
    }
  }

  //  티스토리 데이터가 변경되면 전체 체크박스 선택
  useEffect(() => {
    setSelectedArticleIndexList(tistoryArticles.map((_, idx) => idx));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tistoryArticles]);

  return (
    <Container>
      {/* 전체 체크박스 */}
      <AllSelectWrapper>
        <Checkbox
          checked={selectedArticleIndexList.length === tistoryArticles.length}
          onChange={handleCheckboxAllChange}
        />
        <AllSelectText variant="body1">
          {selectedArticleIndexList.length === tistoryArticles.length ? "전체 취소" : "전체 선택"}
        </AllSelectText>
      </AllSelectWrapper>

      {/* 게시물 목록 */}
      {tistoryArticles.map((article, idx) => {
        return (
          <ArticleItemContainer key={idx}>
            <Checkbox checked={selectedArticleIndexList.includes(idx)} onChange={() => handleCheckboxChange(idx)} />
            <AccordionContainer key={idx}>
              {/* 게시물 제목 */}
              <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                <SummaryText>{article.htmlFile?.name.split(".")[0]}</SummaryText>
              </AccordionSummary>

              {/* 게시물 내용 */}
              <ArticleDetail>
                {article.images && article.images.length > 0 ? (
                  <>{renderImages(article.images as File[])}</>
                ) : (
                  <DetailText variant="body2">게시물 이미지가 없습니다.</DetailText>
                )}
              </ArticleDetail>
            </AccordionContainer>
          </ArticleItemContainer>
        );
      })}
    </Container>
  );
};

export default TistoryArticlePreview;

const Container = styled(Stack)`
  width: 100%;
  height: 500px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.palette.primary.main};
  border-radius: 8px;
  padding: 16px;

  ${mixinHideScrollbar}
`;

const AllSelectWrapper = styled(Stack)`
  ${mixinFlex("row", "flex-start", "center")}
  column-gap: 8px;
`;

const AllSelectText = styled(Typography)`
  color: ${({ theme }) => theme.palette.primary.main};
`;

const ArticleItemContainer = styled(Stack)`
  ${mixinFlex("row", "flex-start", "center")}
`;

const AccordionContainer = styled(Accordion)`
  width: 100%;
  row-gap: 16px;
  box-shadow: none;
  border: none;
  background-color: transparent;

  &:before {
    display: none;
  }
`;

const SummaryText = styled(Typography)`
  font-weight: bold;
`;

const DetailText = styled(Typography)`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const ArticleDetail = styled(AccordionDetails)`
  ${mixinFlex("column", "flex-start", "flex-start")}
  padding: 0px;
  padding-left: 32px;
  row-gap: 4px;
`;
