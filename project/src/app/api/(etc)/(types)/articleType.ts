// 게시물 파일 경로 타입
export type ArticlePathType = {
  articlePath: string;
  imagePathList: string[];
  htmlPathList: string;
};

// 게시물 파일 타입
export type ArticleFileType = {
  imageFileList: Blob[];
  htmlFile: Blob;
};

// 워드프레스 게시물 타입
export type WordPressArticleType = {
  title : string;
  content : string;
  date : string;
  status : "publish";
}
