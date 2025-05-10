/**
 * [설명]
 * 이 파일은 Supabase 클라이언트를 초기화하고 내보내는 역할을 합니다.
 * Supabase는 Firebase와 유사한 백엔드 서비스로, 데이터베이스, 인증, 스토리지 등의 기능을 제공합니다.
 * Supabase 클라이언트 모듈(다른 파일에서 supabase 모듈을 임포트하여 사용합니다.)
 * .env 파일의 NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_ANON_KEY 환경변수를 사용합니다.
 * 
 * [사용 방법]
 * 다른 파일에서 다음과 같이 가져와 사용할 수 있습니다:
 * import { supabase } from 'path/to/supabaseClient';
 * 
 * [예시 코드]
 * > 데이터 조회
 * const { data, error } = await supabase.from('테이블명').select('*');
 * > 인증
 * const { data, error } = await supabase.auth.signInWithPassword({ email, password });
 * > 스토리지
 * const { data, error } = await supabase.storage.from('버킷명').upload('경로', 파일);
 * 
 * [참고자료]
 * .env 파일이 작성되지 않았다면 아래 링크를 참고해주세요.
 * https://sooncoding.tistory.com/265
 */

//////////////////////////////////////// 코드 시작 ////////////////////////////////////////

import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 Supabase 프로젝트 URL과 익명 키를 가져옵니다.
// 느낌표(!)는 TypeScript에게 이 값이 반드시 존재함을 알려주는 non-null assertion 연산자입니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabase 클라이언트 인스턴스를 생성하고 내보냅니다.
// 이 인스턴스를 통해 Supabase의 모든 기능(데이터베이스, 인증, 스토리지 등)에 접근할 수 있습니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
