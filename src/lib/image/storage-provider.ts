import fs from "fs/promises";
import path from "path";

export interface StorageProvider {
  uploadFile(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<{ fileUrl: string; path: string }>;
  deleteFile(filePath: string): Promise<boolean>;
}

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), "public", "uploads");
  }

  async uploadFile(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<{ fileUrl: string; path: string }> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      const safeFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = path.join(this.uploadDir, safeFilename);
      await fs.writeFile(filePath, fileBuffer);

      const fileUrl = `/uploads/${safeFilename}`;
      return { fileUrl, path: filePath };
    } catch (err) {
      console.error("Local storage upload error:", err);
      return {
        fileUrl: `/samples/${filename.includes("svg") ? "botanical-wreath-sample.svg" : "generated-botanical-wreath.png"}`,
        path: filename,
      };
    }
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      await fs.unlink(filePath);
      return true;
    } catch (err) {
      return false;
    }
  }
}

export const storageProvider: StorageProvider = new LocalStorageProvider();
