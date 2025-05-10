/**
 * [설명]
 * 이 파일은 클라이언트 측에서 스낵바 알림을 제공하는 컴포넌트를 정의합니다.
 * notistack 라이브러리를 사용하여 애플리케이션 전체에 알림 기능을 제공합니다.
 * 
 * [사용 방법]
 * 다른 파일에서 다음과 같이 가져와 사용할 수 있습니다:
 * import ClientSnackbarProvider from 'path/to/ClientSnackbarProvider';
 * 
 * 일반적으로 애플리케이션의 루트 레이아웃이나 상위 컴포넌트에 배치합니다:
 * <ClientSnackbarProvider>
 *   <App />
 * </ClientSnackbarProvider>
 * 
 * [예시 코드]
 * > 스낵바 표시하기
 * import { useSnackbar } from 'notistack';
 * 
 * const { enqueueSnackbar } = useSnackbar();
 * enqueueSnackbar('성공적으로 저장되었습니다!', { variant: 'success' });
 * enqueueSnackbar('오류가 발생했습니다', { variant: 'error' });
 * 
 * [참고자료]
 * notistack 공식 문서: https://notistack.com/
 */

//////////////////////////////////////// 코드 시작 ////////////////////////////////////////

"use client";

import { SnackbarProvider } from "notistack";



const ClientSnackbarProvider = () => {
  return (
    <>
      <SnackbarProvider
        maxSnack={3} // 최대 누적 스택 - 화면에 동시에 표시될 수 있는 최대 알림 개수
        autoHideDuration={1000} // 지속시간 - 알림이 자동으로 사라지기까지의 시간(밀리초)
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // 스낵바 위치 지정 - 화면의 어느 위치에 알림을 표시할지 설정
        // preventDuplicate={true} // 중복 메시지 표시 여부 - 동일한 메시지가 여러 번 표시되는 것을 방지
        // hideIconVariant = {false} // 아이콘 숨김 여부 - 알림 유형 아이콘(성공, 오류 등)을 표시할지 여부
        // transitionDuration={{enter:300, exit:3000}} // 애니메이션 시간 변경 (ms) - 알림이 나타나고 사라지는 애니메이션 시간 설정
      />
    </>
  );
};

export default ClientSnackbarProvider;
