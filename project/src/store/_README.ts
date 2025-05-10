import { create } from "zustand";

/**
 * 이 파일은 Zustand 상태 관리 라이브러리를 사용한 템플릿 스토어 예제입니다.
 *
 * Zustand는 React 애플리케이션에서 전역 상태를 관리하기 위한 간단하고 가벼운 라이브러리입니다.
 * 이 템플릿은 기본적인 상태와 상태 변경 함수를 포함하고 있습니다.
 *
 * 사용 방법:
 * 1. 컴포넌트에서 useTemplateStore 훅을 import 합니다.
 * 2. 필요한 상태와 함수를 구조 분해 할당으로 가져옵니다.
 *
 * 예시:
 * ```
 * import { useTemplateStore } from 'path/to/this/file';
 *
 * function MyComponent() {
 *   const { state, setState, setState2 } = useTemplateStore();
 *
 *   return (
 *     <div>
 *       <p>현재 상태: {state}</p>
 *       <button onClick={() => setState('새로운 값')}>상태 변경</button>
 *       <button onClick={() => setState2('새로운 값')}>상태 변경2</button>
 *     </div>
 *   );
 * }
 * ```
 */

interface TemplateStortType {
  state: string;
  setState: (value: string) => void;
  setState2: (value: string) => void;
}

export const useTemplateStore = create<TemplateStortType>((set) => ({
  state: "",
  // option1: 이전 상태를 고려하지 않고 새 값으로 직접 설정합니다.
  setState: (value) =>
    set(() => ({
      state: value,
    })),
  // option2: 이전 상태(prev)에 접근할 수 있습니다.
  setState2: (value) =>
    set((prev) => ({
      state: prev + value,
    })),
}));
