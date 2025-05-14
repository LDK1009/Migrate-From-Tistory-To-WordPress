import { supabase } from "@/app/api/supabaseServer";
import { supabase as supabaseClient } from "@/lib/supabaseClient";
import { decodeFromBase64 } from "@/utils/base64";

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

        const imagePathList = imagePathListResponse?.map((item) => {
          const decodedFileName = decodeFromBase64(item.name.split(".")[0]);
          const numbering1 = item.name.split("-")[1].split(".")[0];
          const numbering2 = item.name.split("-")[2].split(".")[0];
          const decodedExtension = item.name.split(".").pop();

          return `${decodedFileName}.${decodedExtension}`;
        });
        const htmlPath = htmlPathResponse?.filter((item) => item.name.endsWith(".html"));

        return {
          articlePath: item.name,
          imagePathList: imagePathList,
          htmlPathList: htmlPath?.[0].name,
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
    const articlesFiles = await Promise.all(
      articlePathList.map(async (article) => {
        // 경로 분리
        const { imagePathList, htmlPathList } = article;
        const path = `${wpId}/${article.articlePath}`;

        // 이미지 파일 다운로드
        const imageFileList = await Promise.all(
          imagePathList.map(async (imagePath) => {
            const { data: imageFile } = await coreDownloadFile("articles", `${path}/img/${imagePath}`);
            return imageFile;
          })
        );

        // HTML 파일 다운로드
        const { data: htmlFile } = await coreDownloadFile("articles", `${path}/${htmlPathList}`);

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
