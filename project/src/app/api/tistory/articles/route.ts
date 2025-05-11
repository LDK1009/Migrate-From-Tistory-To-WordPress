import { NextRequest, NextResponse } from "next/server";
import { ArticleDataType } from "@/types/tistory";
import {
  changeImageTagSrc,
  createArticle,
  extractHtmlContent,
  formatFormData,
} from "../../../../utils/api/tistory/articles/util";

//////////////////////////////////////// 라우트 핸들러 ////////////////////////////////////////
export async function POST(req: NextRequest) {
  try {
    // 폼 데이터 가져오기
    const formData = await req.formData();
    // 폼 데이터 포맷팅
    const formattedFormData = formatFormData(formData);

    // 폼데이터 존재 여부 확인
    if (formattedFormData.length > 0) {
      // HTML 추출, 이미지 태그 src 변경, 이미지 이름 변경, 워드프레스 게시글 작성
      const results = await Promise.all(
        formattedFormData.map(async (article, index) => {
          // HTML 추출
          const articleData = await extractHtmlContent(article.htmlFile as File);
          // 이미지 태그 src 변경
          await changeImageTagSrc(article.articleNumber, article.htmlFile as File);

          // 예시: WordPress에 게시글 작성
          const postResult = await createArticle({
            wpUrl: "https://roross.store",
            wpId: "tome2025",
            applicationPassword: "G2qT aAyC Bjwz cE8B stuf XQwZ",
            articleData: articleData as ArticleDataType,
            articleImages: article.images as File[],
          });

          console.log(`${index + 1}번째 게시글 작성 결과:`, postResult ? "성공" : "실패");
          return { index: index + 1, result: postResult };
        })
      );

      // 성공 응답 반환
      return NextResponse.json(
        {
          data: results,
          error: null,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("POST() : 라우트 핸들러 중 오류", error);

    return NextResponse.json(
      {
        data: null,
        error: error,
      },
      { status: 500 }
    );
  }
}
