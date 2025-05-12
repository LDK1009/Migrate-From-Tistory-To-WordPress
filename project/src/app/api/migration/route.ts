import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  // export default async function GET(req: NextRequest) {
  // const { searchParams } = new URL(req.url);
  // const wpUrl = searchParams.get("wpUrl");

  try {
    // 프록시 API를 통해 요청
    const apiUrl = `https://roross.store/wp-json/wp/v2/posts`;

    const response = await axios.get(apiUrl);

    return NextResponse.json({ data: response.data, error: null }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: null, error: error }, { status: 500 });
  }
}
