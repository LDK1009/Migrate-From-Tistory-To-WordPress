import { NextRequest, NextResponse } from "next/server";
import { readArticlePathObject, readDownloadArticle } from "../(etc)/(service)/bucket/articles";
import { ArticleFileType } from "../(etc)/(types)/articleType";
import { createWordPressArticle } from "../(etc)/(utils)/migrate";

export async function POST(req: NextRequest) {
  try {
    console.log("========== START : [POST] api/migrate ==========");
    // JSON 데이터 파싱
    const body = await req.json();
    const { wpId, wpApplicationPw, wpUrl } = body;
    const { articlePath } = body;
    const wpInfo = { wpId, wpApplicationPw, wpUrl };

    // 게시물 파일 경로 가져오기
    const { data: articlePathObject, error: readArticlePathObjectError } = await readArticlePathObject(
      wpId,
      articlePath
    );

    if (readArticlePathObjectError || !articlePathObject) {
      throw new Error("게시물 파일 경로 가져오기 실패");
    }

    // 게시물 파일 가져오기
    const articleFileObject = await readDownloadArticle(wpId, articlePath, articlePathObject);

    // 게시물 파일 업로드
    const { error: createWordPressArticleError } = await createWordPressArticle({
      wpInfo: wpInfo,
      articlePath: {
        articlePath: articlePath,
        imagePathList: articlePathObject.imagePathList,
        htmlPath: articlePathObject.htmlPath as string,
      },
      articleFile: articleFileObject as ArticleFileType,
    });

    if (createWordPressArticleError) {
      throw new Error("게시물 파일 업로드 실패");
    }

    console.log("========== END : [POST] api/migrate ==========");
    return NextResponse.json(true, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

//////////////////////////////////////// 코어 함수 ////////////////////////////////////////
