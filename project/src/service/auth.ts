/**
 * [설명]
 * 이 파일은 사용자 인증 관련 기능을 제공하는 서비스 모듈입니다.
 * Supabase 인증 서비스를 활용하여 로그인, 로그아웃, 회원탈퇴 및 사용자 정보 조회 기능을 제공합니다.
 * 주로 카카오 OAuth를 통한 소셜 로그인을 지원합니다.
 * 
 * [사용 방법]
 * 다른 파일에서 다음과 같이 가져와 사용할 수 있습니다:
 * import { signIn, signOut, getCurrentUser, ... } from 'path/to/auth';
 * 
 * [예시 코드]
 * > 로그인
 * const response = await signIn();
 * > 로그아웃
 * await signOut();
 * > 현재 사용자 정보 가져오기
 * const { data, error } = await getCurrentUser();
 * 
 * [참고자료]
 * Supabase 인증 문서: https://supabase.com/docs/guides/auth
 */

//////////////////////////////////////// 코드 시작 ////////////////////////////////////////

import api from "@/lib/apiClient";
import { supabase } from "@/lib/supabaseClient";

////////// 로그인
export async function signIn() {
  const response = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/sign-in/success`,
    },
  });

  return response;
}

////////// 로그아웃
export async function signOut() {
  const response = await supabase.auth.signOut();

  return response;
}

////////// 회원탈퇴
export async function deleteUser(uid : string) {
  const response = await api.delete(`/users?uid=${uid}`);

  return response.data;
}

////////// 유저 로그인 여부 확인하기
export async function getCurrentUserIsSignIn() {
  const { error } = await supabase.auth.getUser();

  if (!error) {
    return true;
  } else {
    return false;
  }
}

////////// 현재 로그인한 유저정보 가져오기
export async function getCurrentUser() {
  const response = await supabase.auth.getUser();

  return response;
}

////////// 현재 로그인한 유저 uid 가져오기
export async function getCurrentUserUID() {
  const { data, error } = await supabase.auth.getUser();

  const response = {
    data: data.user?.id,
    error,
  };

  return response;
}

////////// 현재 로그인한 유저 이메일 가져오기
export async function getCurrentUserEmail() {
  const { data, error } = await supabase.auth.getUser();

  const response = {
    data: data.user?.email,
    error,
  };

  return response;
}
