////////// UTILITY : 한글 문자열을 Base64로 인코딩
export function encodeToBase64(str: string): string {
    // 한글 등 멀티바이트 문자를 처리하기 위해 encodeURIComponent 사용 후 btoa 적용
    return btoa(encodeURIComponent(str));
  }
  
  ////////// UTILITY : Base64에서 한글 문자열로 디코딩
  export function decodeFromBase64(base64Str: string): string {
    // Base64 디코딩 후 URI 디코딩
    return decodeURIComponent(atob(base64Str));
  }