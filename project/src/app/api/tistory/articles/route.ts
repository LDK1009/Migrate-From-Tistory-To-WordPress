import { NextRequest, NextResponse } from "next/server";
import { TistoryArticle } from "@/types/tistory";
import axios from "axios";
import * as cheerio from "cheerio";

//////////////////////////////////////// 라우트 핸들러 ////////////////////////////////////////
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const formattedFormData = formatFormData(formData);

    // HTML 내용 추출 및 게시글 작성
    if (formattedFormData.length > 0) {
      // Promise.all을 사용하여 모든 게시글을 병렬로 처리
      const results = await Promise.all(
        formattedFormData.map(async (article, index) => {
          const articleData = await extractHtmlContent(article.htmlFile as File);

          // 예시: WordPress에 게시글 작성
          const postResult = await createArticle({
            wpUrl: "https://roross.store",
            wpId: "tome2025",
            applicationPassword: "G2qT aAyC Bjwz cE8B stuf XQwZ",
            articleData: articleData as ArticleDataType,
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

//////////////////////////////////////// 타입 ////////////////////////////////////////
type ArticleDataType = {
  title: string;
  content: string;
  status: string;
  categories?: string[];
  tags?: string[];
  date?: string;
};

//////////////////////////////////////// 함수 ////////////////////////////////////////

////////// 파일 포맷팅
function formatFormData(formData: FormData) {
  try {
    const articles: TistoryArticle[] = [];

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
  } catch (error) {
    console.error("formatFormData() : 파일 포맷팅 중 오류");

    throw error;
  }
}

////////// HTML 파일 내용 추출 및 분석 함수
async function extractHtmlContent(htmlFile: File) {
  try {
    // File 객체를 ArrayBuffer로 변환
    const arrayBuffer = await htmlFile.arrayBuffer();

    // ArrayBuffer를 문자열로 디코딩
    const textDecoder = new TextDecoder("utf-8");
    const htmlContent = textDecoder.decode(arrayBuffer);


    // Cheerio로 HTML 파싱
    const $ = cheerio.load(htmlContent);

    // 제목 추출 (첫 번째 h1 또는 title 태그)
    const title = $(".title-article").text().trim() || "";
    const body = $(".article-view").html() || "";
    const date = $(".date").text().trim() || "";

    const articleData = {
      title,
      content: body || "",
      status: "publish",
      date,
    };

    // 이미지 경로 수정 (상대 경로를 절대 경로로 변환하는 등의 작업)
    // $("img").each((i, element) => {
    //   // 이미지 처리 로직
    //   // 예: $(element).attr('src', 새경로);
    // });

    return articleData;
  } catch (error) {
    console.error("extractHtmlContent() : HTML 파일 내용 추출 중 오류");
    console.error(error);

    throw error;
  }
}

// 워드프레스 게시글 작성 함수 인수 타입
type CreateArticleType = {
  wpUrl: string;
  wpId: string;
  applicationPassword: string;
  articleData: ArticleDataType;
};

// 워드프레스 게시글 작성 함수
async function createArticle({ wpUrl, wpId, applicationPassword, articleData }: CreateArticleType) {
  try {
    // 사용자 이름과 애플리케이션 비밀번호로 Basic 인증 헤더 생성
    const username = wpId;
    const appPassword = applicationPassword;
    const basicAuth = "Basic " + Buffer.from(`${username}:${appPassword}`).toString("base64");

    const axiosBody = articleData;

    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth,
      },
    };

    const response = await axios.post(`${wpUrl}/wp-json/wp/v2/posts`, axiosBody, axiosConfig);

    return response.data; // 생성된 글 정보 반환
  } catch (error) {
    console.error("createArticle() : 워드프레스 게시글 작성 중 오류");
    throw error;
  }
}
