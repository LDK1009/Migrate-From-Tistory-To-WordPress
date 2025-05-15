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

    return result;
  } catch (error) {
    return { data: null, error: error };
  }
}

////////// READ : 게시물 파일 경로 가져오기
export async function readArticlePathObject(wpId: string, articlePath: string) {
  try {
    // 게시물 번호 추출
    let imagePathList: string[] | [];
    let htmlPath: string | null;

    // 모든 이미지 폴더와 HTML 파일 경로를 한 번에 요청하기 위한 배치 처리
    const { data: imagePathListResponseData } = await supabaseClient.storage
      .from("articles")
      .list(`${wpId}/${articlePath}/img`);
    const formattedImagePathListResponseData = imagePathListResponseData?.map((item) => item.name);

    const { data: htmlPathResponseData } = await supabaseClient.storage.from("articles").list(`${wpId}/${articlePath}`);

    const formattedHtmlPathResponseData = htmlPathResponseData?.filter((item) => item.name.endsWith(".html"))[0].name;

    if (!Array.isArray(formattedImagePathListResponseData) || formattedImagePathListResponseData.length === 0) {
      imagePathList = [];
    } else {
      imagePathList = formattedImagePathListResponseData;
    }

    if (!formattedHtmlPathResponseData) {
      htmlPath = null;
    } else {
      htmlPath = formattedHtmlPathResponseData;
    }

    const result = {
      imagePathList,
      htmlPath,
    };

    // 게시물 경로 반환
    return { data: result, error: null };
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

    // 모든 다운로드 요청을 준비
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const downloadRequests: Promise<any>[] = [];
    const downloadMapping: { articleIndex: number; type: "image" | "html"; imageIndex?: number }[] = [];

    // 다운로드 요청 준비
    articlePathList.forEach((article, articleIndex) => {
      const { imagePathList, htmlPathList } = article;
      const basePath = `${wpId}/${article.articlePath}`;

      // 이미지 파일 다운로드 요청 추가
      if (Array.isArray(imagePathList) && imagePathList.length > 0) {
        imagePathList.forEach((path, imageIndex) => {
          const fileName = encodeToBase64(path.split(".")[0]);
          const extension = path.split(".").pop();
          const imagePath = `${fileName}.${extension}`;

          downloadRequests.push(coreDownloadFile("articles", `${basePath}/img/${imagePath}`));
          downloadMapping.push({ articleIndex, type: "image", imageIndex });
        });
      }

      // HTML 파일 다운로드 요청 추가
      if (htmlPathList) {
        downloadRequests.push(coreDownloadFile("articles", `${basePath}/${htmlPathList}`));
        downloadMapping.push({ articleIndex, type: "html" });
      }
    });

    // 모든 다운로드 요청을 병렬로 실행
    const downloadResults = await Promise.all(downloadRequests);

    // 결과 구성
    const articlesFiles = articlePathList.map(() => ({
      imageFileList: [] as Blob[],
      htmlFile: null as Blob | null,
    }));

    // 다운로드 결과 매핑
    downloadResults.forEach((result, index) => {
      const mapping = downloadMapping[index];
      const { articleIndex, type } = mapping;

      if (type === "image" && mapping.imageIndex !== undefined) {
        if (result.data) {
          articlesFiles[articleIndex].imageFileList[mapping.imageIndex] = result.data;
        }
      } else if (type === "html") {
        articlesFiles[articleIndex].htmlFile = result.data;
      }
    });

    return articlesFiles;
  } catch (error) {
    return { data: null, error: error };
  }
}

type ArticlePathObjectType = {
  imagePathList: string[] | [];
  htmlPath?: string | null;
};

////////// READ : 게시물 파일 다운로드
export async function readDownloadArticle(wpId: string, articlePath: string, articlePathObject: ArticlePathObjectType) {
  try {
    const { imagePathList, htmlPath } = articlePathObject;

    const basePath = `${wpId}/${articlePath}`;

    let imageFileList: (Blob | null)[] | [];
    let htmlFile: Blob | null = null;

    // 이미지 파일 다운로드
    if (!Array.isArray(imagePathList) || imagePathList.length === 0) {
      imageFileList = [];
    } else {
      const imageFileListPromise = await Promise.allSettled(
        // 이미지 파일 다운로드
        imagePathList.map(async (path) => {
          const { data, error } = await coreDownloadFile("articles", `${basePath}/img/${path}`);

          if (error) {
            return null;
          }

          return data;
        })
      );

      imageFileList = imageFileListPromise.map((el) => (el.status === "fulfilled" ? el.value : null));
    }

    // HTML 파일 다운로드
    if (!htmlPath) {
      htmlFile = null;
    } else {
      const { data, error } = await coreDownloadFile("articles", `${basePath}/${htmlPath}`);
      
      if (error) {
        return null;
      }

      htmlFile = data;
    }

    return { articlePath, imageFileList, htmlFile };
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
