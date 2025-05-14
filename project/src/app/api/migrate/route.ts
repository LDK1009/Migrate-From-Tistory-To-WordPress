import { NextRequest, NextResponse } from "next/server";
import { readArticlesPathList, readDownloadArticles } from "../(etc)/(service)/bucket/articles";
import { ArticleFileType, ArticlePathType } from "../(etc)/(types)/articleType";
import { createWordPressArticle } from "../(etc)/(utils)/migrate";

export async function POST(req: NextRequest) {
  try {
    // JSON 데이터 파싱
    const body = await req.json();
    const { wpId, wpApplicationPw, wpUrl } = body;
    const wpInfo = { wpId, wpApplicationPw, wpUrl };

    // 게시물 파일 경로 가져오기
    const articlesPathList: ArticlePathType[] = (await readArticlesPathList(wpId)) as ArticlePathType[];

    // 예외 처리 : 게시물 파일 경로 목록이 없거나 빈 배열이라면 예외 발생
    if (!Array.isArray(articlesPathList) || articlesPathList.length === 0) {
      throw new Error("게시물 불러오기 실패");
    }

    // 게시물 파일 가져오기
    const articleFileList = await readDownloadArticles(wpId, articlesPathList);

    // 예외 처리 : 게시물 파일 목록이 없거나 빈 배열이라면 예외 발생
    if (!Array.isArray(articleFileList) || articleFileList.length === 0) {
      throw new Error("게시물 다운로드 실패");
    }
    
    console.log("================================================");
    console.log(articleFileList);
    console.log(articlesPathList);
    console.log("================================================");
    return NextResponse.json(articleFileList, { status: 200 });

    // 게시물 파일 업로드
    await Promise.all(
      articleFileList.map(async (articleFile, idx) => {
        await createWordPressArticle({
          wpInfo: wpInfo,
          articlePath: articlesPathList[idx],
          articleFile: articleFile as ArticleFileType,
        });
      })
    );

    return NextResponse.json(true, { status: 200 });
  } catch (error) {
    console.error("POST(/migrate) : 게시물 파일 업로드 중 오류", error);
    return NextResponse.json(error, { status: 500 });
  }
}

//////////////////////////////////////// 코어 함수 ////////////////////////////////////////
