import { supabase } from "../../supabaseServer";

////////// READ : 파일 목록 가져오기
export async function readArticlesPathList(path: string) {
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

        const imagePathList = imagePathListResponse?.map((item) => item.name);
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
    console.error("readArticlesPathList 오류:", error);
    return [];
  }
}
