import { NextRequest, NextResponse } from "next/server";
import {
  readArticlesPathList,
  readDownloadArticles,
  ArticlePathListType,
} from "../(etc)/(service)/bucket/articles";
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

    console.log("wpId", wpId);
    console.log("wpApplicationPw", wpApplicationPw);
    console.log("wpUrl", wpUrl);

    // 티스토리 데이터 가져오기
    const articlesPathList = await readArticlesPathList(wpId);
    const articlesFiles = await readDownloadArticles(wpId, articlesPathList as ArticlePathListType[]);
    console.log("articlesFiles", articlesFiles);

    return NextResponse.json(true, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

//////////////////////////////////////// 코어 함수 ////////////////////////////////////////






