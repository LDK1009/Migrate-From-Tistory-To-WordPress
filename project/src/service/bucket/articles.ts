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
          const originalName = imageFile.name.split(".")[0];
          const imageExtension = imageFile.name.split(".")[1];

          const uploadFileName = `${originalName}-${articleNumber}-${idx}.${imageExtension}`;

          const imagePath = `${folderName}/article-${articleNumber}/img/${uploadFileName}`;

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

////////// CORE : 파일 업로드
export async function uploadFile(bucketName: string, filePath: string, file: File) {
  const response = await supabase.storage.from(bucketName).upload(filePath, file, {
    upsert: true, // 같은 경로에 파일이 있으면 덮어쓰기
  });

  return response;
}

export async function emptyBucket(wpId: string) {
  const response = await supabase.storage.from("articles").remove([`${wpId}`]);

  return response;
}
