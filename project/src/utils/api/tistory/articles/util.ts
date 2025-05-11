import { TistoryArticleType } from "@/types/tistory";
import axios from "axios";
import * as cheerio from "cheerio";
import { ArticleDataType } from "@/types/tistory";

////////// 폼데이터 포맷팅(객체 -> 객체 배열)
export function formatFormData(formData: FormData) {
  try {
    const articles: TistoryArticleType[] = [];

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
export async function extractHtmlContent(htmlFile: File) {
  try {
    // File 객체를 ArrayBuffer로 변환
    const arrayBuffer = await htmlFile.arrayBuffer();

    // ArrayBuffer를 문자열로 디코딩
    const textDecoder = new TextDecoder("utf-8");
    const htmlContent = textDecoder.decode(arrayBuffer);

    // console.log(htmlContent, "htmlContent");

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

    return articleData;
  } catch (error) {
    console.error("extractHtmlContent() : HTML 파일 내용 추출 중 오류");
    console.error(error);

    throw error;
  }
}

export function extractArticleTitle(htmlFile: File) {
  // 변경된 코드
  const htmlFileName = htmlFile.name; // 예: '티스토리 데이터 압축파일/15/15-다이소-집게핀-머리집게-핀-구입-사용-후기.html'
  const parts = htmlFileName.split(".")[0].split("-"); // ['15', '다이소', '집게핀', '머리집게', '핀', '구입', '사용', '후기']
  // 변경된 코드 - 하이픈(-)으로 분리 후 3번째 요소부터 끝까지 선택
  const articleTitle = parts.slice(1).join("-"); // '집게핀-머리집게-핀-구입-사용-후기'

  return articleTitle;
}

export function changeFileName(file: File, nextFileName: string) {
  const originalFile = file as File;

  // 새 파일 이름 생성
  const newFileName = nextFileName;

  // 새 File 객체 생성 (원본 파일의 내용과 타입은 유지하고 이름만 변경)
  const newFile = new File(
    [originalFile], // 원본 파일의 내용
    newFileName, // 새 파일 이름
    { type: originalFile.type } // 원본 파일의 타입
  );

  return newFile;
}

export async function changeImageTagSrc(articleNumber: number, htmlFile: File) {
  // File 객체를 ArrayBuffer로 변환
  const arrayBuffer = await htmlFile.arrayBuffer();

  // ArrayBuffer를 문자열로 디코딩
  const textDecoder = new TextDecoder("utf-8");
  // 문자열로 디코딩
  const htmlContent = textDecoder.decode(arrayBuffer);
  // 게시글 제목 추출
  const articleTitle = extractArticleTitle(htmlFile); // '집게핀-머리집게-핀-구입-사용-후기'

  const $ = cheerio.load(htmlContent);

  const images =
    $("img")
      .map((idx, el) => {
        $(el)?.attr("src", `${articleTitle}_${articleNumber}_${idx}`);
        return $(el)?.attr("src");
      })
      .get()
      .filter(Boolean) || [];

  console.log(images, "이미지");
}

////////// 워드프레스 게시글 작성 함수 인수 타입
type CreateArticleType = {
  wpUrl: string;
  wpId: string;
  applicationPassword: string;
  articleData: ArticleDataType;
  articleImages: File[];
};

////////// 워드프레스 게시글 작성 함수
export async function createArticle({
  wpUrl,
  wpId,
  applicationPassword,
  articleData,
  articleImages,
}: CreateArticleType) {
  try {
    // 사용자 이름과 애플리케이션 비밀번호로 Basic 인증 헤더 생성
    const username = wpId;
    // 애플리케이션 비밀번호 추출
    const appPassword = applicationPassword;
    // Basic 인증 헤더 생성
    const basicAuth = "Basic " + Buffer.from(`${username}:${appPassword}`).toString("base64");

    // 요청 바디 설정
    const axiosBody = articleData;

    // 요청 헤더 설정
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth,
      },
    };

    // 게시글 업로드
    const response = await axios.post(`${wpUrl}/wp-json/wp/v2/posts`, axiosBody, axiosConfig);

    // 이미지 업로드 처리
    if (articleImages && articleImages.length > 0) {
      await Promise.all(
        articleImages.map(async (image) => {
          return await uploadImageToWordPress(wpUrl, basicAuth, image);
        })
      );
    }

    return response.data; // 생성된 글 정보 반환
  } catch (error) {
    console.error("createArticle() : 워드프레스 게시글 작성 중 오류");
    throw error;
  }
}

////////// 워드프레스 이미지 업로드 함수
export async function uploadImageToWordPress(wpUrl: string, authHeader: string, imageFile: File) {
  try {
    console.log(imageFile.name);

    return;

    // 이미지 파일 -> 바이너리 데이터
    const arrayBuffer = await imageFile.arrayBuffer();
    // 바이너리 데이터 -> 버퍼 객체
    const buffer = Buffer.from(arrayBuffer);
    // 버퍼 객체 -> 블롭 객체
    const blob = new Blob([buffer], { type: imageFile.type });

    // 이미지 파일 업로드 요청 바디 설정
    const formData = new FormData();

    // 이미지 파일 추가
    formData.append("file", blob, imageFile.name);

    // 이미지 파일 업로드 요청
    const result = await axios.post(`${wpUrl}/wp-json/wp/v2/media`, formData, {
      headers: {
        "Content-Disposition": `attachment; filename="${encodeURIComponent(imageFile.name)}"`,
        "Content-Type": "multipart/form-data",
        Authorization: authHeader,
      },
    });

    console.log(imageFile.name, "업로드 완료");

    return {
      data: result,
      error: null,
    };
  } catch (error) {
    console.error("uploadImageToWordPress() : 이미지 업로드 중 오류", error);
    throw error;
  }
}
