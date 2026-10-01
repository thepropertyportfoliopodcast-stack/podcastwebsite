// Run against a local production build: npm run start -- -p 3100
// API and object-storage requests are intercepted; no live records are changed.
const assert = require("node:assert/strict");
const puppeteer = require("../../podcast-backend/node_modules/puppeteer");
const fs = require("node:fs");
(async () => {
  const executablePath = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(path => fs.existsSync(path));
  const browser = await puppeteer.launch({ headless: true, executablePath });
  try {
    const page = await browser.newPage();
    const errors = [], saves = [];
    let releaseUpload;
    page.on("pageerror", error => errors.push(error.message));
    await page.setRequestInterception(true);
    page.on("request", async request => {
      const url = new URL(request.url());
      const respond = (body, status = 200, headers = {}) => request.respond({ status, contentType: "application/json", headers: { "access-control-allow-origin": "*", "access-control-expose-headers": "ETag", ...headers }, body: JSON.stringify(body) });
      if (request.method() === "OPTIONS") return respond({}, 200, { "access-control-allow-methods": "GET,POST,PUT", "access-control-allow-headers": "content-type,authorization" });
      if (url.hostname === "mock-storage.test") {
        if (request.method() === "OPTIONS") return respond({}, 200, { "access-control-allow-methods": "PUT", "access-control-allow-headers": "content-type" });
        if (request.method() === "PUT") { await new Promise(resolve => { releaseUpload = resolve; }); return respond({}, 200, { ETag: '"part-checksum"' }); }
        return request.abort();
      }
      if (["xhr", "fetch"].includes(request.resourceType()) && !url.pathname.startsWith("/_next/")) {
        if (url.pathname.endsWith("/upload/init")) return respond({ uploadId: "test-upload", key: "files/test" });
        if (url.pathname.endsWith("/upload/part-url")) return respond({ url: "https://mock-storage.test/part" });
        if (url.pathname.endsWith("/upload/complete")) return respond({ fileUrl: "https://mock-storage.test/audio.mp3" });
        if (request.method() === "POST" && /\/admin\/file\/(add|update)/.test(url.pathname)) {
          saves.push(request.postData());
          // Keep the form open after verifying the multipart request.
          return respond({ status: false, message: "Test submission received" }, 400);
        }
        let data = [];
        if (url.pathname.endsWith("/user/profile")) data = { user: { uuid: "test", name: "Test admin", role: "SUPER_ADMIN" } };
        else if (url.pathname.includes("/admin/file/get/")) data = { uuid: "sample", title: "Draft episode", publicationStatus: "DRAFT", podcast: { uuid: "sample" }, heroPhones: [], reelLinks: [] };
        return respond({ data });
      }
      if (url.hostname !== "localhost" && url.protocol !== "data:") return request.abort();
      request.continue();
    });
    for (const route of ["/admin/episode/add?id=1", "/admin/episode/edit?id=sample"]) {
      await page.goto(`http://localhost:3100${route}`, { waitUntil: "networkidle0" });
      await page.waitForSelector('input[name="title"]');
      await page.type('input[name="title"]', " test draft");
      // An incomplete URL must be allowed in a private draft.
      await page.type('input[name="youtubeUrl"]', "unfinished-url");
      await page.evaluate(() => {
        const input = document.querySelector('input[name="audio"]');
        const transfer = new DataTransfer();
        transfer.items.add(new File([new Uint8Array(32)], "test.mp3", { type: "audio/mpeg" }));
        input.files = transfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      await page.waitForFunction(() => [...document.querySelectorAll('button[type="submit"]')].every(button => button.disabled));
      const deadline = Date.now() + 10000;
      while (!releaseUpload && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 50));
      assert.ok(releaseUpload, "The form should start uploading to object storage");
      releaseUpload(); releaseUpload = null;
      await page.waitForFunction(() => [...document.querySelectorAll('button[type="submit"]')].some(button => !button.disabled));
      assert.ok((await page.$eval("body", node => node.innerText)).includes("Audio uploaded"));
      const before = saves.length;
      await page.click('button[value="DRAFT"]');
      await page.waitForFunction(() => document.body.innerText.includes("Test submission received"));
      assert.equal(saves.length, before + 1);
      assert.match(saves.at(-1), /name="publicationStatus"\r?\n\r?\nDRAFT/);
      assert.match(saves.at(-1), /https:\/\/mock-storage.test\/audio.mp3/);
      assert.match(saves.at(-1), /name="sharedWebsiteArtwork"/);
      assert.ok(!saves.at(-1).includes('name="homepageThumbnail"'));
      console.log(`PASS ${route}: audio upload, busy-save protection, and incomplete draft submission`);
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
