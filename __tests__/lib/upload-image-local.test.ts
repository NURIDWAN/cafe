import { uploadImageLocal } from "@/lib/upload-image-local";
import { promises as fs } from "fs";
import path from "path";

describe("uploadImageLocal", () => {
    it("stores a file and returns a public URL", async () => {
        const buffer = Buffer.from("test image content");
        const url = await uploadImageLocal(buffer, "test.jpg");

        // Expect URL to start with /uploads/ and end with .jpg
        expect(url).toMatch(/^\/uploads\/.*\.jpg$/);

        // Verify file exists on disk
        const filePath = path.join(process.cwd(), "public", url);
        await expect(fs.access(filePath)).resolves.not.toThrow();

        // Clean up
        try {
            await fs.unlink(filePath);
        } catch (e) {
            // Ignore cleanup errors
        }
    });
});
