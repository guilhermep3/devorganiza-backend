export const getContentSize = (content: any) => {
  const string = JSON.stringify(content);
  return Buffer.byteLength(string, "utf-8");
}

export const MAX_NOTE_SIZE = 100_000; // 100kb