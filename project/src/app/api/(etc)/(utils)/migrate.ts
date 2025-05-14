import { TistoryArticleType } from "@/types/tistory";
import axios from "axios";
import * as cheerio from "cheerio";
import { ArticleFileType, ArticlePathType } from "../(types)/ArticleType";
import sharp from "sharp";

////////// 타입
type CreateArticleType = {
  wpInfo: {
    wpId: string;
    wpApplicationPw: string;
    wpUrl: string;
  };
  articlePath: ArticlePathType;
  articleFile: ArticleFileType;
};

////////// 워드프레스 게시글 작성
export async function createWordPressArticle({ wpInfo, articleFile, articlePath }: CreateArticleType) {
  try {
    // 워드프레스 정보 비구조화
    const { wpId, wpApplicationPw, wpUrl } = wpInfo;

    // 이미지 파일 리스트 비구조화
    const { imageFileList } = articleFile;

    const { imagePathList } = articlePath;

    // Basic 인증 헤더 생성
    const basicAuth = "Basic " + Buffer.from(`${wpId}:${wpApplicationPw}`).toString("base64");

    // 요청 바디 설정
    const axiosBody = await extractHtmlContent({ wpInfo, articleFile, articlePath });

    // 요청 헤더 설정
    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth,
      },
    };

    // 게시글 업로드
    await axios.post(`${wpUrl}/wp-json/wp/v2/posts`, axiosBody, axiosConfig);

    if (!imageFileList || imageFileList.length === 0) {
      return {
        data: {
          article: axiosBody,
          image: [],
        },
        error: null,
      };
    }

    // 이미지 업로드 처리
    const imageUploadResult = await Promise.all(
      imageFileList.map(async (imageFile, index) => {
        const uploadImageFileName = imagePathList[index];

        return await uploadImageToWordPress({ wpUrl, authHeader: basicAuth, imageFile, uploadImageFileName });
      })
    );

    return {
      data: {
        article: axiosBody,
        image: imageUploadResult,
      },
      error: null,
    }; // 생성된 글 정보 반환
  } catch (error) {
    console.error("createWordPressArticle() : 워드프레스 게시글 작성 중 오류");
    throw error;
  }
}

////////// 타입
type ExtractHtmlContentType = {
  wpInfo: {
    wpId: string;
    wpApplicationPw: string;
    wpUrl: string;
  };
  articleFile: ArticleFileType;
  articlePath: ArticlePathType;
};

////////// HTML 추출
export async function extractHtmlContent({ wpInfo, articleFile, articlePath }: ExtractHtmlContentType) {
  try {
    // HTML 파일 객체 추출
    const htmlFile = articleFile.htmlFile;

    // HTML 파일 -> 문자열로 변경
    const htmlString = await htmlFileToString(htmlFile);

    // HTML 파일에서 제목 추출
    const title = cheerio.load(htmlString)(".title-article").text().trim() || "";

    // 미디어 업로드 베이스 URL 생성
    const mediaBaseUrl = getMediaBaseUrl(wpInfo.wpUrl);

    // 전처리된 HTML 문자열
    const preprocessedHtml = preprocessHtml({ articleFile, articlePath, htmlString, mediaBaseUrl });

    // 전처리된 HTML 파싱
    const $ = cheerio.load(preprocessedHtml);

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

////////// 타입
type PreprocessHtmlType = {
  articleFile: ArticleFileType;
  articlePath: ArticlePathType;
  htmlString: string;
  mediaBaseUrl: string;
};

////////// HTML 전처리
export function preprocessHtml({ articleFile, articlePath, htmlString, mediaBaseUrl }: PreprocessHtmlType) {
  try {
    // 이미지 경로 리스트
    const imagePathList = articlePath.imagePathList;

    // Cheerio로 HTML 파싱
    const $ = cheerio.load(htmlString);

    // 이미지 태그의 src 속성 변경
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const images =
      $("img")
        .map((idx, el) => {
          // HTML내 이미지 태그의 src 값(확장자 X)
          const originSrc = $(el)?.attr("src")?.split("/").pop()?.split(".")[0];

          // 매칭되는 이미지 파일 경로(확장자 O)
          const matchingTryPath = imagePathList.filter((el) => el.split("-")[0] === originSrc)[0];
          const matchingPath = matchingTryPath ? matchingTryPath : imagePathList[idx];

          // 매칭되는 이미지 파일 인덱스
          const matchingPathFileIndex = imagePathList.findIndex((path) => path === matchingPath);

          // 매칭되는 이미지 파일 객체(매칭되지 않았다면 이미지 태그가 나타난 인덱스의 이미지 파일 선택)
          const matchingImageFile = articleFile.imageFileList[matchingPathFileIndex];

          // 기존 파일 확장자
          // const matchingImageFileExtension = matchingImageFile.type.split("/")[1];

          // 이미지 파일 크기 체크 및 확장자 변경
          const extension = changeImageFileExtensionBySize(matchingImageFile.size);

          // 새로 삽입할 이미지 파일 경로
          const newPath = `${matchingPath.split(".")[0]}.${extension}`;

          console.log("newPath : ", newPath);

          // src 변경
          $(el)?.attr("src", `${mediaBaseUrl}/${newPath}`);

          // 변경된 src 반환
          return $(el)?.attr("src");
        })
        // 배열로 반환
        .get()
        // falsy한 요소 제거
        .filter(Boolean) || [];

    return $.html();
  } catch (error) {
    console.error("preprocessHtml() : HTML 전처리 중 오류", error);
    throw error;
  }
}

////////// 워드프레스 이미지 업로드
type UploadImageToWordPressType = {
  wpUrl: string;
  authHeader: string;
  imageFile: Blob;
  uploadImageFileName: string;
};

export async function uploadImageToWordPress({
  wpUrl,
  authHeader,
  imageFile,
  uploadImageFileName,
}: UploadImageToWordPressType) {
  try {
    // 이미지 파일 -> 바이너리 데이터
    const arrayBuffer = await imageFile.arrayBuffer();

    // 바이너리 데이터 -> 버퍼 객체
    const buffer = Buffer.from(arrayBuffer);

    // 버퍼 객체 -> 블롭 객체
    let blob = new Blob([buffer], { type: imageFile.type });

    if (imageFile.size > Math.pow(1024, 2)) {
      console.log("이미지 리사이징 시작");
      console.log("파일 사이즈 : ", imageFile.size / Math.pow(1024, 2), "MB");
      blob = await resizeImage(imageFile);
      console.log("이미지 리사이징 완료");
      console.log("리사이징 파일 사이즈 : ", blob.size / Math.pow(1024, 2), "MB");
    }

    // 이미지 파일 업로드 요청 바디 설정
    const formData = new FormData();
    formData.append("file", blob, uploadImageFileName);

    // 이미지 파일 업로드 요청
    const result = await axios.post(`${wpUrl}/wp-json/wp/v2/media`, formData, {
      headers: {
        "Content-Disposition": `attachment; filename="${encodeURIComponent(uploadImageFileName)}"`,
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

////////// HTML 파일 -> 문자열로 변경
export async function htmlFileToString(htmlFile: Blob) {
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

////////// 미디어 기본 주소 추출
export function getMediaBaseUrl(blogUrl: string) {
  // 현재 날짜 객체 생성
  const now = new Date();
  // 년도 얻기 (4자리 숫자)
  const year = now.getFullYear();
  // 월 얻기 (0-11 범위의 숫자, 0은 1월, 11은 12월)
  const month = (now.getMonth() + 1).toString().padStart(2, "0");

  // 미디어 기본 주소 생성
  const mediaBaseUrl = `${blogUrl.replace("https", "http")}/wp-content/uploads/${year}/${month}`;

  return mediaBaseUrl;
}

////////// 이미지 파일 크기 체크 및 확장자 변경
export function changeImageFileExtensionBySize(fileSize: number) {
  let extension;
  const fileSizeMb = Number((fileSize / Math.pow(1024, 2)).toFixed(2));

  if (fileSizeMb && fileSizeMb > 1) {
    extension = "jpg";
  } else {
    extension = "png";
  }

  return extension;
}

// 이미지 리사이징
export async function resizeImage(imageFile: Blob) {
  try {
    // Blob을 Buffer로 변환
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sharp를 사용하여 이미지 리사이징 및 압축
    const resizedImageBuffer = await sharp(buffer)
      .resize(1200, 1200, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 80,
        progressive: true,
      })
      .toBuffer();

    // Buffer를 Blob으로 변환하여 반환
    return new Blob([resizedImageBuffer], { type: "image/jpeg" });
  } catch (error) {
    console.error("이미지 리사이징 오류:", error);
    throw error;
  }
}

////////////////////////////////////////////////////////////////////// DEPRECATED //////////////////////////////////////////////////////////////////////
////////// DEPRECATED : 폼데이터 포맷팅(객체 -> 객체 배열)
export function formatFormData(formData: FormData) {
  try {
    const articles: TistoryArticleType[] = [];

    // 폼데이터 존재 여부 확인
    if ([...formData.entries()].length === 0) {
      throw new Error("폼데이터가 존재하지 않습니다.");
    }

    // 폼데이터 포맷팅
    for (const [key, value] of formData.entries()) {
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

    return articles;
  } catch (error) {
    throw error;
  }
}
