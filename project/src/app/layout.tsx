import ThemeProviderWrapper from "@/styles/ThemeProviderWrapper";
import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import ClientSnackbarProvider from "@/lib/ClientSnackbarProvider";
import GlobalStyles from "@/styles/GlobalStyles";
import { templateInfo } from "@/utils/templateInfo";
import Loading from "@/components/common/Loading";

// SEO 메타데이터
export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: `${templateInfo.name}`,
  description: "티스토리의 모든 게시물을 워드프레스로 마이그레이션하세요!",
  keywords: "티스토리, 워드프레스, 마이그레이션, 게시물, 마이그레이션, 티스토리 마이그레이션, 워드프레스 마이그레이션",
  openGraph: {
    title: `${templateInfo.name}`,
    description: "티스토리의 모든 게시물을 워드프레스로 마이그레이션하세요!",
    url: `${templateInfo.link}`,
    images: [{ url: "/img/og.png", width: 1200, height: 630, alt: "og-image" }],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/img/logo-192.png",
    apple: "/img/logo-512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {/* MUI 캐시 프로바이더 (Next15 - MUI 호환)  */}
        <AppRouterCacheProvider>
          {/* MUI 테마 프로바이더 */}
          <ThemeProviderWrapper>
            {/* 커스텀 전역 스타일 적용 */}
            <GlobalStyles />
            {/* 스낵바 */}
            <ClientSnackbarProvider />
            {/* 헤더 */}
            {/* <CommonHeader /> */}
            {/* 로딩 */}
            <Loading />
            {/* 페이지 컨텐츠 */}
            {children}
            {/* 바텀 내비게이션 */}
            {/* <CommonBottomNavigation /> */}
          </ThemeProviderWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
