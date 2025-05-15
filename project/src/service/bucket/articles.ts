import { TistoryArticleType } from "@/types/tistory";
import { supabase } from "../../lib/supabaseClient";
import { decodeFromBase64, encodeToBase64 } from "@/utils/base64";

////////// CREATE : 게시물 업로드
export async function createArticle(articleNumber: number, article: TistoryArticleType, folderName: string) {
  try {
    const { images, htmlFile } = article;

    let imageUploadResult;

    // 이미지 업로드
    if (!images || images.length === 0) {
      imageUploadResult = null;
    } else {
      imageUploadResult = await Promise.allSettled(
        images.map(async (imageFile, idx) => {
          const originalName = encodeToBase64(`${imageFile.name.split(".")[0]}-${articleNumber}-${idx}`);
          const imageExtension = imageFile.name.split(".")[1];

          const uploadFileName = `${originalName}.${imageExtension}`;

          const imagePath = `${folderName}/article-${articleNumber}/img/${uploadFileName}`;

          await uploadFile("articles", imagePath, imageFile);
        })
      );
    }

    let htmlUploadResult;

    if (!htmlFile) {
      htmlUploadResult = null;
    } else {
      const htmlExtension = htmlFile.name.split(".").pop();
      const htmlName = `${articleNumber}.${htmlExtension}`;
      const htmlPath = `${folderName}/article-${articleNumber}/${htmlName}`;

      htmlUploadResult = await uploadFile("articles", htmlPath, htmlFile);
    }

    return { data: { imageUploadResult, htmlUploadResult }, error: null };
  } catch (error) {
    console.error("createArticle()", error);
    return { data: null, error: error };
  }
}




////////// CREATE : 게시물 리스트 업로드
export async function createArticleList(wpId: string, articleList: TistoryArticleType[]) {
  try {
    const result = await Promise.allSettled(
      articleList.map(async (article, idx) => {
        await createArticle(idx, article, wpId);
      })
    );

    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}

////////// CORE : 파일 업로드

export async function uploadFile(bucketName: string, filePath: string, file: File) {
  const response = await supabase.storage.from(bucketName).upload(filePath, file, {
    upsert: true, // 같은 경로에 파일이 있으면 덮어쓰기
  });

  return response;
}

export async function emptyBucket(wpId: string) {
  try {
    const articlesPathList = await readWpIdBucketPathList(wpId);

    await Promise.all(
      articlesPathList.map((article) => {
        const { articlePath } = article;
        const { imagePathList, htmlPathList } = article;

        // 이미지 삭제
        imagePathList.map(async (path) => {
          await supabase.storage.from("articles").remove([`${wpId}/${articlePath}/img/${path}`]);
        });

        // html 삭제
        htmlPathList.map(async (path) => {
          await supabase.storage.from("articles").remove([`${wpId}/${articlePath}/${path}`]);
        });
      })
    );

    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}

////////// READ : 유저의 버킷 경로 가져오기
export type ReadWpIdBucketPathListReturnType = {
  articlePath: string;
  imagePathList: string[];
  htmlPathList: string[];
};

export async function readWpIdBucketPathList(path: string): Promise<ReadWpIdBucketPathListReturnType[]> {
  try {
    // 경로를 매개변수로 받아 유연하게 사용
    const { data: articlePathListData } = await supabase.storage.from("articles").list(path);

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

        const imagePathList = imagePathListResponse?.map((item) => item.name) || [];
        const htmlPathList =
          htmlPathResponse?.filter((item) => item.name.endsWith(".html")).map((item) => item.name) || [];

        return {
          articlePath: item.name,
          imagePathList: imagePathList,
          htmlPathList: htmlPathList,
        };
      })
    );

    return articlesPathList;
  } catch (error) {
    console.error("readArticlesPathList()", error);
    return [];
  }
}

export type ArticlePathListType = {
  articlePath: string;
  imagePathList: string[] | [];
  htmlPathList: string | null;
};

////////// READ : 파일 목록 가져오기
export async function readArticlesPathList(wpId: string) {
  try {
    // 경로를 매개변수로 받아 유연하게 사용
    const { data: articlePathListResponseData } = await supabase.storage.from("articles").list(wpId);

    // 예외처리 : 경로 데이터가 없거나 빈 배열이라면 빈 배열 반환
    if (!articlePathListResponseData || articlePathListResponseData.length === 0) {
      return { data: [], error: null };
    }

    const articlesPathList = articlePathListResponseData.map((el) => el.name);

    // 모든 이미지 폴더와 HTML 파일 경로를 한 번에 요청하기 위한 배치 처리
    const imageFolderPaths = articlesPathList.map((articlePath) => `${wpId}/${articlePath}/img`);
    const htmlFilePaths = articlesPathList.map((articlePath) => `${wpId}/${articlePath}`);

    // 병렬로 모든 이미지 폴더와 HTML 파일 목록 가져오기
    const [imagePathsResponses, htmlPathsResponses] = await Promise.all([
      Promise.all(imageFolderPaths.map((path) => supabase.storage.from("articles").list(path))),
      Promise.all(htmlFilePaths.map((path) => supabase.storage.from("articles").list(path))),
    ]);

    // 결과 매핑
    const result = articlesPathList.map((articlePath, index) => {
      const imagePathListResponseData = imagePathsResponses[index].data;
      const htmlPathListResponseData = htmlPathsResponses[index].data;

      // 이미지 파일 경로 목록
      let imagePathList: string[] = [];

      // 예외처리 : 이미지 파일 경로 목록이 없거나 빈 배열이라면 빈 배열 반환
      if (imagePathListResponseData && imagePathListResponseData.length > 0) {
        imagePathList = imagePathListResponseData.map((item) => {
          const decodedFileName = decodeFromBase64(item.name.split(".")[0]);
          const decodedExtension = item.name.split(".").pop();
          return `${decodedFileName}.${decodedExtension}`;
        });
      }

      // HTML 파일 경로
      let htmlPathList = null;

      // 예외처리 : HTML 파일 경로가 없거나 빈 배열이라면 null 반환
      if (htmlPathListResponseData && htmlPathListResponseData.length > 0) {
        const htmlFiles = htmlPathListResponseData.filter((item) => item.name.endsWith(".html"));
        if (htmlFiles.length > 0) {
          htmlPathList = htmlFiles[0].name;
        }
      }

      // 게시물 경로 반환
      return {
        articlePath,
        imagePathList,
        htmlPathList,
      };
    });

    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}
