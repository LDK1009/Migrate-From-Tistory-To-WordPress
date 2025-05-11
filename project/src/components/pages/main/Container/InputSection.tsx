import { useTistoryStore } from "@/store/page/main/tistoryStore";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import React, { useRef, useState } from "react";
import api from "@/lib/apiClient";
import { TistoryArticleType } from "@/types/tistory";
const InputSection = () => {
  //////////////////////////////////////// 상태 ////////////////////////////////////////

  // 티스토리 데이터
  const { tistoryData, setTistoryData } = useTistoryStore();
  // 워드프레스 URL 입력
  const [wordpressUrl, setWordpressUrl] = useState("");
  // 폴더 이름
  const [folderName, setFolderName] = useState<string>("");

  //////////////////////////////////////// 훅 ////////////////////////////////////////
  // 폴더 선택 입력 참조
  const fileInputRef = useRef<HTMLInputElement>(null);

  //////////////////////////////////////// 함수 ////////////////////////////////////////
  // 폴더 선택 이벤트 핸들러
  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      ///// 파일 포맷팅 및 상태 업데이트
      // 파일 포맷팅
      const formattedFiles = formatFiles(e.target.files);

      // 선택된 파일 목록 업데이트
      setTistoryData(formattedFiles);

      ///// 폴더 이름 상태 업데이트
      // 폴더 이름 추출 (첫 번째 파일의 경로에서)
      const firstFile = e.target.files[0];
      // 폴더 이름 추출 (첫 번째 파일의 경로에서)
      const folderPath = firstFile.webkitRelativePath.split("/");
      // 폴더 이름 업데이트
      setFolderName(folderPath[0]);
    }
  };

  // 파일 포맷팅
  function formatFiles(files: FileList) {
    console.log("포맷팅 전", files);
    const articles: TistoryArticleType[] = [];

    for (const file of files) {
      const pathParts = file.webkitRelativePath.split("/");
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

    console.log("포맷팅 후", articles);
    return articles;
  }

  // 티스토리 데이터 가져오기
  async function handleSubmit() {
    // FormData 객체 생성
    const formData = new FormData();

    // 각 게시글의 HTML 파일 추가
    tistoryData.forEach((article) => {
      if (article.htmlFile) {
        formData.append(`html_${article.articleNumber}`, article.htmlFile);
      }

      // 각 게시글의 이미지 파일 추가
      article.images?.forEach((img: File, imgIndex: number) => {
        formData.append(`image_${article.articleNumber}_${imgIndex}`, img);
      });
    });

    // FormData를 사용하여 API 요청
    const response = await api.post("/tistory/articles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      alert("티스토리 데이터 가져오기 성공");
    } else {
      alert("티스토리 데이터 가져오기 실패");
    }
  }

  //////////////////////////////////////// 렌더링 ////////////////////////////////////////
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        티스토리 마이그레이션
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          1. 티스토리 백업 폴더 선택
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Button variant="outlined" onClick={() => fileInputRef.current?.click()} sx={{ mr: 2 }}>
            폴더 선택
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFolderSelect}
            style={{ display: "none" }}
            {...{ webkitdirectory: "", directory: "" }}
          />
          <Typography>{tistoryData ? `${folderName} (${tistoryData.length}개 파일)` : "선택된 폴더 없음"}</Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          2. 워드프레스 URL 입력 (선택사항)
        </Typography>
        <TextField
          label="WordPress URL"
          fullWidth
          value={wordpressUrl}
          onChange={(e) => setWordpressUrl(e.target.value)}
          placeholder="https://your-wordpress-site.com"
          sx={{ mb: 2 }}
        />
      </Box>

      <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!tistoryData} fullWidth>
        티스토리 데이터 가져오기
      </Button>

      {tistoryData && tistoryData?.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            가져온 게시글: {tistoryData.length}개
          </Typography>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              maxHeight: "400px",
              overflow: "auto",
              bgcolor: "#f5f5f5",
            }}
          >
            <pre>{JSON.stringify(tistoryData, null, 2)}</pre>
          </Paper>
        </Box>
      )}
    </Paper>
  );
};

export default InputSection;
