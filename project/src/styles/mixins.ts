import { css } from "@emotion/react";
import { Theme } from "@mui/material/styles";


const breakpoint = {
  // 모바일 (스마트폰)
  mobile: 768, // 0px 이상 ~ 767px 이하

  // 태블릿 (아이패드 등)
  tablet: 1024, // 768px 이상 ~ 1023px 이하

  // 노트북 (소형 데스크탑 포함)
  laptop: 1440, // 1024px 이상 ~ 1439px 이하

  // 데스크탑 (고해상도 포함)
  desktop: 1920, // 1440px 이상
};

// 믹스인 정의
// Q&A. 믹스인(Mixin)이란 재사용 가능한 스타일 조각을 정의하여 여러 컴포넌트에서 공유하는 방식을 의미합니다.
// 전체 검색(ctrl + shift + F)에 mixinFlex를 검색해 믹스인 활용 예시를 찾아보세요.

// 컨테이너 믹스인 - 헤더와 바텀 내비게이션을 고려한 컨텐츠 영역
export const mixinContainer = () => css`
  min-height: 100vh;
  width: 100%;
  margin: 0 auto;
  padding: 80px 16px;

  // ~ 모바일
  @media (min-width: 0px) and (max-width: ${breakpoint.mobile}px) {
    max-width: ${breakpoint.mobile * 0.8}px;
  }

  // 모바일 ~ 태블릿
  @media (min-width: ${breakpoint.mobile}px) and (max-width: ${breakpoint.tablet}px) {
    max-width: ${breakpoint.tablet * 0.8}px;
  }

  // 태블릿 ~ 노트북
  @media (min-width: ${breakpoint.tablet}px) and (max-width: ${breakpoint.laptop}px) {
    max-width: ${breakpoint.laptop * 0.8}px;
  }

  // 데스크톱 ~
  @media (min-width: ${breakpoint.desktop}px) {
    max-width: ${breakpoint.desktop * 0.8}px;
  }

  /* 모바일 화면에서는 헤더 높이가 56px로 줄어듦 */
  @media (max-width: ${breakpoint.mobile - 1}px) {
    padding: 70px 16px;
  }
`;

// Flex 믹스인
export const mixinFlex = (
  direction: "row" | "column" = "row",
  justifyContent: string = "center",
  alignItems: string = "center",
  gap?: string
) => css`
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  ${gap && `gap: ${gap}`};
`;

// 테두리 둥글게 믹스인 - 레벨에 따른 설정
export const mixinBorderRadius = (level: "small" | "medium" | "large" | "circle" = "medium") => {
  const radiusMap = {
    small: "4px",
    medium: "8px",
    large: "16px",
    circle: "50%",
  };

  return css`
    border-radius: ${radiusMap[level]};
  `;
};

// 텍스트 말줄임표 믹스인 (한 줄)
export const mixinEllipsis = (width: string = "100%") => css`
  max-width: ${width};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// 텍스트 말줄임표 믹스인 (여러 줄)
export const mixinMultilineEllipsis = (lines: number = 2) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// 그림자 효과 믹스인
export const mixinBoxShadow = (intensity: "light" | "medium" | "heavy" = "medium") => {
  const shadows = {
    light: "0 2px 5px rgba(0, 0, 0, 0.1)",
    medium: "0 4px 8px rgba(0, 0, 0, 0.15)",
    heavy: "0 8px 16px rgba(0, 0, 0, 0.2)",
  };

  return css`
    box-shadow: ${shadows[intensity]};
  `;
};

// 스크롤바 스타일링 믹스인
export const mixinScrollbar = (width: string, thumbColor: string, trackColor: string) => css`
  &::-webkit-scrollbar {
    width: ${width};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${thumbColor};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${trackColor};
  }
`;

// 스크롤바 숨기기 믹스인
export const mixinHideScrollbar = () => css`
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
    width: 0;
    background: transparent;
  }
`;

// 스위치 믹스인
export const mixinMuiSwitchSize = (width: number, height: number, theme: Theme) => css`
  && {
    width: ${width}px;
    height: ${height + height * 0.15}px;
    padding: 0px;

    .MuiSwitch-switchBase {
      padding: 0px;
      margin: ${height * 0.075}px;
      transform: translateX(0);

      &.Mui-checked {
        transform: translateX(${width / 2 - width * 0.1}px);

        & + .MuiSwitch-track {
          opacity: 1;
        }
      }
    }

    .MuiSwitch-thumb {
      width: ${width / 2}px;
      height: ${height}px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
      background-color: ${theme.palette.background.paper};
    }

    .MuiSwitch-track {
      border-radius: ${width / 3}px;
      opacity: 0.5;
    }
  }
`;

// 텍스트 입력 믹스인
export const mixinMuiTextInputBorder = (theme: Theme) => css`
  & .MuiInputBase-root {
    border: 1px solid ${theme.palette.primary.main};
  }

  & .MuiOutlinedInput-notchedOutline {
    border-color: ${theme.palette.primary.main};
  }
`;

// 버튼 그림자 숨기기
export const mixinMuiButtonNoShadow = () => css`
  box-shadow: none;

  &:hover {
    box-shadow: none;
  }
`;

// 원형 버튼 믹스인
export const mixinMuiCircleShapeButton = (size: number = 32) => css`
  border-radius: 50%;
  padding: 0;
  width: ${size}px;
  height: ${size}px;
  min-width: ${size}px;
  min-height: ${size}px;
`;
