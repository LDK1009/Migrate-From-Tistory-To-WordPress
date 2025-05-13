import { supabase } from "../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

////////// CREATE : 파일 업로드
export async function uploadFile(file: File, path?: string) {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;

    const filePath = path ? `${path}/${fileName}` : fileName;

    const { data, error } = await supabase.storage.from("articles").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from("articles").getPublicUrl(data.path);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.error("파일 업로드 중 오류 발생:", error);
    return { url: "", error: error as Error };
  }
}

////////// READ : 파일 목록 가져오기
export async function listFiles(path?: string) {
  try {
    const { data, error } = await supabase.storage.from("articles").list(path || "");

    if (error) throw error;

    return { files: data, error: null };
  } catch (error) {
    console.error("파일 목록 조회 중 오류 발생:", error);
    return { files: [], error: error as Error };
  }
}

////////// DELETE : 파일 삭제
export async function deleteFile(filePath: string) {
  try {
    const { error } = await supabase.storage.from("articles").remove([filePath]);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error("파일 삭제 중 오류 발생:", error);
    return { success: false, error: error as Error };
  }
}
