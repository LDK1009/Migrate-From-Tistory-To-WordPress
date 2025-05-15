import api from "@/lib/apiClient";

type CreateWordpressArticleType = {
  wpInfo: {
    wpId: string;
    wpApplicationPw: string;
    wpUrl: string;
  };
  articlePath: string;
};

////////// CREATE : 워드프레스 게시물 생성
export async function createWordpressArticle({ wpInfo, articlePath }: CreateWordpressArticleType) {
  const { wpId, wpApplicationPw, wpUrl } = wpInfo;

  const response = await api.post("/migrate", { wpId, wpApplicationPw, wpUrl, articlePath });

  return response;
}

type CreateWordpressArticleListType = {
  wpInfo: {
    wpId: string;
    wpApplicationPw: string;
    wpUrl: string;
  };
  articlePathList: string[];
};

////////// CREATE : 워드프레스 게시물 리스트 생성
export async function createWordpressArticleList({ wpInfo, articlePathList }: CreateWordpressArticleListType) {
  try {
    const response = await Promise.allSettled(
      articlePathList.map((articlePath) => {
        return createWordpressArticle({ wpInfo, articlePath });
      })
    );

    const result = response.map((el) => {
      if (el.status === "fulfilled") {
        return el.value;
      }
    });

    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}
