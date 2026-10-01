export async function assertReadableFile(file) {
  if (!file || file.size <= 0) throw new Error("The selected file is empty. Please choose another file.");
  try {
    await file.slice(0, 1).arrayBuffer();
  } catch {
    throw new Error(`Cannot read "${file.name}". It may have moved or changed. Reselect it from your device and try again.`);
  }
}

export function episodeRequestError(error) {
  return error?.response?.data?.message || (error?.code === "ERR_NETWORK"
    ? "The request could not be sent. Check your connection and reselect any files that were moved or changed, then try again."
    : error?.message) || "Unable to save the episode. Please try again.";
}

export async function uploadEpisodeMedia({ file, api, put, onProgress, delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) }) {
  await assertReadableFile(file);
  const chunkSize = Math.max(10 * 1024 * 1024, Math.ceil(file.size / 100));
  const totalParts = Math.ceil(file.size / chunkSize);
  const { data: { uploadId, key } } = await api.post("/upload/init", { fileName: file.name, mimeType: file.type });
  if (!uploadId || !key) throw new Error("Storage did not start the upload. Please try again.");
  const progress = new Map();
  const updateProgress = () => onProgress(Math.min(99, Math.round([...progress.values()].reduce((sum, bytes) => sum + bytes, 0) / file.size * 100)));
  const uploadPart = async (index) => {
    const partNumber = index + 1;
    const chunk = file.slice(index * chunkSize, Math.min((index + 1) * chunkSize, file.size));
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const { data: { url } } = await api.post("/upload/part-url", { uploadId, key, partNumber });
        if (!url) throw new Error("Storage did not provide an upload URL.");
        const result = await put(url, chunk, { headers: { "Content-Type": "application/octet-stream" }, onUploadProgress: (event) => {
          progress.set(partNumber, Math.min(chunk.size, event.loaded)); updateProgress();
        } });
        const etag = result.headers.etag || result.headers.ETag;
        if (!etag) throw new Error("Storage must expose the ETag response header in its CORS configuration.");
        progress.set(partNumber, chunk.size); updateProgress();
        return { PartNumber: partNumber, ETag: etag.replace(/"/g, "") };
      } catch (error) {
        progress.set(partNumber, 0); updateProgress();
        if (attempt === 2) throw new Error(`Upload part ${partNumber} failed: ${episodeRequestError(error)}`);
        await delay(2000);
      }
    }
  };
  const parts = [];
  for (let offset = 0; offset < totalParts; offset += 5) {
    // Wait for the whole batch before reporting a failure; no requests remain
    // running when the form unlocks or the user starts another upload.
    const results = await Promise.allSettled(Array.from({ length: Math.min(5, totalParts - offset) }, (_, index) => uploadPart(offset + index)));
    const failure = results.find((result) => result.status === "rejected");
    if (failure) throw failure.reason;
    parts.push(...results.map((result) => result.value));
  }
  const { data } = await api.post("/upload/complete", { uploadId, key, parts });
  if (!data?.fileUrl) throw new Error("Storage did not confirm a saved file. Please retry the upload.");
  onProgress(100);
  return data.fileUrl;
}
