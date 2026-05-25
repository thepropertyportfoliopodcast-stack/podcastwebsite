import React, { useEffect, useState } from "react";
import AuthLayout from "@/layout/AuthLayout";
import toast from "react-hot-toast";
import Listing from "@/pages/api/Listing";
import { useRouter } from "next/router";
import ReactQuillEditor from "./ReactQuillEditor";
import axios from "axios";
import { Api } from "../../api/Api";

export default function Edit() {
  const router = useRouter();
  const { id } = router.query; 
//   console.log("id", id);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topic: "",
    thumbnail: null,
    video: null,
    audio: null,
    audioUrl: "",
    details: null,
    timestamps: null,
    mimefield: "",
    duration: 0,
    durationInSec: 0,
    size: 0,
    isSpotify: false,
    spotifyLink: "",
    isApple: false,
    appleLink: "",
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null); 
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Audio States
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [audioUploadProgress, setAudioUploadProgress] = useState(0);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState(null);

  const validateImageDimensions = (file, requiredWidth, requiredHeight) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        if (img.width === requiredWidth && img.height === requiredHeight) {
          resolve(true);
        } else {
          reject(
            `Thumbnail must be exactly ${requiredWidth} × ${requiredHeight}px. 
            Selected image is ${img.width} × ${img.height}px.`
          );
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject("Invalid image file");
      };

      img.src = objectUrl;
    });
  };

  const handleQuillChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChange = async(e) => {
    const { name, value, files, type, checked } = e.target;

     if (type === "checkbox") {
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
          ...(name === "isSpotify" && !checked ? { spotifyLink: "" } : {}),
          ...(name === "isApple" && !checked ? { appleLink: "" } : {}),
        }));
        return;
      }

      if (name === "thumbnail" && files?.[0]) {
        const file = files[0];
        if (!file.type.startsWith("image/")) {
          toast.error("Only image files allowed");
          return;
        }
        try {
          await validateImageDimensions(file, 3000, 3000);
          setFormData((prev) => ({ ...prev, thumbnail: file }));
          setThumbnailPreview(URL.createObjectURL(file));
        } catch (err) {
          toast.error(err);
          e.target.value = ""; // reset file input
          setFormData((prev) => ({ ...prev, thumbnail: null }));
          setThumbnailPreview(null);
        }
        return;
      }
      else if (name === "audio" && files?.[0]) {
        const file = files[0];

        if (!file.type.startsWith("audio/")) {
          toast.error("Only audio files allowed");
          return;
        }

        setFormData((prev) => ({
          ...prev,
          audio: file,
        }));

        setUploadingAudio(true);
        setAudioUploadProgress(0);
        toast.loading("Uploading audio...");

        try {
          const url = await uploadLargeFile(file);
          setUploadedAudioUrl(url);

          setFormData((prev) => ({
            ...prev,
            audioUrl: url,
          }));

          toast.dismiss();
          toast.success("Audio uploaded!");
        } catch (err) {
          toast.dismiss();
          toast.error("Audio upload failed!");
          console.error(err);
        } finally {
          setUploadingAudio(false);
        }
      } 
      else if (name === "video" && files?.[0]) {
    const file = files[0];

    if (!file.type.startsWith("video/") && !file.type.startsWith("audio/")) {
      toast.error("Only video/audio allowed");
      return;
    }

    // Extract metadata before upload
    const tempVideo = document.createElement("video");
    tempVideo.preload = "metadata";

    tempVideo.onloadedmetadata = async () => {
      window.URL.revokeObjectURL(tempVideo.src);
      const durationInSec = Math.floor(tempVideo.duration);
      const durationInMinutes = Number((durationInSec / 60).toFixed(2));
      const sizeInMB = Number((file.size / (1024 * 1024)).toFixed(2));

      setFormData((prev) => ({
        ...prev,
        video: file,
        mimefield: file.type,
        duration: durationInMinutes,
        durationInSec: durationInSec,
        size: sizeInMB,
      }));

      // Begin Chunk Upload
      setUploadingVideo(true);
      toast.loading("Uploading file...");
      try {
        const url = await uploadLargeFile(file);
        setUploadedFileUrl(url);

        setFormData((prev) => ({
          ...prev,
          videoUrl: url,
        }));

        toast.dismiss();
        toast.success("Upload complete!");
      } catch (err) {
        toast.dismiss();
        toast.error("Upload failed!");
        console.error(err);
      }

      setUploadingVideo(false);
    };

    tempVideo.src = URL.createObjectURL(file);
       }
      else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (!file || !file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    try {
      await validateImageDimensions(file, 3000, 3000);
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      setThumbnailPreview(URL.createObjectURL(file));
    } catch (err) {
      toast.error(err);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const uploadChunkWithRetry = async (
      chunk, 
      partNumber, 
      uploadId, 
      key, 
      MAX_RETRIES, 
      Api, 
      onProgress
  ) => {
      let attempts = 0;
      while (attempts < MAX_RETRIES) {
          try {
              // 1. Get Presigned URL
              const { data: { url: presignedUrl } } = await Api.post("/upload/part-url", {
                  uploadId, key, partNumber,
              });

              // 2. Upload Chunk
              const uploadRes = await axios.put(presignedUrl, chunk, {
                  headers: { "Content-Type": "application/octet-stream" },
                  onUploadProgress: onProgress, // Passes event data to the centralized handler
              });

              const rawETag = uploadRes.headers["etag"] || uploadRes.headers["ETag"];
              const cleanETag = rawETag.replace(/"/g, "");

              return { ETag: cleanETag, PartNumber: partNumber };

          } catch (error) {
              attempts++;
              if (attempts < MAX_RETRIES) {
                  console.warn(`Chunk ${partNumber} failed (Attempt ${attempts}/${MAX_RETRIES}). Retrying...`);
                  await new Promise(resolve => setTimeout(resolve, 2000));
              } else {
                  throw new Error(`Failed to upload chunk ${partNumber} after ${MAX_RETRIES} attempts.`);
              }
          }
      }
  };

  const uploadLargeFile = async (file) => {
      const fileSize = file.size;
      const MIN_CHUNK_SIZE = 10 * 1024 * 1024;
      const MAX_CHUNKS = 100;
      const MAX_RETRIES = 3; 
      const CONCURRENCY_LIMIT = 5;

      const idealChunkSize = Math.ceil(fileSize / MAX_CHUNKS);
      const CHUNK_SIZE = idealChunkSize > MIN_CHUNK_SIZE ? idealChunkSize : MIN_CHUNK_SIZE;
      const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);

      // --- NEW: Global progress trackers ---
      const uploadedBytesRef = { current: 0 }; // Bytes fully completed and accounted for
      const activeChunkProgress = new Map();     // Bytes transferred for currently uploading chunks (key=partNumber, value=bytes loaded)
      const totalFileBytes = file.size;
      // --- END NEW ---

      setUploadingVideo(true);
      setUploadProgress(0);

      try {
          const initRes = await Api.post(`/upload/init`, { fileName: file.name, mimeType: file.type });
          const { uploadId, key } = initRes.data;
          
          const chunkTasks = [];
          for (let i = 0; i < totalChunks; i++) {
              const start = i * CHUNK_SIZE;
              const end = Math.min(start + CHUNK_SIZE, fileSize);
              const chunk = file.slice(start, end);
              const partNumber = i + 1;

              // NEW: Centralized progress handler 
              const onProgress = (e) => {
                  // Update the current progress for THIS partNumber
                  activeChunkProgress.set(partNumber, e.loaded);

                  let totalBytesTransferred = uploadedBytesRef.current;
                  
                  // Sum all bytes currently loaded from active parallel uploads
                  for (const bytes of activeChunkProgress.values()) {
                      totalBytesTransferred += bytes;
                  }

                  // Calculate the single, overall percentage
                  const percent = Math.round((totalBytesTransferred / totalFileBytes) * 100);
                  setUploadProgress(percent);
              };

              chunkTasks.push(
                  uploadChunkWithRetry(chunk, partNumber, uploadId, key, MAX_RETRIES, Api, onProgress)
              );
          }

          const allUploadedParts = [];
          for (let i = 0; i < chunkTasks.length; i += CONCURRENCY_LIMIT) {
              const batch = chunkTasks.slice(i, i + CONCURRENCY_LIMIT);
              const results = await Promise.all(batch);
              allUploadedParts.push(...results);
              
              // --- NEW: Move active bytes to completed bytes after batch success ---
              for (const part of results) {
                  // Determine the actual size of the completed chunk
                  const chunkIndex = part.PartNumber - 1;
                  const completedChunkSize = Math.min(CHUNK_SIZE, totalFileBytes - (chunkIndex * CHUNK_SIZE));
                  
                  // Add the full chunk size to the completed total
                  uploadedBytesRef.current += completedChunkSize;
                  
                  // Remove the chunk from the active tracker to avoid double counting
                  activeChunkProgress.delete(part.PartNumber);
              }
              // --- END NEW ---
          }
          
          // Final completion logic
          allUploadedParts.sort((a, b) => a.PartNumber - b.PartNumber);
          const completeRes = await Api.post(`/upload/complete`, { uploadId, key, parts: allUploadedParts });

          // ... success handling remains the same ...
          setUploadProgress(100);
          toast.success("Upload completed!");
          return completeRes.data.fileUrl;

      } catch (error) {
          // ... failure handling remains the same ...
          toast.error(error.message.includes("chunk") ? error.message : "Upload failed, please try again.");
          setUploadProgress(0);
          return null;
      } finally {
          setUploadingVideo(false);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const main = new Listing();
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("topic", formData.topic);
      payload.append("description", formData.description);
      payload.append("podcastId", id);
      payload.append("detail", formData?.details);
      payload.append("timestamps", formData.timestamps);
      if (formData.thumbnail instanceof File) { 
        payload.append("thumbnail", formData.thumbnail);
      }
      if (formData.isSpotify && formData.spotifyLink) {
        payload.append("spotifyLink", formData.spotifyLink);
      }

      if (formData.isApple && formData.appleLink) {
        payload.append("appleLink", formData.appleLink);
      }

      if (formData.audioUrl) {
        payload.append("audio", formData.audioUrl);
      }
      payload.append("link", uploadedFileUrl);
      payload.append("mimefield", formData.mimeType || "");
      payload.append("duration", formData.duration || 0);
      payload.append("durationInSec", formData.durationInSec || 0);
      payload.append("size", formData.size || 0);
      const response = await main.EpisodeUpdate(id, payload);

      if (response?.data?.status) {
        toast.success(response.data.message);
        setFormData({
          title: "",
          description: "",
          topic: "",
          thumbnail: null,
          video: null,
        });
        setThumbnailPreview(null);
        router.push(`/admin/podcast/${data?.podcast?.uuid}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (id) => {
    try {
      const main = new Listing();
      const response = await main.AdminEpisodeByUUID(id);
      setData(response?.data?.data || []);
    //   console.log("response?.data?.data?.detail",response?.data?.data?.detail);
      // Updating the fields as required
      setFormData({
      title: response?.data?.data?.title || "",
      topic: response?.data?.data?.topic || "",
      description: response?.data?.data?.description || "",
      thumbnail: response?.data?.data?.thumbnail || null,
      video: response?.data?.data?.link || null,
      audioUrl: response?.data?.data?.audio || "",
      details: response?.data?.data?.detail || null,
      timestamps: response?.data?.data?.timestamps || null,
      mimefield: response?.data?.data?.mimefield || "",
      duration: response?.data?.data?.duration || 0,
      durationInSec: response?.data?.data?.durationInSec || 0,
      size: response?.data?.data?.size || 0,
      isSpotify: !!response?.data?.data?.spotifyLink,
      spotifyLink: response?.data?.data?.spotifyLink || "",
      isApple: !!response?.data?.data?.appleLink,
      appleLink: response?.data?.data?.appleLink || "",
    });

    if (response?.data?.data?.thumbnail) {
      setThumbnailPreview(response?.data?.data.thumbnail);
      return;
    }
    setThumbnailPreview(null);
    } catch (error) {
      console.log("error", error);
      setData({});
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails(id);
    }
  }, [id]);

  // console.log("formData", formData);

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="w-full text-white space-y-6 mx-auto">
        <h3 className="text-3xl font-bold text-center heading">
          Edit Episode
        </h3>

        {/* Title */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows="4"
            className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Topic */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Topic <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="topic"
            className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
            value={formData.topic}
            onChange={handleChange}
          />
        </div>

        {/* Thumbnail */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Thumbnail <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-400">
            Required size: 3000 × 3000 px
          </p>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="relative w-full h-64 bg-[#1c1c1c] border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center text-gray-400 cursor-pointer hover:border-white transition"
          >
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Preview"
                className="h-full object-contain rounded"
              />
            ) : (
              <p className="text-center text-sm">
                Drag & drop or click to upload
              </p>
            )}
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Video */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">
            File <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="video"
             accept="video/*,audio/*"
            onChange={handleChange}
            className="w-full h-fit text-sm text-gray-400 file:bg-white file:text-black file:rounded-lg file:px-4 file:py-2 border border-gray-700 bg-[#1c1c1c]"
          />
          {uploadingVideo && (
            <div>
              <label>Uploading Video...</label>
              <progress value={uploadProgress} max="100"></progress>
              <span>{uploadProgress}%</span>
            </div>
          )}
          {uploadedFileUrl && (
            <div className="text-green-400 text-sm mt-1">File uploaded ✔</div>
          )}
          {typeof formData.video === "string" && (
            <video controls className="mt-2 w-full max-h-96 rounded-lg">
              <source src={data?.link} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Audio */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Audio
          </label>

          <input
            type="file"
            name="audio"
            accept="audio/*"
            onChange={handleChange}
            className="w-full text-sm text-gray-400 file:bg-white file:text-black file:rounded-lg file:px-4 file:py-2 border border-gray-700 bg-[#1c1c1c]"
          />

          {uploadingAudio && (
            <div>
              <label>Uploading Audio...</label>
              <progress value={audioUploadProgress} max="100"></progress>
              <span>{audioUploadProgress}%</span>
            </div>
          )}

          {uploadedAudioUrl && (
            <div className="text-green-400 text-sm mt-1">
              Audio uploaded ✔
            </div>
          )}

          {uploadedAudioUrl && (
            <audio controls className="mt-2 w-full">
              <source src={uploadedAudioUrl} />
              Your browser does not support the audio tag.
            </audio>
          )}
          {typeof formData.audioUrl === "string" && (
            <audio controls className="mt-2 w-full">
              <source src={formData.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>

        {/* Details */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Details
          </label>
          <ReactQuillEditor
            label="details"
            desc={formData?.details}
            handleBioChange={(val) => handleQuillChange('details', val)}
          />
        </div>
        
        {/* Timestamps */}
        <div className="space-y-1 mt-[65px]">
          <label className="block text-sm font-medium">
            Timestamps
          </label>
          <ReactQuillEditor
            label="timestamps"
            desc={formData?.timestamps}
            handleBioChange={(val) => handleQuillChange('timestamps', val)}
          />
        </div>

        {/* Platform Availability */}
        <div className="space-y-4 mt-[65px]">
          <label className="block text-sm font-medium">
            Available On
          </label>

          {/* Spotify */}
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              name="isSpotify"
              checked={formData.isSpotify}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Available on Spotify</span>

            {formData.isSpotify && (
              <input
                type="url"
                name="spotifyLink"
                placeholder="Enter Spotify link"
                value={formData.spotifyLink}
                onChange={handleChange}
                className="flex-1 p-2 rounded-lg bg-[#1c1c1c] border border-gray-700 text-white"
              />
            )}
          </div>

          {/* Apple Music */}
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              name="isApple"
              checked={formData.isApple}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Available on Apple Music</span>

            {formData.isApple && (
              <input
                type="url"
                name="appleLink"
                placeholder="Enter Apple Music link"
                value={formData.appleLink}
                onChange={handleChange}
                className="flex-1 p-2 rounded-lg bg-[#1c1c1c] border border-gray-700 text-white"
              />
            )}
          </div>
        </div>


        {/* Submit */}
        <div className="pt-2 mt-16">
          <button
            type="submit"
            disabled={loading}
            className="w-full button-bg font-semibold py-3 rounded-lg transition cursor-pointer"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}