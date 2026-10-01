import assert from "node:assert/strict";
import { test } from "node:test";
import { uploadEpisodeMedia, assertReadableFile } from "../src/utils/episodeUpload.mjs";

function setup(options = {}) {
  const calls = [], progress = [];
  const file = new File([new Uint8Array(options.size || 10)], "test.mp3", { type: "audio/mpeg" });
  const api = { post: async (path, body) => {
    calls.push({ path, body });
    if (path.endsWith("/init")) return { data: { uploadId: "test", key: "files/test" } };
    if (path.endsWith("/part-url")) return { data: { url: `https://storage.test/${body.partNumber}` } };
    return { data: options.missingUrl ? {} : { fileUrl: "https://storage.test/test.mp3" } };
  } };
  const put = async (_url, chunk, config) => {
    if (options.failPut) throw new Error("Network disconnected");
    config.onUploadProgress({ loaded: chunk.size });
    return { headers: options.missingEtag ? {} : { etag: '"checksum"' } };
  };
  return { calls, progress, args: { file, api, put, onProgress: value => progress.push(value), delay: async () => {} } };
}

test("uploads ordered parts and reports completion only after storage confirms", async () => {
  const { args, calls, progress } = setup({ size: 11 * 1024 * 1024 });
  assert.equal(await uploadEpisodeMedia(args), "https://storage.test/test.mp3");
  assert.deepEqual(calls.at(-1).body.parts, [{ PartNumber: 1, ETag: "checksum" }, { PartNumber: 2, ETag: "checksum" }]);
  assert.equal(progress.at(-1), 100);
  assert.ok(progress.slice(0, -1).every(value => value < 100));
});

test("failed parts reject instead of returning a successful null URL", async () => {
  const { args, calls, progress } = setup({ failPut: true });
  await assert.rejects(uploadEpisodeMedia(args), /Network disconnected/);
  assert.equal(calls.filter(call => call.path.endsWith("/part-url")).length, 3);
  assert.ok(!calls.some(call => call.path.endsWith("/complete")));
  assert.ok(!progress.includes(100));
});

test("missing ETags give an actionable storage CORS error", async () => {
  const { args } = setup({ missingEtag: true });
  await assert.rejects(uploadEpisodeMedia(args), /ETag.*CORS/);
});

test("missing completion URL cannot appear as success", async () => {
  const { args, progress } = setup({ missingUrl: true });
  await assert.rejects(uploadEpisodeMedia(args), /did not confirm/);
  assert.ok(!progress.includes(100));
});

test("moved or changed local files are caught before submission", async () => {
  await assert.rejects(assertReadableFile({ name: "moved.png", size: 20, slice: () => ({ arrayBuffer: async () => { throw new Error("File not found"); } }) }), /Reselect/);
});
