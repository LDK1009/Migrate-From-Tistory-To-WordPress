import { supabase } from "@/app/api/supabaseServer";
import { supabase as supabaseClient } from "@/lib/supabaseClient";
import { decodeFromBase64, encodeToBase64 } from "@/utils/base64";

////////// READ : 파일 목록 가져오기
export type ArticlePathListType = {
  articlePath: string;
  imagePathList: string[];
  htmlPathList: string;
};

export async function readArticlesPathList(path: string) {
  try {
    // 경로를 매개변수로 받아 유연하게 사용
    const { data: articlePathListData } = await supabaseClient.storage.from("articles").list(path);

    // 예외처리 : 경로 데이터가 없거나 빈 배열이라면 빈 배열 반환
    if (!articlePathListData || articlePathListData.length === 0) {
      return [];
    }

    // Promise.all을 사용하여 모든 비동기 작업이 완료될 때까지 기다림
    const articlesPathList = await Promise.all(

      articlePathListData.map(async (item) => {
        const imageFolderPath = `${path}/${item.name}/img`; // 'image'가 아닌 'img'로 수정
        const htmlFilePath = `${path}/${item.name}`;

        const { data: imagePathListResponse } = await supabase.storage.from("articles").list(imageFolderPath);
        const { data: htmlPathResponse } = await supabase.storage.from("articles").list(htmlFilePath);

        // 이미지 파일 경로 목록
        let imagePathList: string[] = [];

        // 예외처리 : 이미지 파일 경로 목록이 없거나 빈 배열이라면 빈 배열 반환
        if (imagePathListResponse && imagePathListResponse?.length > 0) {
          imagePathList = imagePathListResponse?.map((item) => {
            const decodedFileName = decodeFromBase64(item.name.split(".")[0]);
            const decodedExtension = item.name.split(".").pop();

            return `${decodedFileName}.${decodedExtension}`;
          });
        } else {
          imagePathList = [];
        }

        // HTML 파일 경로
        let htmlPathList;

        // 예외처리 : HTML 파일 경로가 없거나 빈 배열이라면 null 반환
        if (htmlPathResponse && htmlPathResponse?.length > 0) {
          htmlPathList = htmlPathResponse?.filter((item) => item.name.endsWith(".html"));
        } else {
          htmlPathList = null;
        }

        return {
          articlePath: item.name,
          imagePathList: imagePathList,
          htmlPathList: htmlPathList?.[0].name,
        };
      })
    );

    return articlesPathList;
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

    const articlesFiles = await Promise.all(

      articlePathList.map(async (article) => {
        // 경로 분리
        const { imagePathList, htmlPathList } = article;
        const basePath = `${wpId}/${article.articlePath}`;

        // 이미지 파일 다운로드
        let imageFileList: Blob[] = [];

        if (imagePathList.length > 0) {
          imageFileList = await Promise.all(
            imagePathList.map(async (path) => {
              const fileName = encodeToBase64(path.split(".")[0]);
              const extension = path.split(".").pop();
              const imagePath = `${fileName}.${extension}`;

              const { data: imageFile } = await coreDownloadFile("articles", `${basePath}/img/${imagePath}`);
              return imageFile;
            })
          ) as Blob[];
        } else {
          imageFileList = [];
        }

        // HTML 파일 다운로드
        let htmlFile;

        if (htmlPathList) {
          htmlFile = await coreDownloadFile("articles", `${basePath}/${htmlPathList}`);
        } else {
          htmlFile = null;
        }

        return {
          imageFileList: imageFileList,
          htmlFile: htmlFile,
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
