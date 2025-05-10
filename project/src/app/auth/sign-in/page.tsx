import SignInContainer from "@/components/pages/sign-in/SignInContainer";
import { templateInfo } from "@/utils/templateInfo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${templateInfo.name} | 로그인`,
  description: "로그인하고 소중한 사람을 위한 페이지를 제작해보세요!",
  openGraph: {
    title: `${templateInfo.name} | 로그인`,
    description: "로그인하고 소중한 사람을 위한 페이지를 제작해보세요!",
    url: `${templateInfo.link}/auth/sign-in`,
    images: [{ url: "/img/og.png", width: 1200, height: 630, alt: "og-image" }],
    type: "website",
  },
};

const page = () => {
  return (
    <div>
      <SignInContainer />
    </div>
  );
};

export default page;
