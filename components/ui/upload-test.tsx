"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload, Check, X, AlertCircle } from "lucide-react";

interface UploadResult {
  success: boolean;
  url?: string;
  message: string;
  filename?: string;
}

export function ImageUploadTest() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data: UploadResult = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: "Upload failed. Please try again."
      });
    } finally {
      setUploading(false);
    }
  };

  const clearForm = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <Card className="w-full max-w-md p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Image Upload Test</h3>
        </div>

        <div className="space-y-2">
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
            Select Image
          </label>
          <Input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
        </div>

        {preview && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Preview
            </label>
            <div className="border rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-32 object-cover"
              />
            </div>
          </div>
        )}

        {file && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600 truncate">{file.name}</span>
            <span className="text-xs text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex-1"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
          <Button variant="outline" onClick={clearForm} disabled={uploading}>
            Clear
          </Button>
        </div>

        {result && (
          <div
            className={`p-4 rounded-lg ${
              result.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {result.success ? (
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <X className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    result.success ? "text-green-900" : "text-red-900"
                  }`}
                >
                  {result.message}
                </p>
                {result.success && result.url && (
                  <p className="text-xs text-green-700 mt-1 break-all">
                    {result.url}
                  </p>
                )}
                {result.success && result.filename && (
                  <p className="text-xs text-green-700 mt-1">
                    Filename: {result.filename}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {result && result.success && result.url && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Uploaded Image
            </label>
            <div className="border rounded-lg overflow-hidden">
              <img
                src={result.url}
                alt="Uploaded"
                className="w-full h-32 object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}