/**
 * [설명]
 * 이 파일은 axios를 사용하여 API 클라이언트를 초기화하고 내보내는 역할을 합니다.
 * axios는 브라우저와 Node.js에서 사용할 수 있는 Promise 기반 HTTP 클라이언트입니다.
 * API 클라이언트 모듈(다른 파일에서 api 모듈을 임포트하여 사용합니다.)
 * .env 파일의 NEXT_PUBLIC_API_BASE_URL 환경변수를 사용합니다.
 *
 * [사용 방법]
 * 다른 파일에서 다음과 같이 가져와 사용할 수 있습니다:
 * import api from 'path/to/apiClient';
 *
 * [예시 코드]
 * > GET 요청
 * const response = await api.get('/users');
 * > POST 요청
 * const response = await api.post('/users', { name: '홍길동', email: 'hong@example.com' });
 * > PUT 요청
 * const response = await api.put('/users/1', { name: '김철수' });
 * > DELETE 요청
 * const response = await api.delete('/users/1');
 *
 * [참고자료]
 * axios 공식 문서: https://axios-http.com/
 */

//////////////////////////////////////// 코드 시작 ////////////////////////////////////////

import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`, // 여기에 실제 API의 base URL을 입력하세요
});

export default api;
