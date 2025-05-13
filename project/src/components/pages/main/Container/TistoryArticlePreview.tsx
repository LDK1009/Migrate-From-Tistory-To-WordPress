import { TistoryArticleType } from "@/types/tistory";
import { Stack, styled, Typography } from "@mui/material";

const TistoryArticlePreview = ({ tistoryArticles }: { tistoryArticles: TistoryArticleType[] }) => {
  const renderImages = (images: File[]) => {
    return (
      <>
        {images.map((image, idx) => {
          return (
            <li key={idx}>
              <Typography>
                이미지 파일{idx + 1} : {image.name}
              </Typography>
            </li>
          );
        })}
      </>
    );
  };

  const renderArticle = tistoryArticles.map((article, idx) => {
    return (
      <div key={idx}>
        <Typography>게시글 번호 : {article.articleNumber}</Typography>
        <Typography>HTML 파일 : {article.htmlFile?.name}</Typography>

        <ul>{renderImages(article.images || [])}</ul>
      </div>
    );
  });

  return <Container>{renderArticle}</Container>;
};

export default TistoryArticlePreview;

const Container = styled(Stack)`
  row-gap: 16px;
  height: 500px;
  overflow-y: auto;
`;

