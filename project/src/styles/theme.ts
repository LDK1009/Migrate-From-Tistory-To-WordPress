import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    gray: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  }

  interface PaletteOptions {
    gray?: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  }

  interface TypeText {
    white: string;
  }
}

// 서비스에 어울리는 색상 팔레트
export const muiTheme = createTheme({
  palette: {
    primary: {
      light: "#E3F2FD",
      main: "#2196F3",
      dark: "#1565C0",
    },
    secondary: {
      light: "#E0F7F1",
      main: "#26C6DA",
      dark: "#00838F",
    },
    error: {
      main: "#F44336",
    },
    warning: {
      main: "#FF9800",
    },
    info: {
      main: "#2196F3",
    },
    success: {
      main: "#4CAF50",
    },
    gray: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#9E9E9E",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
    background: {
      default: "#ECEFF1",  // 연한 민트 배경
      paper: "#FFFFFF",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
      disabled: "rgba(0, 0, 0, 0.38)",
      white: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "'Pretendard-Regular', 'Noto Sans KR', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            color: 'inherit',
          },
        },
        contained: {
          '&:hover': {
            color: 'white',
          },
        },
      },
    },
  },
});
