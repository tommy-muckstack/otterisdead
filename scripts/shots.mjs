// Drives the production build with the demo account: smoke-tests recording, transcript, actions, search, import, export, audio AND captures product shots.
import fs from "node:fs"; import assert from "node:assert/strict";
import { withApp, demoPage, out } from "./shotlib.mjs";
const dir = out("otterisdead"); const pub = new URL("../public/home/", import.meta.url).pathname; fs.mkdirSync(pub, { recursive: true });
const save = async (page, name, home = true) => { await page.screenshot({ path: `${dir}/${name}.png` }); if (home) fs.copyFileSync(`${dir}/${name}.png`, `${pub}${name}.png`); };
const wav = (secs = 2) => { const sr = 8000, n = sr * secs, b = Buffer.alloc(44 + n * 2); b.write("RIFF", 0); b.writeUInt32LE(36 + n * 2, 4); b.write("WAVEfmt ", 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(sr, 24); b.writeUInt32LE(sr * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write("data", 36); b.writeUInt32LE(n * 2, 40); for (let i = 0; i < n; i++) b.writeInt16LE(Math.round(Math.sin(i / 8) * 8000), 44 + i * 2); return b; };
await withApp("otterisdead", async ({ base, browser }) => {
  const { ctx, page } = await demoPage(browser, base, { w: 1440, h: 900 });
  const cards = page.getByTestId("meeting-card"); await cards.first().waitFor(); assert.equal(await cards.count(), 3);
  // global search
  await page.getByLabel("Search all conversations").fill("calendar"); await page.getByTestId("results").waitFor(); const nHits = await page.getByTestId("results").locator("li").count(); assert.ok(nHits >= 4, `hits ${nHits}`); await save(page, "search");
  await page.getByLabel("Search all conversations").fill("");
  // open meeting
  await cards.filter({ hasText: "Weekly product sync" }).click(); const segs = page.getByTestId("segment"); await segs.first().waitFor(); assert.equal(await segs.count(), 12);
  // rename speaker everywhere
  await page.getByRole("button", { name: "Priya", exact: true }).click(); await page.getByLabel("Rename Priya").fill("Priya Shah"); await page.keyboard.press("Enter"); await page.locator(".ott-spkrs .ott-chip", { hasText: "Priya Shah" }).waitFor();
  assert.ok((await segs.nth(3).innerText()).includes("Priya Shah"));
  // highlight, edit, search in transcript
  await segs.nth(5).hover(); await segs.nth(5).getByRole("button", { name: "Highlight" }).click(); assert.ok(await segs.nth(5).evaluate(e => e.classList.contains("is-hl")));
  await segs.nth(1).hover(); await segs.nth(1).getByRole("button", { name: "Edit text" }).click(); await page.getByLabel("Edit transcript text").fill("I finished pricing and calendar sync; only time zones remain."); await page.keyboard.press("Enter"); await page.waitForTimeout(100); assert.match(await segs.nth(1).innerText(), /only time zones remain/);
  await page.getByLabel("Search in transcript").fill("load test"); assert.equal((await page.getByTestId("matches").innerText()).trim(), "3 lines"); assert.ok(await page.locator("mark").count() >= 3);
  await page.getByLabel("Search in transcript").fill(""); await segs.first().click(); await save(page, "meeting");
  // summary content
  const panel = page.getByRole("tabpanel"); assert.ok((await panel.locator("li").count()) >= 3);
  // action items
  await page.getByRole("tab", { name: /Action items/ }).click(); const acts = page.getByTestId("actions").locator("li"); const nActs = await acts.count(); assert.ok(nActs >= 5, `actions ${nActs}`);
  assert.match(await page.getByTestId("actions").innerText(), /Priya Shah/); await save(page, "actions");
  await acts.first().getByRole("checkbox").check(); await page.getByRole("tab", { name: new RegExp(`Action items 1/${nActs}`) }).waitFor();
  await page.getByLabel("New action item").fill("Book the launch party"); await page.getByLabel("New action item").press("Enter"); assert.equal(await acts.count(), nActs + 1);
  // ask
  await page.getByRole("tab", { name: "Ask" }).click(); await page.getByLabel("Ask about this conversation").fill("who runs the load test?"); await page.keyboard.press("Enter"); await page.getByTestId("answers").waitFor(); assert.match(await page.getByTestId("answers").innerText(), /load test/i);
  // notes
  await page.getByRole("tab", { name: "Notes" }).click(); await page.getByLabel("Notes").fill("Decision: launch Wednesday."); 
  // exports
  const dlOf = async (item) => { const p = page.waitForEvent("download"); await page.getByRole("button", { name: /Export/ }).click(); await page.getByRole("menuitem", { name: item }).click(); const f = await p; const path = `${dir}/${f.suggestedFilename()}`; await f.saveAs(path); return fs.readFileSync(path, "utf8"); };
  const md = await dlOf(/^Markdown/); assert.match(md, /^# Weekly product sync/); assert.match(md, /Decision: launch Wednesday\./); assert.match(md, /- \[x\] /); assert.match(md, /\*\*Priya Shah\*\*/);
  const srt = await dlOf(/^Subtitles/); assert.match(srt, /^1\n00:00:00,000 --> /);
  // audio attach + persistence across reload
  await page.setInputFiles('[data-testid="audio-file"]', { name: "call.wav", mimeType: "audio/wav", buffer: wav() }); await page.locator("audio").waitFor();
  await page.reload(); await page.locator(".ott-nav__r", { hasText: "Weekly product sync" }).click(); await page.locator("audio").waitFor(); assert.match(await page.getByRole("tab", { name: /Action items/ }).innerText(), /1\/\d+/);
  // typed-lines recording
  await page.getByTestId("new-recording").click(); await page.getByTestId("recorder").waitFor();
  await page.getByLabel("Meeting title").fill("Quick standup"); await page.getByLabel("Type a line").fill("i'll email Dana the proposal tomorrow"); await page.getByLabel("Type a line").press("Enter"); await page.keyboard.press("Escape"); await page.getByRole("button", { name: /Speaker 2/ }).click();
  await page.getByLabel("Type a line").fill("sounds good, please share the draft first"); await page.getByLabel("Type a line").press("Enter"); assert.equal(await page.getByTestId("live").locator(".ott-seg").count(), 2);
  await page.getByTestId("stop").click(); await page.getByTestId("segment").first().waitFor(); assert.equal(await page.getByLabel("Title").inputValue(), "Quick standup"); assert.equal(await page.getByTestId("segment").count(), 2);
  await page.getByRole("tab", { name: /Action items/ }).click(); assert.match(await page.getByTestId("actions").innerText(), /Dana/); assert.match(await page.getByTestId("actions").innerText(), /Tomorrow/);
  // demo recording
  await page.getByRole("button", { name: /Conversations/ }).first().click(); await page.getByTestId("new-recording").click(); await page.getByTestId("demo").click();
  await page.waitForFunction(() => document.querySelectorAll('[data-testid="live"] .ott-seg:not(.ott-seg--interim)').length >= 4, null, { timeout: 15000 }); await page.waitForTimeout(250); await save(page, "record");
  await page.waitForFunction(() => document.querySelectorAll('[data-testid="live"] .ott-seg:not(.ott-seg--interim)').length >= 6, null, { timeout: 15000 });
  await page.getByLabel("Meeting title").fill("Design review"); await page.getByTestId("stop").click(); await page.getByTestId("segment").first().waitFor(); assert.ok((await page.getByTestId("segment").count()) >= 5);
  await page.getByRole("tab", { name: /Action items/ }).click(); assert.match(await page.getByTestId("actions").innerText(), /prototype/);
  // import: sample + srt file
  await page.getByRole("button", { name: /Conversations/ }).first().click(); await page.getByTestId("open-import").click(); await page.getByRole("button", { name: "Use a sample" }).click(); await page.getByTestId("import-go").click(); await page.getByTestId("segment").first().waitFor(); assert.equal(await page.getByTestId("segment").count(), 4);
  await page.getByRole("button", { name: /Conversations/ }).first().click(); await page.getByTestId("open-import").click();
  await page.setInputFiles('[data-testid="import-file"]', { name: "kickoff.srt", mimeType: "text/plain", buffer: Buffer.from("1\n00:00:01,000 --> 00:00:03,000\nLee: Let's begin the kickoff.\n\n2\n00:00:04,000 --> 00:00:07,000\nNia: I'll send the agenda by Monday.\n") }); await page.getByTestId("import-go").click(); await page.getByTestId("segment").first().waitFor(); assert.equal(await page.getByLabel("Title").inputValue(), "kickoff");
  await page.getByRole("button", { name: /Conversations/ }).first().click(); assert.equal(await cards.count(), 7);
  // delete
  page.once("dialog", d => d.accept()); await page.getByRole("button", { name: "Delete kickoff" }).click({ force: true }); assert.equal(await cards.count(), 6);
  // persistence
  await page.reload(); await cards.first().waitFor(); assert.equal(await cards.count(), 6);
  // mobile
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); const mp = await m.newPage();
  await mp.goto(base + "/login"); await mp.getByRole("button", { name: "Use the demo account" }).click(); await mp.waitForURL(/\/app/); await mp.getByTestId("meeting-card").first().waitFor(); await mp.screenshot({ path: `${dir}/mobile-app.png` }); await m.close();
  const hp = await ctx.newPage(); await hp.setViewportSize({ width: 1440, height: 900 }); await hp.goto(base); await hp.screenshot({ path: `${dir}/home-top.png` }); await hp.screenshot({ path: `${dir}/home-full.png`, fullPage: true });
  await ctx.clearCookies(); await hp.goto(base + "/login"); await hp.screenshot({ path: `${dir}/login.png` });
  console.log("otterisdead smoke OK");
});
