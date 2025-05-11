export type ArticleDataType = {
  title: string;
  content: string;
  status: string;
  categories?: string[];
  tags?: string[];
  date?: string;
};

export type TistoryArticleType = {
  articleNumber: number;
  images: File[] | null;
  htmlFile: File | null;
};
