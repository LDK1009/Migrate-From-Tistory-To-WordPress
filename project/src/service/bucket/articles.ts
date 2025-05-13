import { TistoryArticleType } from "@/types/tistory";
import { supabase } from "../../lib/supabaseClient";

////////// CREATE : 게시물 업로드
export async function createArticle(articleNumber: number, article: TistoryArticleType, folderName: string) {
  try {
    const { images, htmlFile } = article;

    // 이미지 업로드
    if (images && images.length > 0) {
      await Promise.all(
        images.map(async (imageFile, idx) => {
          const imageExtension = imageFile.name.split(".").pop();
          const imageName = `${articleNumber}-${idx}.${imageExtension}`;
          const imagePath = `${folderName}/article-${articleNumber}/img/${imageName}`;

          await uploadFile("articles", imagePath, imageFile);
        })
      );
    }

    if (htmlFile) {
      const htmlExtension = htmlFile.name.split(".").pop();
      const htmlName = `${articleNumber}.${htmlExtension}`;
      const htmlPath = `${folderName}/article-${articleNumber}/${htmlName}`;

      await uploadFile("articles", htmlPath, htmlFile);
    }

    return { data: null, error: null };
  } catch (error) {
    console.error("createArticle()", error);
    return { data: null, error: error };
  }
}

////////// CREATE : 게시물 리스트 업로드
export async function createArticleList(wpId: string, articleList: TistoryArticleType[]) {
  try {
    await Promise.all(
      articleList.map(async (article, idx) => {
        await createArticle(idx, article, wpId);
      })
    );

    return { data: null, error: null };
  } catch (error) {
    console.error("createArticleList()", error);
    return { data: null, error: error };
  }
}

////////// READ : 파일 목록 가져오기
export async function readArticles(path: string = "11/img") {
  try {
    // 경로를 매개변수로 받아 유연하게 사용
    const { data, error } = await supabase.storage.from("articles").list(path);

    if (error) throw error;

    // 디버깅을 위한 로그 추가
    console.log(`'${path}' 경로에서 가져온 파일 목록:`, data);

    return { files: data, error: null };
  } catch (error) {
    console.error(`'${path}' 경로에서 파일 목록 조회 중 오류 발생:`, error);
    return { files: [], error: error as Error };
  }
}

////////// DELETE : 파일 삭제
export async function deleteArticle(filePath: string) {
  try {
    const { error } = await supabase.storage.from("articles").remove([filePath]);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error("파일 삭제 중 오류 발생:", error);
    return { success: false, error: error as Error };
  }
}

////////// READ : 파일 다운로드
export async function downloadArticle(filePath: string) {
  try {
    const { data, error } = await supabase.storage.from("articles").download(filePath);

    if (error) throw error;

    // data는 Blob 형태로 반환됩니다
    return { file: data, error: null };
  } catch (error) {
    console.error("파일 다운로드 중 오류 발생:", error);
    return { file: null, error: error as Error };
  }
}

////////// READ : 여러 파일 다운로드
export async function downloadAllArticles(path: string = "") {
  try {
    // 먼저 해당 경로의 파일 목록을 가져옵니다
    const { files, error: listError } = await readArticles(path);

    if (listError) throw listError;

    const downloadedFiles: { path: string; file: Blob }[] = [];

    // 각 파일을 다운로드합니다
    for (const item of files) {
      // 폴더는 건너뜁니다 (폴더 여부 확인 로직은 환경에 맞게 조정 필요)
      if (item.metadata && item.metadata.mimetype === null) continue;

      const filePath = path ? `${path}/${item.name}` : item.name;
      const { file, error } = await downloadArticle(filePath);

      if (error) {
        console.error(`'${filePath}' 파일 다운로드 중 오류:`, error);
        continue;
      }

      if (file) {
        downloadedFiles.push({ path: filePath, file });
      }
    }

    return { files: downloadedFiles, error: null };
  } catch (error) {
    console.error("파일 다운로드 중 오류 발생:", error);
    return { files: [], error: error as Error };
  }
}

////////// READ : 버킷의 모든 파일 다운로드 (재귀적)
export async function downloadAllArticlesRecursively() {
  try {
    const downloadedFiles: { path: string; file: Blob }[] = [];

    // 재귀적으로 폴더 탐색하며 파일 다운로드하는 함수
    async function downloadFilesRecursively(path: string = "") {
      const { files, error } = await readArticles(path);

      if (error) throw error;

      for (const item of files) {
        const filePath = path ? `${path}/${item.name}` : item.name;

        // 폴더인 경우 재귀 호출
        if (item.metadata && item.metadata.mimetype === null) {
          await downloadFilesRecursively(filePath);
        } else {
          // 파일인 경우 다운로드
          const { file, error: downloadError } = await downloadArticle(filePath);

          if (downloadError) {
            console.error(`'${filePath}' 파일 다운로드 중 오류:`, downloadError);
            continue;
          }

          if (file) {
            downloadedFiles.push({ path: filePath, file });
          }
        }
      }
    }

    // 루트 경로부터 시작
    await downloadFilesRecursively();

    return { files: downloadedFiles, error: null };
  } catch (error) {
    console.error("모든 파일 다운로드 중 오류 발생:", error);
    return { files: [], error: error as Error };
  }
}

////////// CORE : 파일 업로드
export async function uploadFile(bucketName: string, filePath: string, file: File) {
  const response = await supabase.storage.from(bucketName).upload(filePath, file, {
    upsert: true, // 같은 경로에 파일이 있으면 덮어쓰기
  });

  return response;
}
