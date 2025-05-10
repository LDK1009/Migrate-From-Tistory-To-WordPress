"use client";
import { Global, css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";

const GlobalStyles = () => {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        /* 폰트 설정 */
        @font-face {
          font-family: "Pretendard-Regular";
          src: url("https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff")
            format("woff");
          font-style: normal;
          font-display: swap;
        }

        /* 리셋 스타일 */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body {
          height: 100%;

          font-family: ${theme.typography.fontFamily};
          color: ${theme.palette.text.primary};
          line-height: 1.5;
          background-color: ${theme.palette.background.default};

          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* 스크롤바 스타일링 */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${theme.palette.background.paper};
        }

        ::-webkit-scrollbar-thumb {
          background: ${theme.palette.divider};
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${theme.palette.text.disabled};
        }

        /* 링크 스타일 */
        a {
          color: ${theme.palette.primary.main};
          text-decoration: none;
          transition: color 0.2s ease;
        }

        a:hover {
          color: ${theme.palette.primary.dark};
        }

        /* 텍스트 선택 스타일 */
        ::selection {
          background-color: ${theme.palette.primary.light};
          color: ${theme.palette.primary.contrastText};
        }
      `}
    />
  );
};

export default GlobalStyles;
