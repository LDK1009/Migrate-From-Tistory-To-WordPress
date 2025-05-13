import { NextRequest, NextResponse } from "next/server";
import { readArticlesPathList, readDownloadArticles } from "../(etc)/(service)/bucket/articles";
import { ArticleFileType, ArticlePathType } from "../(etc)/(types)/ArticleType";
import { createWordPressArticle } from "../(etc)/(utils)/migrate";

// import { ArticlePathType } from "../(etc)/(types)/tistory";
// import { ArticleHtmlType, TistoryArticleType } from "@/types/tistory";
// import { createArticle, extractHtmlContent, formatFormData } from "../../../utils/api/tistory/articles/util";

//////////////////////////////////////// 라우트 핸들러 ////////////////////////////////////////
// export async function POST(req: NextRequest) {
//   try {
//     // 폼 데이터 가져오기
//     const formData = await req.formData();
//     // 폼 데이터 포맷팅
//     const formattedFormData = formatFormData(formData);
//     // 블로그 주소
//     const blogUrl = "https://roross.store";

//     // 폼데이터 존재 여부 확인
//     if (formattedFormData && formattedFormData.length > 0) {
//       // HTML 추출, 이미지 태그 src 변경, 이미지 이름 변경, 워드프레스 게시글 작성
//       const results = await Promise.all(
//         formattedFormData.map(async (article: TistoryArticleType, index: number) => {
//           // HTML 추출
//           const articleHtml = await extractHtmlContent(article, blogUrl);

//           // 예시: WordPress에 게시글 작성
//           const postResult = await createArticle({
//             wpUrl: "https://roross.store",
//             wpId: "tome2025",
//             applicationPassword: "G2qT aAyC Bjwz cE8B stuf XQwZ",
//             article: article,
//             articleHtml: articleHtml as ArticleHtmlType,
//             articleImages: article.images as File[],
//           });

//           return { index: index + 1, result: postResult };
//         })
//       );

//       // 성공 응답 반환
//       return NextResponse.json(results, { status: 200 });
//     }
//   } catch (error) {
//     console.error("POST() : 라우트 핸들러 중 오류", error);

//     return NextResponse.json(
//       {
//         data: null,
//         error: error,
//       },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req: NextRequest) {
  try {
    // JSON 데이터 파싱
    const body = await req.json();
    const { wpId, wpApplicationPw, wpUrl } = body;
    const wpInfo = { wpId, wpApplicationPw, wpUrl };

    // 게시물 파일 경로 가져오기
    const articlesPathList: ArticlePathType[] = (await readArticlesPathList(wpId)) as ArticlePathType[];

    // 게시물 파일 가져오기
    const articlesFilesResponse = await readDownloadArticles(wpId, articlesPathList);

    // 배열인지 확인하고 안전하게 첫 번째 요소 접근
    const testArticle =
      Array.isArray(articlesFilesResponse) && articlesFilesResponse.length > 0 ? articlesFilesResponse[0] : null;

    // 게시물 파일 업로드
    const result = await createWordPressArticle({
      wpInfo: wpInfo,
      articlePath: articlesPathList[0],
      articleFile: testArticle as unknown as ArticleFileType,
    });


    return NextResponse.json(true, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

//////////////////////////////////////// 코어 함수 ////////////////////////////////////////
