// 청크 단위로 나누어 처리하는 예시
type ChunkingType = {
  data: unknown[];
  chunkSize: number;
  process: (item: unknown) => Promise<unknown>;
};

export async function chunking({ data, chunkSize = 10, process }: ChunkingType) {
  const results = [];

  for (let i = 0; i < data.length; i += chunkSize) {
    console.log(`${i}~${i + chunkSize} 청크 처리 중...`);

    const chunk = data.slice(i, i + chunkSize);
    console.log("처리할 아이템 : ", chunk);

    const chunkResults = await Promise.all(chunk.map(async (item) => await process(item)));
    results.push(...chunkResults);

    console.log(`${i}~${i + chunkSize} 청크 처리 완료`);
    console.log(`결과 : ${results}`);
  }

  console.log(`최종 결과 : ${results}`);
  return results;
}
