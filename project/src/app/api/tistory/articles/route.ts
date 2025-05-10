import { NextRequest, NextResponse } from "next/server";
import { TistoryArticle } from "@/types/tistory";

/**
 * 티스토리 게시글 폴더를 처리하는 POST API 핸들러
 * @param request - 클라이언트로부터의 요청 객체
 * @returns JSON 응답 (성공 시 게시글 목록, 실패 시 에러 메시지)
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData();

  // 파일 포맷팅
  function formatFormData(formData: FormData) {
    const articles: TistoryArticle[] = [];

    //
    for (const [key, value] of formData.entries()) {
      // 게시글 번호 추출
      const articleNumber = Number(key.split("_")[1]);

      // 게시글 객체 찾기
      let article = articles.find((el) => el.articleNumber === articleNumber);

      // 게시글 객체가 없다면 생성
      if (!article) {
        article = {
          articleNumber: articleNumber,
          images: [],
          htmlFile: null,
        };
        articles.push(article);
      }

      if (key.startsWith("image_")) {
        const imageFile = value as File;
        // const imageNumber = Number(key.split("_")[2]);

        // 아티클에 이미지 파일 추가
        article.images?.push(imageFile);
      }

      if (key.startsWith("html_")) {
        const htmlFile = value as File;

        // 아티클에 html 파일 추가
        article.htmlFile = htmlFile;
      }
    }
    return articles;
  }

  //   콘솔
  console.log("포맷 전 폼데이터 : ");
  console.log(formData);
  console.log("\n\n\n\n\n\n\n\n\n");
  const formattedFormData = formatFormData(formData);
  console.log("포맷 후 폼데이터 : ");
  console.log(formattedFormData);
  console.log("\n\n\n\n\n\n\n\n\n");

  // 성공 응답 반환
  return NextResponse.json({
    success: true,
  });
}
