"use client";

import Image from "next/image";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";

type UploadedAsset = {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
};

export default function CloudinaryUpload() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [asset, setAsset] = useState<UploadedAsset | null>(null);
  const [instruction, setInstruction] = useState(
    "format auto, quality auto"
  );
  const [appliedInstruction, setAppliedInstruction] = useState(
    "format auto, quality auto"
  );
  const [pickedBackground, setPickedBackground] = useState("#00ff00");
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signatureRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timestamp, folder: "basement" }),
      });

      if (!signatureRes.ok) {
        throw new Error("Failed to sign upload request.");
      }

      const signatureData = await signatureRes.json();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signatureData.apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signatureData.signature);
      formData.append("folder", signatureData.folder);

      const data = await new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`
        );

        xhr.upload.onprogress = (progressEvent) => {
          if (!progressEvent.lengthComputable) return;
          const percent = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(percent);
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
            return;
          }
          reject(new Error("Upload failed."));
        };

        xhr.onerror = () => reject(new Error("Upload failed."));
        xhr.send(formData);
      });

      setAsset({
        publicId: data.public_id,
        secureUrl: data.secure_url,
        width: data.width,
        height: data.height,
        format: data.format,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error.");
    } finally {
      setUploading(false);
    }
  };

  const parsedTransform = useMemo(() => {
    const text = appliedInstruction.toLowerCase();
    const tokens: string[] = [];
    let hasCrop = false;

    let width: number | null = null;
    let height: number | null = null;

    const sizeMatch = text.match(/(\d{2,4})\s*x\s*(\d{2,4})/);
    if (sizeMatch) {
      width = Number(sizeMatch[1]);
      height = Number(sizeMatch[2]);
      tokens.push(`w_${width}`, `h_${height}`);
    } else {
      const widthMatch = text.match(/(?:width|w)\s*(\d{2,4})/);
      const heightMatch = text.match(/(?:height|h)\s*(\d{2,4})/);

      if (widthMatch) {
        width = Number(widthMatch[1]);
        tokens.push(`w_${width}`);
      }

      if (heightMatch) {
        height = Number(heightMatch[1]);
        tokens.push(`h_${height}`);
      }
    }

    const cropModes = ["fill", "fit", "scale", "thumb", "pad"];
    const cropMode = cropModes.find((mode) => text.includes(`crop ${mode}`));
    if (cropMode) {
      tokens.push(`c_${cropMode}`);
      hasCrop = true;
    } else if (text.includes("crop")) {
      tokens.push("c_fill");
      hasCrop = true;
    }

    if (text.includes("format avif")) {
      tokens.push("f_avif");
    } else if (text.includes("format webp")) {
      tokens.push("f_webp");
    } else if (text.includes("format jpg") || text.includes("format jpeg")) {
      tokens.push("f_jpg");
    } else if (text.includes("format png")) {
      tokens.push("f_png");
    } else {
      tokens.push("f_auto");
    }

    const qualityMatch = text.match(/quality\s*(auto|\d{1,3})/);
    if (qualityMatch) {
      const qValue = qualityMatch[1];
      tokens.push(qValue === "auto" ? "q_auto" : `q_${qValue}`);
    } else {
      tokens.push("q_auto");
    }

    if (text.includes("grayscale") || text.includes("greyscale")) {
      tokens.push("e_grayscale");
    }

    const blurMatch = text.match(/blur\s*(\d{1,4})/);
    if (blurMatch) {
      tokens.push(`e_blur:${blurMatch[1]}`);
    }

    if (
      text.includes("remove background") ||
      text.includes("background remove") ||
      text.includes("bg remove") ||
      text.includes("bg-removal") ||
      text.includes("background removal")
    ) {
      tokens.push("e_background_removal");
    }

    const bgMatch = text.match(/(?:background|bg)(?:\s+color)?\s+([^,]+)/);
    const pickedHex = pickedBackground.replace("#", "");
    let backgroundToken: string | null = null;

    if (bgMatch?.[1]) {
      const raw = bgMatch[1].trim();
      const hexMatch = raw.match(/^#?([0-9a-f]{6})$/i);
      if (hexMatch) {
        backgroundToken = `b_rgb:${hexMatch[1]}`;
      } else if (/^[a-z]+$/i.test(raw)) {
        backgroundToken = `b_${raw.toLowerCase()}`;
      }
    }

    if (text.includes("use picked background") || text.includes("picked background")) {
      backgroundToken = `b_rgb:${pickedHex}`;
    }

    if (backgroundToken) {
      tokens.push(backgroundToken);
      if (!hasCrop && (width || height)) {
        tokens.push("c_pad");
      }
    }

    return {
      transformString: tokens.join(","),
      width: width ?? 1200,
      height: height ?? 800,
    };
  }, [appliedInstruction, pickedBackground]);

  const transformedUrl = asset
    ? `https://res.cloudinary.com/${cloudName}/image/upload/${parsedTransform.transformString}/${asset.publicId}`
    : null;

  const downloadUrl = asset
    ? `https://res.cloudinary.com/${cloudName}/image/upload/${parsedTransform.transformString},fl_attachment/${asset.publicId}`
    : null;

  const jpgTransformString = useMemo(() => {
    const tokens = parsedTransform.transformString
      .split(",")
      .filter((token) => token && !token.startsWith("f_"));
    tokens.push("f_jpg");
    return tokens.join(",");
  }, [parsedTransform.transformString]);

  const downloadJpgUrl = asset
    ? `https://res.cloudinary.com/${cloudName}/image/upload/${jpgTransformString},fl_attachment:modified-image.jpg/${asset.publicId}`
    : null;

  const applyInstruction = () => {
    setAppliedInstruction(instruction.trim() || "format auto, quality auto");
  };

  useEffect(() => {
    if (!transformedUrl) return;

    setIsOptimizing(true);
    setOptimizationProgress(10);

    const interval = window.setInterval(() => {
      setOptimizationProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 180);

    const previewImage = new window.Image();
    previewImage.onload = () => {
      window.clearInterval(interval);
      setOptimizationProgress(100);
      window.setTimeout(() => setIsOptimizing(false), 200);
    };

    previewImage.onerror = () => {
      window.clearInterval(interval);
      setIsOptimizing(false);
      setError(
        "Could not render this transform. Background removal may require additional Cloudinary plan support."
      );
    };

    previewImage.src = transformedUrl;

    return () => {
      window.clearInterval(interval);
    };
  }, [transformedUrl]);

  if (!cloudName) {
    return (
      <div className="rounded-[4px] border border-white/10 bg-[var(--color-bg-secondary)] p-6">
        <h2 className="text-[1.125rem] font-medium tracking-[-0.01em]">
          Cloudinary Upload
        </h2>
        <p className="mt-2 text-sm text-[var(--color-fg-secondary)]">
          Configure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` to enable uploads.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[4px] border border-white/10 bg-[var(--color-bg-secondary)] p-6">
      <h2 className="text-[1.125rem] font-medium tracking-[-0.01em]">
        Cloudinary Upload
      </h2>
      <p className="mt-2 text-sm text-[var(--color-fg-secondary)]">
        Signed uploads with free-tier friendly transformations (resize, crop,
        format, quality).
      </p>

      {uploading ? (
        <div className="mt-4 rounded-[4px] border border-white/10 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-fg-tertiary)]">
            Upload progress: {uploadProgress}%
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded bg-white/10">
            <div
              className="h-full bg-[var(--color-accent)] transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-4 rounded-[4px] border border-white/10 p-4">
        <label
          htmlFor="instruction"
          className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-fg-tertiary)]"
        >
          Transformation instruction
        </label>
        <textarea
          id="instruction"
          value={instruction}
          onChange={(event) => setInstruction(event.target.value)}
          className="mt-2 min-h-20 w-full rounded-[2px] border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-[var(--color-fg-tertiary)] focus:border-white/30 focus:outline-none"
          placeholder="resize 800x800, crop fill, format webp, quality 80"
        />
        <p className="mt-2 text-xs text-[var(--color-fg-tertiary)]">
          Examples: "resize 1600x900, crop fit, quality auto" or "width 600,
          format avif, grayscale" or "remove background, background #00ff00,
          format png"
        </p>
        <div className="mt-3 flex items-center gap-3">
          <label
            htmlFor="picked-bg"
            className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-fg-tertiary)]"
          >
            Pick any color
          </label>
          <input
            id="picked-bg"
            type="color"
            value={pickedBackground}
            onChange={(event) => setPickedBackground(event.target.value)}
            className="h-8 w-12 rounded border border-white/10 bg-transparent"
          />
          <button
            type="button"
            onClick={() =>
              setInstruction((prev) => `${prev}, background ${pickedBackground}`)
            }
            className="focus-ring rounded-[2px] border border-white/15 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:border-white/30"
          >
            Add picked color
          </button>
        </div>
        <button
          type="button"
          onClick={applyInstruction}
          className="focus-ring mt-3 rounded-[2px] border border-white/15 px-3 py-2 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:border-white/30"
        >
          Apply Instruction
        </button>
      </div>

      <label className="mt-4 inline-flex items-center gap-3 rounded-[2px] border border-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:border-white/30">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {uploading ? "Uploading..." : "Select Image"}
      </label>
      {error ? (
        <p className="mt-3 text-sm text-[var(--color-accent)]">{error}</p>
      ) : null}
      {isOptimizing ? (
        <div className="mt-4 rounded-[4px] border border-white/10 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-fg-tertiary)]">
            Optimization progress: {optimizationProgress}%
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded bg-white/10">
            <div
              className="h-full bg-[var(--color-accent)] transition-all duration-200"
              style={{ width: `${optimizationProgress}%` }}
            />
          </div>
        </div>
      ) : null}
      {asset && transformedUrl ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-[var(--color-fg-tertiary)]">
              Original
            </p>
            <Image
              src={asset.secureUrl}
              alt="Uploaded asset"
              width={asset.width}
              height={asset.height}
              className="mt-2 h-auto w-full rounded-[4px] object-cover"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-[var(--color-fg-tertiary)]">
              Optimized ({parsedTransform.transformString})
            </p>
            <Image
              src={transformedUrl}
              alt="Optimized asset"
              width={parsedTransform.width}
              height={parsedTransform.height}
              className="mt-2 h-auto w-full rounded-[4px] object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <p className="mt-2 break-all text-xs text-[var(--color-fg-tertiary)]">
              URL: {transformedUrl}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  className="focus-ring inline-flex items-center justify-center rounded-[2px] border border-white/15 px-3 py-2 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:border-white/30"
                >
                  Download Modified Image
                </a>
              ) : null}
              {downloadJpgUrl ? (
                <a
                  href={downloadJpgUrl}
                  className="focus-ring inline-flex items-center justify-center rounded-[2px] border border-white/15 px-3 py-2 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:border-white/30"
                >
                  Download JPG/JPEG
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
