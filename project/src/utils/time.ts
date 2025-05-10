import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 추가

// dayjs 한국어 설정
dayjs.locale("ko");

// 날짜 포맷팅 함수
export const formatDate = (dateString: string) => {
  return dayjs(dateString).format("YYYY년 MM월 DD일");
};
