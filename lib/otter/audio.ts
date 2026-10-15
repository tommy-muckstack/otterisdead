"use client";
/** Meeting audio lives in IndexedDB (blobs are too big for localStorage). All calls fail soft. */
const DB = "otterisdead-audio", STORE = "audio";
const open = () => new Promise<IDBDatabase>((res, rej) => { const r = indexedDB.open(DB, 1); r.onupgradeneeded = () => r.result.createObjectStore(STORE); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
export async function saveAudio(id: string, blob: Blob): Promise<boolean> { try { const db = await open(); await new Promise<void>((res, rej) => { const t = db.transaction(STORE, "readwrite"); t.objectStore(STORE).put(blob, id); t.oncomplete = () => res(); t.onerror = () => rej(t.error); }); return true; } catch { return false; } }
export async function loadAudio(id: string): Promise<Blob | null> { try { const db = await open(); return await new Promise<Blob | null>((res, rej) => { const r = db.transaction(STORE).objectStore(STORE).get(id); r.onsuccess = () => res((r.result as Blob) ?? null); r.onerror = () => rej(r.error); }); } catch { return null; } }
export async function deleteAudio(id: string): Promise<void> { try { const db = await open(); await new Promise<void>(res => { const t = db.transaction(STORE, "readwrite"); t.objectStore(STORE).delete(id); t.oncomplete = () => res(); t.onerror = () => res(); }); } catch { /* ignore */ } }
