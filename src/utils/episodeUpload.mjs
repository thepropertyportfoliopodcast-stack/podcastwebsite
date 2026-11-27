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

export async function uploadEpisodeMedia({ file, kind, api, put, onProgress, signal, delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) }) {
  await assertReadableFile(file);
  if (!["video", "audio"].includes(kind) || !file.type.startsWith(`${kind}/`)) {
    throw new Error(`Choose a valid ${kind === "audio" ? "audio" : "video"} file for this upload field.`);
  }
  if (signal?.aborted) throw new DOMException("Upload cancelled", "AbortError");
  const chunkSize = Math.max(10 * 1024 * 1024, Math.ceil(file.size / 100));
  const totalParts = Math.ceil(file.size / chunkSize);
  const { data: { uploadId, key } } = await api.post("/upload/init", { fileName: file.name, mimeType: file.type, mediaKind: kind }, { signal });
  if (!uploadId || !key) throw new Error("Storage did not start the upload. Please try again.");
  const progress = new Map();
  let highestProgress = 0;
  const updateProgress = () => {
    highestProgress = Math.max(highestProgress, Math.min(99, Math.round([...progress.values()].reduce((sum, bytes) => sum + bytes, 0) / file.size * 100)));
    onProgress(highestProgress);
  };
  const uploadPart = async (index) => {
    const partNumber = index + 1;
    const chunk = file.slice(index * chunkSize, Math.min((index + 1) * chunkSize, file.size));
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        if (signal?.aborted) throw new DOMException("Upload cancelled", "AbortError");
        const { data: { url } } = await api.post("/upload/part-url", { uploadId, key, partNumber }, { signal });
        if (!url) throw new Error("Storage did not provide an upload URL.");
        const result = await put(url, chunk, { signal, headers: { "Content-Type": "application/octet-stream" }, onUploadProgress: (event) => {
          progress.set(partNumber, Math.max(progress.get(partNumber) || 0, Math.min(chunk.size, event.loaded))); updateProgress();
        } });
        const etag = result.headers.etag || result.headers.ETag;
        if (!etag) throw new Error("Storage must expose the ETag response header in its CORS configuration.");
        progress.set(partNumber, chunk.size); updateProgress();
        return { PartNumber: partNumber, ETag: etag.replace(/"/g, "") };
      } catch (error) {
        if (signal?.aborted || error?.name === "AbortError" || error?.code === "ERR_CANCELED") throw new DOMException("Upload cancelled", "AbortError");
        if (attempt === 2) throw new Error(`Upload part ${partNumber} failed: ${episodeRequestError(error)}`);
        await Promise.race([delay(1000), new Promise((_, reject) => signal?.addEventListener("abort", () => reject(new DOMException("Upload cancelled", "AbortError")), { once: true }))]);
      }
    }
  };
  const parts = [];
  try {
  for (let offset = 0; offset < totalParts; offset += 5) {
    // Wait for the whole batch before reporting a failure; no requests remain
    // running when the form unlocks or the user starts another upload.
    const results = await Promise.allSettled(Array.from({ length: Math.min(5, totalParts - offset) }, (_, index) => uploadPart(offset + index)));
    const failure = results.find((result) => result.status === "rejected");
    if (failure) throw failure.reason;
    parts.push(...results.map((result) => result.value));
  }
    const { data } = await api.post("/upload/complete", { uploadId, key, parts }, { signal });
  if (!data?.fileUrl) throw new Error("Storage did not confirm a saved file. Please retry the upload.");
  onProgress(100);
  return data.fileUrl;
  } catch (error) {
    await api.post("/upload/cancel", { uploadId, key }).catch(() => {});
    if (signal?.aborted || error?.name === "AbortError" || error?.code === "ERR_CANCELED") {
      throw new DOMException("Upload cancelled", "AbortError");
    }
    throw error;
  }
}
