import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const UPLOAD_FOLDERS = new Set([
  "posts/news",
  "posts/event",
  "posts/life",
  "gallery",
  "leaders",
]);

const MAX_BYTES = 200 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const folderRaw = form.get("folder");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "missing_file" }, { status: 400 });
    }
    if (typeof folderRaw !== "string" || !folderRaw) {
      return NextResponse.json({ error: "missing_folder" }, { status: 400 });
    }

    const folder = folderRaw.trim().replace(/^\/+|\/+$/g, "");
    if (!UPLOAD_FOLDERS.has(folder)) {
      return NextResponse.json({ error: "invalid_folder" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "too_large" }, { status: 413 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
    const filename = `${crypto.randomUUID()}.${ext}`;
    const absDir = path.join(process.cwd(), "public", "assets", folder);
    const absPath = path.join(absDir, filename);
    if (!absPath.startsWith(absDir + path.sep)) {
      return NextResponse.json({ error: "invalid_path" }, { status: 400 });
    }

    await mkdir(absDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(absPath, buffer);

    return NextResponse.json({ url: `/assets/${folder}/${filename}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }
}
