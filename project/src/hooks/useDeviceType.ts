/**
 * [설명]
 * 이 파일은 현재 사용자의 디바이스 타입을 확인하는 커스텀 훅입니다.
 * 디바이스 타입은 PC(Desktop) | Tablet | Mobile 로 분류됩니다.
 * use-media 라이브러리를 사용하여 미디어 쿼리를 통해 디바이스 타입을 감지합니다.
 * 
 * [사용 방법]
 * 다른 파일에서 다음과 같이 가져와 사용할 수 있습니다:
 * import { useDeviceType } from 'path/to/useDeviceType';
 * 
 * [예시 코드]
 * const { isDesktop, isTablet, isMobile } = useDeviceType();
 * 
 * if (isDesktop) {
 *   // 데스크톱 환경에서만 실행할 코드
 * } else if (isTablet) {
 *   // 태블릿 환경에서만 실행할 코드
 * } else if (isMobile) {
 *   // 모바일 환경에서만 실행할 코드
 * }
 * 
 * [참고자료]
 * use-media 라이브러리: https://github.com/streamich/use-media
 */

//////////////////////////////////////// 코드 시작 ////////////////////////////////////////

import useMedia from "use-media";

export function useDeviceType() {
  // 미디어 쿼리
  const isDesktop = useMedia({ minWidth: "1024px" });
  const isTablet = useMedia({ minWidth: "768px", maxWidth: "1023px" });
  const isMobile = useMedia({ maxWidth: "767px" });

  return { isDesktop, isTablet, isMobile };
}
