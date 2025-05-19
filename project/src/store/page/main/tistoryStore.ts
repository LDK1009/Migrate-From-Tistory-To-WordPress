import { TistoryArticleType } from "@/types/tistory";
import { create } from "zustand";

//////////////////////////////////////// 스토어 타입 ////////////////////////////////////////
interface TistoryStore {
  tistoryArticles: TistoryArticleType[];
  selectedArticleIndexList: number[];

  setTistoryArticles: (files: FileList) => void;
  setSelectedArticleIndexList: (indexList: number[]) => void;
}

//////////////////////////////////////// 스토어 ////////////////////////////////////////
export const useTistoryStore = create<TistoryStore>((set) => ({
  tistoryArticles: [],
  selectedArticleIndexList: [],

  // 액션
  // 티스토리 데이터 가져오기
  setTistoryArticles: (files: FileList) => {
    set({ tistoryArticles: formatFiles(files) });
  },

  // 선택된 아티클 설정
  setSelectedArticleIndexList: (indexList: number[]) => set({ selectedArticleIndexList: indexList }),
}));

//////////////////////////////////////// 모듈 ////////////////////////////////////////
// 파일 포맷팅
function formatFiles(files: FileList) {
  const articles: TistoryArticleType[] = [];

  for (const file of files) {
    // HTML, 이미지 파일만 포함
    if (!(file.type.includes("image") || file.type.includes("html"))) {
      continue;
    }

    // 파일 경로 분리
    const pathParts = file.webkitRelativePath.split("/");
    // 게시글 번호 추출
    const articleNumber = Number(pathParts[1]);

    // 아티클 번호에 해당하는 게시글 찾기
    let article = articles.find((el) => el.articleNumber === articleNumber);

    // 게시글 객체가 없다면 생성
    if (!article) {
      article = {
        articleNumber: articleNumber,
        images: [],
        htmlFile: null,
      };
      articles.push(article);
    }

    // 아티클에 html 파일 추가
    if (file.type.includes("html")) {
      article.htmlFile = file;
    }

    // 아티클에 이미지 파일 추가
    if (file.type.includes("image")) {
      article.images?.push(file);
    }
  }

  // 게시글 번호 기준으로 오름차순 정렬
  articles.sort((a, b) => a.articleNumber - b.articleNumber);

  return articles;
}
