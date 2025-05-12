import { TistoryArticleType } from "@/types/tistory";
import axios from "axios";
import * as cheerio from "cheerio";
import { ArticleHtmlType } from "@/types/tistory";

////////// 폼데이터 포맷팅(객체 -> 객체 배열)
export function formatFormData(formData: FormData) {
  try {
    const articles: TistoryArticleType[] = [];

    // 폼데이터 존재 여부 확인
    if ([...formData.entries()].length === 0) {
      throw new Error("폼데이터가 존재하지 않습니다.");
    }

    // 폼데이터 포맷팅
    for (const [key, value] of formData.entries()) {
      // console.log("포맷팅 전 폼데이터", formData);

      // 게시글 번호 추출
      const articleNumber = Number(key.split("_")[1]);

      // 게시글 객체 찾기
      let article = articles.find((el) => el.articleNumber === articleNumber);

      // 게시글 객체가 없다면 생성 및 배열에 추가
      if (!article) {
        article = {
          articleNumber: articleNumber,
          images: [],
          htmlFile: null,
        };

        // 게시글 객체 배열에 추가
        articles.push(article);
      }

      // 이미지 파일 포맷팅
      if (key.startsWith("image_")) {
        const imageFile = value as File;

        // 게시글 객체 > 이미지 배열에 추가
        article.images?.push(imageFile);
      }

      // HTML 파일 포맷팅
      if (key.startsWith("html_")) {
        const htmlFile = value as File;

        // 게시글 객체 > html 파일 추가
        article.htmlFile = htmlFile;
      }
    }

    // console.log("포맷팅된 폼데이터", articles);
    return articles;
  } catch (error) {
    throw error;
  }
}

////////// HTML 파일 내용 추출 및 분석 함수
export async function extractHtmlContent(article: TistoryArticleType, blogUrl: string) {
  try {
    // HTML 파일 객체
    const htmlFile = article.htmlFile as File;
    // HTML 파일 -> 문자열로 변경
    const htmlString = await htmlFileToString(htmlFile);
    // 게시글 제목
    const articleTitle = extractArticleTitle(htmlFile);
    // 미디어 기본 주소
    const mediaBaseUrl = getMediaBaseUrl(blogUrl);

    // 전처리된 HTML 문자열
    const preprocessedHtml = preprocessHtml(article.articleNumber, articleTitle, htmlString, mediaBaseUrl);

    // console.log("전처리된 HTML 문자열", preprocessedHtml);

    // HTML 파싱
    const $ = cheerio.load(preprocessedHtml);

    // 제목 추출
    const title = $(".title-article").text().trim() || "";
    // 본문 추출
    const content = $(".article-view").html() || "";
    // 작성일 추출
    const date = $(".date").text().trim() || "";

    // 게시글 데이터 객체 생성
    const articleData = {
      title,
      content,
      date,
      status: "publish",
    };

    return articleData;
  } catch (error) {
    throw error;
  }
}

////////// 이미지 태그 src 속성값 변경
export function preprocessHtml(articleNumber: number, articleTitle: string, htmlString: string, mediaBaseUrl: string) {
  try {
    // Cheerio로 HTML 파싱
    const $ = cheerio.load(htmlString);

    // 이미지 태그의 src 속성 변경
    const images =
      $("img")
        .map((idx, el) => {
          // src 변경
          $(el)?.attr("src", `${mediaBaseUrl}/${articleNumber}_${idx}`);
          // 변경 후 src
          const changedSrc = $(el)?.attr("src");
          // 변경 후 src 반환
          return changedSrc;
        })
        // 배열로 반환
        .get()
        // falsy한 요소 제거
        .filter(Boolean) || [];

    // console.log("이미지 태그 src 속성값 변경 결과", images);
    return $.html();
  } catch (error) {
    throw error;
  }
}

////////// 게시글 제목 추출
export function extractArticleTitle(htmlFile: File) {
  try {
    // HTML 파일 이름
    const htmlFileName = htmlFile.name; // 예: '티스토리 데이터 압축파일/15/15-다이소-집게핀-머리집게-핀-구입-사용-후기.html'
    // 파일 이름 분리
    const parts = htmlFileName.split(".")[0].split("-"); // ['15', '다이소', '집게핀', '머리집게', '핀', '구입', '사용', '후기']
    // 제목 추출
    const articleTitle = parts.slice(1).join("-"); // '집게핀-머리집게-핀-구입-사용-후기'

    return articleTitle;
  } catch (error) {
    throw error;
  }
}

////////// 파일 이름 변경
export function changeFileName(file: File, nextFileName: string) {
  try {
    // 원본 파일
    const originalFile = file as File;

    // 새 File 객체 생성 (원본 파일의 내용과 타입은 유지하고 이름만 변경)
    const newFile = new File(
      [originalFile], // 원본 파일의 내용
      nextFileName, // 새 파일 이름
      { type: originalFile.type } // 원본 파일의 타입
    );

    return newFile;
  } catch (error) {
    throw error;
  }
}

////////// 워드프레스 게시글 작성 함수 인수 타입
type CreateArticleType = {
  wpUrl: string;
  wpId: string;
  applicationPassword: string;
  articleHtml: ArticleHtmlType;
  articleImages: File[];
};

////////// 워드프레스 게시글 작성 함수
export async function createArticle({
  wpUrl,
  wpId,
  applicationPassword,
  articleHtml,
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
    const axiosBody = articleHtml;

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

    console.log("업로드될 이미지 파일명", imageFile.name);
    // console.log("이미지 파일 업로드 요청 바디", formData);
    // 이미지 파일 업로드 요청
    const result = await axios.post(`${wpUrl}/wp-json/wp/v2/media`, formData, {
      headers: {
        "Content-Disposition": `attachment; filename="${encodeURIComponent(imageFile.name)}"`,
        "Content-Type": "multipart/form-data",
        Authorization: authHeader,
      },
    });

    return {
      data: result,
      error: null,
    };
  } catch (error) {
    console.error("uploadImageToWordPress() : 이미지 업로드 중 오류", error);
    throw error;
  }
}

////////// 미디어 기본 주소 추출
export function getMediaBaseUrl(blogUrl: string) {
  // 현재 날짜 객체 생성
  const now = new Date();

  // 년도 얻기 (4자리 숫자)
  const year = now.getFullYear();

  // 월 얻기 (0-11 범위의 숫자, 0은 1월, 11은 12월)
  const month = now.getMonth() + 1;

  return `${blogUrl}/wp-content/uploads/${year}/${month}`;
}

////////// HTML 파일 -> 문자열로 변경
export async function htmlFileToString(htmlFile: File) {
  try {
    // 데이터 형식 변환(파일 객체 -> 바이너리)
    const arrayBuffer = await htmlFile.arrayBuffer();
    // utf-8 디코더 객체 생성
    const textDecoder = new TextDecoder("utf-8");
    // 데이터 형식 변환(바이너리 -> 문자열)
    const htmlString = textDecoder.decode(arrayBuffer);

    return htmlString;
  } catch (error) {
    throw error;
  }
}
