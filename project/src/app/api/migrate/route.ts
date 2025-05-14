import { NextRequest, NextResponse } from "next/server";
import { readArticlesPathList, readDownloadArticles } from "../(etc)/(service)/bucket/articles";
import { ArticleFileType, ArticlePathType } from "../(etc)/(types)/ArticleType";
import { createWordPressArticle } from "../(etc)/(utils)/migrate";

export async function POST(req: NextRequest) {
  try {
    // JSON 데이터 파싱
    const body = await req.json();
    const { wpId, wpApplicationPw, wpUrl } = body;
    const wpInfo = { wpId, wpApplicationPw, wpUrl };

    // 게시물 파일 경로 가져오기
    const articlesPathList: ArticlePathType[] = (await readArticlesPathList(wpId)) as ArticlePathType[];

    // 게시물 파일 가져오기
    const articleFileList = await readDownloadArticles(wpId, articlesPathList);

    // 배열 확인 + 배열 길이 확인
    if (!Array.isArray(articleFileList) || articleFileList.length === 0) {
      throw new Error("게시물 파일이 없습니다.");
    }

    // 게시물 파일 업로드
    await createWordPressArticle({
      wpInfo: wpInfo,
      articlePath: articlesPathList[0],
      articleFile: articleFileList[0] as ArticleFileType,
    });

    return NextResponse.json(true, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

//////////////////////////////////////// 코어 함수 ////////////////////////////////////////
