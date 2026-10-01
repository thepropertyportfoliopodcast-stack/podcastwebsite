
import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import toast from "react-hot-toast";
import PodcastApi from "@/services/podcastApi";
import { useRouter } from "next/router";
import RichTextEditor from "@/components/admin/episodes/RichTextEditor";
import axios from "axios";
import { assertReadableFile, episodeRequestError, uploadEpisodeMedia } from "@/utils/episodeUpload.mjs";
import { Api } from "@/services/apiClient";
import SeoFields from "@/components/admin/forms/SeoFields";
import EpisodeContentFields from "@/components/admin/episodes/EpisodeContentFields";
import HostSelector from "@/components/admin/episodes/HostSelector";
import EpisodeRelationsFields from "@/components/admin/episodes/EpisodeRelationsFields";
import EpisodeHeroPhoneFields from "@/components/admin/episodes/EpisodeHeroPhoneFields";

export default function Add() {
  const selectedEpisode=null;
  const router = useRouter();
  const { id } = router.query; 
//   console.log("id", id);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topic: "",
    seoTitle: "",
    seoDescription: "",
    primaryKeyword: "",
    secondaryKeywords: "",
    spotifyLink: "",
    thumbnail: null,
    homepageThumbnail: null,
    websiteThumbnail: null,
    video: null,
    audio: null,
    audioUrl: "",
    audioSize: 0,
    details: null,
    timestamps: "",
    youtubeUrl: "",
    transcript: "",
    transcriptSyncOffsetMs: 0,
    topicsCovered: "",
    reelLinks: "",
    hostSlugs: [],
    guestHostSlugs: [],
    mimefield: "",
    duration: 0,
    durationInSec: 0,
    episodeNumber: "",
    publishedDate: "",
    size: 0,
    isFeatured: false,
    relatedEpisodeUuids: [],
    homePageHeroPhone: false,
    heroPhones: [],
    publicationStatus: "PUBLISHED",
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [homepageThumbnailPreview, setHomepageThumbnailPreview] = useState(null);
  const [websiteThumbnailPreview, setWebsiteThumbnailPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Audio States
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [audioUploadProgress, setAudioUploadProgress] = useState(0);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState(null);
  const [hosts, setHosts] = useState([]);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    new PodcastApi().AdminHostGet().then((response) => setHosts(Array.isArray(response?.data?.data) ? response.data.data : [])).catch(() => setHosts([]));
  }, []);
  useEffect(() => { new PodcastApi().AdminEpisodeGetAll().then((response) => setEpisodes(Array.isArray(response?.data?.data) ? response.data.data : [])).catch(() => setEpisodes([])); }, []);

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

  const validateWebsiteThumbnail = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const isSixteenByNine = Math.abs((img.width / img.height) - (16 / 9)) < 0.01;
        if (isSixteenByNine && img.width >= 1280 && img.height >= 720) {
          resolve(true);
        } else {
          reject(`Website thumbnail must be 16:9 and at least 1280 × 720 px. Selected image is ${img.width} × ${img.height} px.`);
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
    const { name, value, files } = e.target;

    if (["thumbnail", "homepageThumbnail", "websiteThumbnail"].includes(name) && files?.[0]) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files allowed");
        return;
      }
      try {
        if (name === "thumbnail") {
          await validateImageDimensions(file, 3000, 3000);
        } else if (name === "websiteThumbnail") {
          await validateWebsiteThumbnail(file);
        }
        setFormData((prev) => ({ ...prev, [name]: file }));
        const preview = URL.createObjectURL(file);
        if (name === "thumbnail") setThumbnailPreview(preview);
        else if (name === "homepageThumbnail") setHomepageThumbnailPreview(preview);
        else setWebsiteThumbnailPreview(preview);
      } catch (err) {
        toast.error(err);
        e.target.value = ""; // reset file input
        setFormData((prev) => ({ ...prev, [name]: null }));
        if (name === "thumbnail") setThumbnailPreview(null);
        else if (name === "homepageThumbnail") setHomepageThumbnailPreview(null);
        else setWebsiteThumbnailPreview(null);
      }
      return;
    } else if (name === "video" && files?.[0]) {
    const file = files[0];

    if (!file.type.startsWith("video/") && !file.type.startsWith("audio/")) {
      toast.error("Only video/audio allowed");
      return;
    }

    // Extract metadata before upload
    setUploadingVideo(true);
    const tempVideo = document.createElement("video");
    tempVideo.preload = "metadata";

    tempVideo.onloadedmetadata = async () => {
      window.URL.revokeObjectURL(tempVideo.src);
      if (!Number.isFinite(tempVideo.duration)) {
        setUploadingVideo(false);
        toast.error("Unable to read this media file duration. Please choose a supported audio or video file.");
        return;
      }
      const durationInSec = Math.floor(tempVideo.duration);
      const durationInMinutes = Math.ceil(durationInSec / 60);
      const sizeInBytes = file.size;

      setFormData((prev) => ({
        ...prev,
        video: file,
        mimefield: file.type,
        duration: durationInMinutes,
        durationInSec: durationInSec,
        size: sizeInBytes,
      }));

      // Begin Chunk Upload
      setUploadingVideo(true);
      toast.loading("Uploading file...");
      try {
        const url = await uploadLargeFile(file, "video");
        setUploadedFileUrl(url);

        setFormData((prev) => ({
          ...prev,
          videoUrl: url,
        }));

        toast.dismiss();
        toast.success("Upload complete!");
      } catch (err) {
        toast.dismiss();
        toast.error(episodeRequestError(err));
        console.error(err);
      }

      setUploadingVideo(false);
    };

    tempVideo.onerror = () => {
      URL.revokeObjectURL(tempVideo.src);
      setUploadingVideo(false);
      toast.error("Cannot read this media file. Reselect a supported audio or video file.");
    };
    tempVideo.src = URL.createObjectURL(file);
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
          audioSize: file.size,
        }));

        setUploadingAudio(true);
        setAudioUploadProgress(0);
        toast.loading("Uploading audio...");

        try {
          const url = await uploadLargeFile(file, "audio");
          setUploadedAudioUrl(url);

          setFormData((prev) => ({
            ...prev,
            audioUrl: url,
          }));

          toast.dismiss();
          toast.success("Audio uploaded!");
        } catch (err) {
          toast.dismiss();
          toast.error(episodeRequestError(err));
          console.error(err);
        } finally {
          setUploadingAudio(false);
        }
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

  // const uploadLargeFile = async (file) => {
  //   const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB
  //   const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  //   setUploadingVideo(true);
  //   setUploadProgress(0);

  //   try {
  //     // STEP 1️⃣: Initialize multipart upload
  //     const initRes = await Api.post(`/upload/init`, {
  //       fileName: file.name,
  //       mimeType: file.type
  //     });

  //     const { uploadId, key } = initRes.data;
  //     let uploadedParts = [];

  //     for (let i = 0; i < totalChunks; i++) {
  //       const start = i * CHUNK_SIZE;
  //       const end = Math.min(start + CHUNK_SIZE, file.size);
  //       const chunk = file.slice(start, end);

  //       // STEP 2️⃣: Upload each chunk as raw binary
  //       const chunkRes = await Api.put(
  //         `/upload/part?uploadId=${uploadId}&key=${key}&partNumber=${i + 1}`,
  //         chunk,
  //         {
  //           headers: {
  //             "Content-Type": "application/octet-stream",
  //             // "Content-Length": chunk.size
  //           },
  //           onUploadProgress: (e) => {
  //             const chunkProgress = e.loaded / chunk.size;
  //             const percent = Math.round(((i + chunkProgress) / totalChunks) * 100);
  //             setUploadProgress(percent);
  //           },
  //         }
  //       );

  //       uploadedParts.push({
  //         ETag: chunkRes.data.ETag.replace(/"/g, ""), // remove quotes if any
  //         PartNumber: i + 1,
  //       });
  //     }

  //     // STEP 3️⃣: Complete multipart upload
  //     uploadedParts.sort((a, b) => a.PartNumber - b.PartNumber);

  //     const completeRes = await Api.post(`/upload/complete`, {
  //       uploadId,
  //       key,
  //       parts: uploadedParts,
  //     });

  //     const url = completeRes.data.fileUrl;
  //     setUploadedFileUrl(url);
  //     setFormData((prev) => ({
  //       ...prev,
  //       videoUrl: url,
  //       size: Number((file.size / (1024 * 1024)).toFixed(2)), // MB
  //     }));

  //     setUploadProgress(100);
  //     toast.success("Upload completed!");
  //     return url;

  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //     toast.error("Upload failed, please try again.");
  //     setUploadProgress(0);
  //     return null;

  //   } finally {
  //     setUploadingVideo(false);
  //   }
  // };

  // Add this helper function outside of the component or at the top of the file
// This is an async function that handles fetching the URL and uploading one chunk with retries

  const uploadLargeFile = async (file, type = "video") => {
    const setBusy = type === "audio" ? setUploadingAudio : setUploadingVideo;
    const setProgress = type === "audio" ? setAudioUploadProgress : setUploadProgress;
    setBusy(true);
    setProgress(0);
    try {
      return await uploadEpisodeMedia({ file, api: Api, put: axios.put, onProgress: setProgress });
    } catch (error) {
      setProgress(0);
      throw error;
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || uploadingAudio || uploadingVideo) {
      toast.error("Wait for the current upload or save to finish.");
      return;
    }
    const requestedPublicationStatus = e.nativeEvent?.submitter?.value === "DRAFT"
      ? "DRAFT"
      : "PUBLISHED";

    if (!formData.title.trim()) {
      toast.error("Add an episode title before saving");
      return;
    }
    if (!router.isReady || !Number.isSafeInteger(Number(id)) || Number(id) <= 0) {
      toast.error("Open Add Episode from a podcast before saving.");
      return;
    }
    setLoading(true);

    try {
      const main = new PodcastApi();

      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("topic", formData.topic);
      payload.append("podcastId", id);
      payload.append("detail", formData.details);
      payload.append("timestamps", formData.timestamps);
      payload.append("youtubeUrl", formData.youtubeUrl);
      payload.append("transcript", formData.transcript);
      payload.append("transcriptSyncOffsetMs", String(formData.transcriptSyncOffsetMs || 0));
      payload.append("topicsCovered", formData.topicsCovered);
      payload.append("reelLinks", formData.reelLinks);
      payload.append("hostSlugs", JSON.stringify(formData.hostSlugs));
      payload.append("guestHostSlugs", JSON.stringify(formData.guestHostSlugs));
      payload.append("seoTitle", formData.seoTitle);
      payload.append("seoDescription", formData.seoDescription);
      payload.append("primaryKeyword", formData.primaryKeyword);
      payload.append("secondaryKeywords", formData.secondaryKeywords);
      payload.append("spotifyLink", formData.spotifyLink);
      payload.append("isFeatured", String(formData.isFeatured));
      payload.append("relatedEpisodeUuids", JSON.stringify(formData.relatedEpisodeUuids));
      payload.append("homePageHeroPhone", String(formData.homePageHeroPhone));
      payload.append("publicationStatus", requestedPublicationStatus);
      payload.append("heroPhones", JSON.stringify((formData.heroPhones || []).map(({ thumbnail, shortVideo, ...phone }) => phone)));
      (formData.heroPhones || []).forEach((phone, index) => {
        if (phone.thumbnail) payload.append(`heroPhoneThumbnail_${index}`, phone.thumbnail);
        if (phone.shortVideo) payload.append(`heroPhoneVideo_${index}`, phone.shortVideo);
      });

      // Video now handled via chunk upload
      if (requestedPublicationStatus === "PUBLISHED" && !uploadedFileUrl && !formData.youtubeUrl) {
        toast.error("Please add a YouTube URL or upload a video first!");
        setLoading(false);
        return;
      }
      if (formData.audioUrl) {
        payload.append("audio", formData.audioUrl);
        payload.append("audioSize", formData.audioSize || 0);
      }

      if (uploadedFileUrl) payload.append("link", uploadedFileUrl);
      payload.append("mimefield", formData.mimefield || "");
      payload.append("duration", formData.duration || 0);
      payload.append("durationInSec", formData.durationInSec || 0);
      payload.append("episodeNumber", formData.episodeNumber);
      payload.append("publishedDate", formData.publishedDate);
      payload.append("size", formData.size || 0);

      // Thumbnail still uploaded via backend
      if (formData.thumbnail) {
        payload.append("thumbnail", formData.thumbnail);
      }
      payload.append("sharedWebsiteArtwork", "true");
      if (formData.websiteThumbnail) {
        payload.append("websiteThumbnail", formData.websiteThumbnail);
      }

      for (const value of payload.values()) {
        if (value instanceof File) await assertReadableFile(value);
      }
      const response = await main.EpisodeAdd(payload);

      if (response?.data?.status) {
        toast.success(response.data.message);
        setFormData({
          title: "",
          description: "",
          topic: "",
          seoTitle: "",
          seoDescription: "",
          primaryKeyword: "",
          secondaryKeywords: "",
          details: "",
          thumbnail: null,
          homepageThumbnail: null,
          websiteThumbnail: null,
          videoUrl: "",
          thumbnailPreview: "",
          duration: 0,
          durationInSec: 0,
          mimeType: "",
          size: 0,
          audio: null,
          audioUrl: "",
          audioSize: 0,
        });
        setThumbnailPreview(null);
        setHomepageThumbnailPreview(null);
        setWebsiteThumbnailPreview(null);

        router.push("/admin/podcast");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error(episodeRequestError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="w-full text-white space-y-6 mx-auto">
        <h3 className="text-3xl font-bold text-center heading">
          {selectedEpisode ? "Edit Episode" : "Add Episode"}
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

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="topic"
              className="w-full rounded-lg border border-gray-700 bg-[#1c1c1c] p-3 text-white focus:outline-none focus:ring-2 focus:ring-white"
              value={formData.topic}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Episode number</label>
            <input type="number" min="1" step="1" name="episodeNumber" value={formData.episodeNumber} onChange={handleChange} placeholder="24" className="w-full rounded-lg border border-gray-700 bg-[#1c1c1c] p-3 text-white" />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Publication date</label>
            <input type="date" name="publishedDate" value={formData.publishedDate} onChange={handleChange} className="w-full rounded-lg border border-gray-700 bg-[#1c1c1c] p-3 text-white" />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">Duration (minutes)</label>
            <input type="number" min="0" step="1" value={formData.duration || ""} onChange={(event) => setFormData((current) => ({ ...current, duration: Number(event.target.value), durationInSec: Number(event.target.value) * 60 }))} className="w-full rounded-lg border border-gray-700 bg-[#1c1c1c] p-3 text-white" />
          </div>
        </div>

        <SeoFields formData={formData} onChange={handleChange} />

        <HostSelector hosts={hosts} selected={formData.hostSlugs} onChange={(hostSlugs) => setFormData((current) => ({ ...current, hostSlugs }))} guestSelected={formData.guestHostSlugs} onGuestChange={(guestHostSlugs) => setFormData((current) => ({ ...current, guestHostSlugs }))} />
        <EpisodeRelationsFields formData={formData} episodes={episodes} onChange={setFormData} />
        <EpisodeHeroPhoneFields formData={formData} onChange={setFormData} />

        <div className="rounded-xl border border-gray-800 bg-[#111] p-4 md:p-6">
          <label className="block text-sm font-medium">Spotify episode or show link</label>
          <p className="mb-3 mt-1 text-xs text-gray-400">Paste an open.spotify.com episode, show, or track URL to display the embedded Spotify player.</p>
          <input type="url" name="spotifyLink" value={formData.spotifyLink} onChange={handleChange} placeholder="https://open.spotify.com/episode/..." className="w-full rounded-lg border border-gray-700 bg-[#1c1c1c] p-3 text-white" />
        </div>

        <div className="space-y-5 rounded-xl border border-gray-800 bg-[#111111] p-4 md:p-6">
          <h4 className="text-lg font-semibold">Media</h4>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Thumbnail */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                RSS episode artwork <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-400">
                Required size: 3000 × 3000 px (square). This image is sent to podcast apps through the RSS feed.
              </p>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative flex h-[320px] w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-600 bg-[#1c1c1c] text-gray-400 transition hover:border-white"
              >
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="h-full rounded object-contain"
                  />
                ) : (
                  <p className="text-center text-sm">
                    Drag & drop or click to upload
                  </p>
                )}
                <input
                  type="file" disabled={loading || uploadingAudio || uploadingVideo}
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </div>
            </div>

            {/* Optional website card artwork */}
            <div className="space-y-2 lg:col-span-2">
              <label className="block text-sm font-medium">Website card thumbnail & homepage hero image <span className="text-gray-400">(optional)</span></label>
              <p className="text-xs text-gray-400">Used for both episode cards and the homepage hero. Recommended: 1600 × 900 px; any 16:9 image at least 1280 × 720 px is accepted. RSS artwork is the fallback.</p>
              <div className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-gray-600 bg-[#1c1c1c] text-gray-400 transition hover:border-white lg:max-w-[calc(50%-0.625rem)]">
                {websiteThumbnailPreview ? (
                  <img src={websiteThumbnailPreview} alt="Website card thumbnail preview" className="h-full w-full rounded object-cover" />
                ) : (
                  <p className="absolute inset-0 grid place-items-center px-4 text-center text-sm">Click to upload the card and homepage hero image</p>
                )}
                <input type="file" disabled={loading || uploadingAudio || uploadingVideo} name="websiteThumbnail" accept="image/*" onChange={handleChange} className="absolute inset-0 cursor-pointer opacity-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Video */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Video file <span className="text-gray-400">(optional when using YouTube)</span>
          </label>
          <input
            type="file" disabled={loading || uploadingAudio || uploadingVideo}
            name="video"
             accept="video/*,audio/*"
            onChange={handleChange}
            className="w-full text-sm text-gray-400 file:bg-white file:text-black file:rounded-lg file:px-4 file:py-2 border border-gray-700 bg-[#1c1c1c]"
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
        </div>

        {/* Audio */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Audio
          </label>

          <input
            type="file" disabled={loading || uploadingAudio || uploadingVideo}
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
        </div>

        {/* Details */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Details
          </label>
          <RichTextEditor
            label="details"
            desc={formData?.details}
            handleBioChange={(val) => handleQuillChange('details', val)}
          />
        </div>

        <EpisodeContentFields
          formData={formData}
          onChange={handleChange}
          onTranscriptChange={(value) => setFormData((prev) => ({ ...prev, transcript: value }))}
        />

        {/* Submit */}
        <div className="mt-16 rounded-xl border border-gray-800 bg-[#111111] p-4 md:p-5">
          <p className="text-sm font-semibold text-white">Publication</p>
          <p className="mt-1 text-xs leading-5 text-gray-400">
            Save a private draft to finish later, or publish it to the website and RSS feed now.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="submit"
              name="publicationStatus"
              value="DRAFT"
              formNoValidate
              disabled={loading || uploadingAudio || uploadingVideo}
              className="rounded-lg border border-[#9747FF] bg-transparent px-5 py-3 font-semibold !text-black transition hover:bg-[#9747FF]/15 hover:text-[#000000] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save as draft"}
            </button>
          <button
            type="submit"
            name="publicationStatus"
            value="PUBLISHED"
            disabled={loading || uploadingAudio || uploadingVideo}
              className="button-bg rounded-lg px-5 py-3 font-semibold !text-white transition disabled:cursor-not-allowed disabled:opacity-60"
          >
              {loading ? "Publishing..." : "Publish episode"}
          </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
