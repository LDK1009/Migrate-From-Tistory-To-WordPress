/**
 * Next.js API 라우터 예시 파일
 * 
 * 이 파일은 Next.js 애플리케이션에서 API 라우트를 구현하는 방법을 보여줍니다.
 * app 디렉토리 구조에서는 route.ts 파일을 사용하여 API 엔드포인트를 정의합니다.
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * GET 요청 처리 예시
 * 
 * URL 쿼리 파라미터를 통해 데이터를 받아 처리하는 방법을 보여줍니다.
 * 예: /api/example?url=https://example.com
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  try {
    // 실제 데이터 처리 로직이 여기에 들어갑니다
    console.log(`요청된 URL: ${url}`);
    return NextResponse.json({ data: "GET 요청 성공", url }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "GET 요청 처리 실패" }, { status: 500 });
  }
}

/**
 * POST 요청 처리 예시
 * 
 * 요청 본문(body)에서 데이터를 받아 처리하는 방법을 보여줍니다.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 실제 데이터 처리 로직이 여기에 들어갑니다
    console.log('받은 데이터:', body);
    
    return NextResponse.json({ 
      message: "POST 요청 성공", 
      receivedData: body 
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "POST 요청 처리 실패" }, { status: 500 });
  }
}

/**
 * PUT 요청 처리 예시
 * 
 * 리소스 업데이트를 위한 요청 처리 방법을 보여줍니다.
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 실제 업데이트 로직이 여기에 들어갑니다
    
    return NextResponse.json({ 
      message: "PUT 요청 성공", 
      updatedData: body 
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "PUT 요청 처리 실패" }, { status: 500 });
  }
}

/**
 * DELETE 요청 처리 예시
 * 
 * 리소스 삭제를 위한 요청 처리 방법을 보여줍니다.
 */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    // 실제 삭제 로직이 여기에 들어갑니다
    
    return NextResponse.json({ 
      message: "DELETE 요청 성공", 
      deletedId: id 
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "DELETE 요청 처리 실패" }, { status: 500 });
  }
}
