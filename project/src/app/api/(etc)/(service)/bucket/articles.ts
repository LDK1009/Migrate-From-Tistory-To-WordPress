import { supabase } from "@/app/api/supabaseServer";
import { supabase as supabaseClient } from "@/lib/supabaseClient";
import { decodeFromBase64, encodeToBase64 } from "@/utils/base64";

export type ArticlePathListType = {
  articlePath: string;
  imagePathList: string[] | [];
  htmlPathList: string | null;
};

////////// READ : 파일 목록 가져오기
export async function readArticlesPathList(wpId: string) {
  try {
    // 경로를 매개변수로 받아 유연하게 사용
    const { data: articlePathListResponseData } = await supabaseClient.storage.from("articles").list(wpId);

    // 예외처리 : 경로 데이터가 없거나 빈 배열이라면 빈 배열 반환
    if (!articlePathListResponseData || articlePathListResponseData.length === 0) {
      return [];
    }

    const articlesPathList = articlePathListResponseData.map((el) => el.name);

    // Promise.all을 사용하여 모든 비동기 작업이 완료될 때까지 기다림
    const result = await Promise.all(
      articlesPathList.map(async (articlePath) => {
        const imageFolderPath = `${wpId}/${articlePath}/img`;
        const htmlFilePath = `${wpId}/${articlePath}`;

        const { data: imagePathListResponseData } = await supabase.storage.from("articles").list(imageFolderPath);
        const { data: htmlPathListResponseData } = await supabase.storage.from("articles").list(htmlFilePath);

        // 이미지 파일 경로 목록
        let imagePathList: string[] = [];

        // 예외처리 : 이미지 파일 경로 목록이 없거나 빈 배열이라면 빈 배열 반환
        if (!imagePathListResponseData || imagePathListResponseData?.length === 0) {
          imagePathList = [];
        } else {
          imagePathList = imagePathListResponseData?.map((item) => {
            const decodedFileName = decodeFromBase64(item.name.split(".")[0]);
            const decodedExtension = item.name.split(".").pop();

            return `${decodedFileName}.${decodedExtension}`;
          });
        }

        // HTML 파일 경로
        let htmlPathList;

        // 예외처리 : HTML 파일 경로가 없거나 빈 배열이라면 null 반환
        if (!htmlPathListResponseData || htmlPathListResponseData?.length === 0) {
          htmlPathList = null;
        } else {
          htmlPathList = htmlPathListResponseData?.filter((item) => item.name.endsWith(".html")).map((el) => el.name)[0];
        }

        // 게시물 경로 반환
        return {
          articlePath,
          imagePathList,
          htmlPathList,
        };
      })
    );

    return result;
  } catch (error) {
    return { data: null, error: error };
  }
}

////////// READ : 파일 목록 다운로드하기
export async function readDownloadArticles(wpId: string, articlePathList: ArticlePathListType[]) {
  try {
    // 예외처리 : 게시물 파일 경로 목록이 없거나 빈 배열이라면 빈 배열 반환
    if (!articlePathList || articlePathList.length === 0) {
      return [];
    }

    // 게시물 파일 다운로드
    const articlesFiles = await Promise.all(
      articlePathList.map(async (article) => {
        // 이미지, HTML 경로 분리
        const { imagePathList, htmlPathList } = article;

        // 기본 경로
        const basePath = `${wpId}/${article.articlePath}`;

        // 이미지 파일 리스트
        let imageFileList: Blob[] = [];

        // 예외처리 : 이미지 파일 경로 목록이 없거나 빈 배열이라면 빈 배열 반환
        if (!Array.isArray(imagePathList) || imagePathList.length === 0) {
          imageFileList = [];
        } else {
          imageFileList = (await Promise.all(
            imagePathList.map(async (path) => {
              const fileName = encodeToBase64(path.split(".")[0]);
              const extension = path.split(".").pop();
              const imagePath = `${fileName}.${extension}`;

              const { data: imageFile } = await coreDownloadFile("articles", `${basePath}/img/${imagePath}`);
              return imageFile;
            })
          )) as Blob[];
        }

        // HTML 파일
        let htmlFile;

        // 예외처리 : HTML 파일 경로가 없거나 빈 배열이라면 null 반환
        if (!htmlPathList) {
          htmlFile = null;
        } else {
          const { data: downloadedHtmlFile } = await coreDownloadFile("articles", `${basePath}/${htmlPathList}`);
          htmlFile = downloadedHtmlFile;
        }

        return {
          imageFileList,
          htmlFile,
        };
      })
    );

    return articlesFiles;
  } catch (error) {
    return { data: null, error: error };
  }
}

////////// Util : 파일 다운로드
export async function coreDownloadFile(bucketName: string, path: string) {
  try {
    const response = await supabase.storage.from(bucketName).download(path);
    return response;
  } catch (error) {
    return { data: null, error: error };
  }
}
