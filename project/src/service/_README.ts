/**
 * 이 파일은 서비스 레이어 구현을 위한 템플릿 예제입니다.
 *
 * 서비스 레이어는 데이터베이스 또는 외부 API와의 통신을 담당하는 함수들을 포함합니다.
 * 이 템플릿은 기본적인 CRUD(Create, Read, Update, Delete) 작업을 위한 함수들을 제공합니다.
 *
 * 사용 방법:
 * 1. 컴포넌트에서 필요한 서비스 함수를 import 합니다.
 * 2. 비동기 함수로 호출하여 데이터를 가져오거나 조작합니다.
 * 3. 컴포넌트에서 error 처리 및 snackbar 표시를 담당합니다.
 */

import { supabase } from "@/lib/supabaseClient";

////////////////////////////// GET //////////////////////////////
// GET | 테이블에서 모든 항목을 가져옵니다.
export async function getItems() {
  const response = await supabase.from("tableName").select("*");
  return response;
}

// GET | 테이블에서 특정 ID의 항목을 가져옵니다.
export async function getItemById(id: string) {
  const response = await supabase.from("tableName").select("*").eq("id", id).single();
  return response;
}

// GET | 특정 조건에 맞는 항목들을 가져옵니다.
export async function getItemsByFilter(value: string) {
  const response = await supabase.from("tableName").select("*").eq("columnName", value);
  return response;
}

// GET | 페이지네이션을 적용하여 항목들을 가져옵니다.
export async function getItemsPaginated(page: number = 1, pageSize: number = 10) {
  // 시작 인덱스 계산 (0부터 시작)
  const startIndex = (page - 1) * pageSize;
  const response = await supabase
    .from("tableName")
    .select("*")
    .range(startIndex, startIndex + pageSize - 1);
  return response;
}

// GET | 테이블의 항목 수를 가져옵니다.
export async function getItemCount() {
  const response = await supabase.from("tableName").select("*", { count: "exact", head: true });
  return response;
}

////////////////////////////// POST //////////////////////////////
// POST | 테이블에 새 항목을 생성합니다.
export async function createItem(item: string) {
  const response = await supabase.from("tableName").insert(item).select().single();
  return response;
}

////////////////////////////// PUT //////////////////////////////
// PUT | 테이블의 특정 항목을 업데이트합니다.
export async function updateItem(id: string, updates: string) {
  const response = await supabase.from("tableName").update(updates).eq("id", id).select().single();
  return response;
}

////////////////////////////// DELETE //////////////////////////////
// DELETE | 테이블에서 특정 항목을 삭제합니다.
export async function deleteItem(id: string) {
  const response = await supabase.from("tableName").delete().eq("id", id).select().single();
  return response;
}
