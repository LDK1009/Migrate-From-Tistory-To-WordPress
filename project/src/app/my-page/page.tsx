import MyPageContainer from "@/components/pages/my-page/MyPageContainer";
import { Metadata } from "next";
import { templateInfo } from "@/utils/templateInfo";

export const metadata: Metadata = {
  title: `${templateInfo.name} | 마이페이지`,
  description: "마이페이지에서 내가 만든 페이지를 확인해보세요!",
  openGraph: {
    title: `${templateInfo.name} | 마이페이지`,
    description: "마이페이지에서 내가 만든 페이지를 확인해보세요!",
    url: `${templateInfo.link}/my-page`,
    images: [{ url: "/img/og.png", width: 1200, height: 630, alt: "og-image" }],
    type: "website",
  },
};

const page = () => {
  return (
    <div>
      <MyPageContainer />
    </div>
  );
};

export default page;
