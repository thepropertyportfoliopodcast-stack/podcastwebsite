import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import toast from "react-hot-toast";
import PodcastApi from "@/services/podcastApi";
import { useRouter } from "next/router";
import RichTextEditor from "@/components/admin/episodes/RichTextEditor";
import axios from "axios";
import { Api } from "@/services/apiClient";
import PageLoader from "@/components/ui/PageLoader";
import SeoFields from "@/components/admin/forms/SeoFields";
import EpisodeContentFields from "@/components/admin/episodes/EpisodeContentFields";
import HostSelector from "@/components/admin/episodes/HostSelector";
import EpisodeRelationsFields from "@/components/admin/episodes/EpisodeRelationsFields";
import EpisodeHeroPhoneFields from "@/components/admin/episodes/EpisodeHeroPhoneFields";

export default function Edit() {
  const router = useRouter();
  const { id } = router.query; 
//   console.log("id", id);
  const DESCRIPTION_LIMIT = 150;
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topic: "",
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
    isSpotify: false,
    spotifyLink: "",
    isApple: false,
    appleLink: "",
    seoTitle: "",
    seoDescription: "",
    primaryKeyword: "",
    secondaryKeywords: "",
    isFeatured: false,
    relatedEpisodeUuids: [],
    homePageHeroPhone: false,
    heroPhones: [],
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
  const [regeneratingTranscript, setRegeneratingTranscript] = useState(false);

  useEffect(() => {
    new PodcastApi().AdminHostGet().then((response) => setHosts(Array.isArray(response?.data?.data) ? response.data.data : [])).catch(() => setHosts([]));
  }, []);
  useEffect(() => { new PodcastApi().AdminEpisodeGetAll().then((response) => setEpisodes(Array.isArray(response?.data?.data) ? response.data.data : [])).catch(() => setEpisodes([])); }, []);

  const handleRegenerateTranscript = async () => {
    if (!id || regeneratingTranscript) return;
    setRegeneratingTranscript(true);
    try {
      const response = await new PodcastApi().EpisodeTranscriptRegenerate(id);
      setData((current) => current ? { ...current, transcriptStatus: response?.data?.data?.status || "QUEUED", transcriptError: null } : current);
      toast.success(response?.data?.message || "Transcript regeneration queued");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to queue transcript regeneration");
    } finally {
      setRegeneratingTranscript(false);
    }
  };

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
      setFormData((prev) => ({
        ...prev,
        [name]: name === "description" ? value.slice(0, DESCRIPTION_LIMIT) : value,
      }));
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
              if (!rawETag) throw new Error("Storage did not expose the ETag response header");
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

              chunkTasks.push(() =>
                  uploadChunkWithRetry(chunk, partNumber, uploadId, key, MAX_RETRIES, Api, onProgress)
              );
          }

          const allUploadedParts = [];
          for (let i = 0; i < chunkTasks.length; i += CONCURRENCY_LIMIT) {
              const batch = chunkTasks.slice(i, i + CONCURRENCY_LIMIT);
              const results = await Promise.all(batch.map((uploadPart) => uploadPart()));
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
      const main = new PodcastApi();
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("topic", formData.topic);
      payload.append("description", (formData.description || "").slice(0, DESCRIPTION_LIMIT));
      payload.append("podcastId", id);
      payload.append("detail", formData?.details);
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
      payload.append("isFeatured", String(formData.isFeatured));
      payload.append("relatedEpisodeUuids", JSON.stringify(formData.relatedEpisodeUuids));
      payload.append("homePageHeroPhone", String(formData.homePageHeroPhone));
      payload.append("heroPhones", JSON.stringify((formData.heroPhones || []).map(({ thumbnail, shortVideo, ...phone }) => phone)));
      (formData.heroPhones || []).forEach((phone, index) => {
        if (phone.thumbnail instanceof File) payload.append(`heroPhoneThumbnail_${index}`, phone.thumbnail);
        if (phone.shortVideo instanceof File) payload.append(`heroPhoneVideo_${index}`, phone.shortVideo);
      });
      if (formData.thumbnail instanceof File) { 
        payload.append("thumbnail", formData.thumbnail);
      }
      if (formData.homepageThumbnail instanceof File) {
        payload.append("homepageThumbnail", formData.homepageThumbnail);
      }
      if (formData.websiteThumbnail instanceof File) {
        payload.append("websiteThumbnail", formData.websiteThumbnail);
      }
      if (formData.isSpotify && formData.spotifyLink) {
        payload.append("spotifyLink", formData.spotifyLink);
      }

      if (formData.isApple && formData.appleLink) {
        payload.append("appleLink", formData.appleLink);
      }

      if (formData.audioUrl) {
        payload.append("audio", formData.audioUrl);
        if (formData.audioSize) payload.append("audioSize", formData.audioSize);
      }
      if (uploadedFileUrl) {
        payload.append("link", uploadedFileUrl);
      }
      payload.append("mimefield", formData.mimefield || "");
      payload.append("duration", formData.duration || 0);
      payload.append("durationInSec", formData.durationInSec || 0);
      payload.append("episodeNumber", formData.episodeNumber);
      payload.append("publishedDate", formData.publishedDate);
      payload.append("size", formData.size || 0);
      const response = await main.EpisodeUpdate(id, payload);

      if (response?.data?.status) {
        toast.success(response.data.message);
        setFormData({
          title: "",
          description: "",
          topic: "",
          thumbnail: null,
          homepageThumbnail: null,
          websiteThumbnail: null,
          video: null,
        });
        setThumbnailPreview(null);
        setHomepageThumbnailPreview(null);
        setWebsiteThumbnailPreview(null);
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
      setFetchLoading(true);
      const main = new PodcastApi();
      const response = await main.AdminEpisodeByUUID(id);
      setData(response?.data?.data && typeof response.data.data === "object" ? response.data.data : null);
    //   console.log("response?.data?.data?.detail",response?.data?.data?.detail);
      // Updating the fields as required
      setFormData({
      title: response?.data?.data?.title || "",
      topic: response?.data?.data?.topic || "",
      description: (response?.data?.data?.description || "").slice(0, DESCRIPTION_LIMIT),
      thumbnail: response?.data?.data?.thumbnail || null,
      homepageThumbnail: response?.data?.data?.homepageThumbnail || null,
      websiteThumbnail: response?.data?.data?.websiteThumbnail || null,
      video: response?.data?.data?.link || null,
      audioUrl: response?.data?.data?.audio || "",
      audioSize: response?.data?.data?.audioSize || 0,
      details: response?.data?.data?.detail || null,
      timestamps: response?.data?.data?.timestamps || "",
      youtubeUrl: response?.data?.data?.youtubeUrl || "",
      transcript: response?.data?.data?.transcript || "",
      transcriptSyncOffsetMs: response?.data?.data?.transcriptSyncOffsetMs || 0,
      topicsCovered: (response?.data?.data?.topicsCovered || []).join("\n"),
      reelLinks: (response?.data?.data?.reelLinks || []).join("\n"),
      hostSlugs: Array.isArray(response?.data?.data?.hostSlugs) ? response.data.data.hostSlugs : [],
      guestHostSlugs: Array.isArray(response?.data?.data?.guestHostSlugs) ? response.data.data.guestHostSlugs : [],
      mimefield: response?.data?.data?.mimefield || "",
      duration: response?.data?.data?.duration || 0,
      durationInSec: response?.data?.data?.durationInSec || 0,
      episodeNumber: response?.data?.data?.episodeNumber || "",
      publishedDate: response?.data?.data?.createdAt ? new Date(response.data.data.createdAt).toISOString().slice(0, 10) : "",
      size: response?.data?.data?.size || 0,
      isSpotify: !!response?.data?.data?.spotifyLink,
      spotifyLink: response?.data?.data?.spotifyLink || "",
      isApple: !!response?.data?.data?.appleLink,
      appleLink: response?.data?.data?.appleLink || "",
      seoTitle: response?.data?.data?.seoTitle || "",
      seoDescription: response?.data?.data?.seoDescription || "",
      primaryKeyword: response?.data?.data?.primaryKeyword || "",
      secondaryKeywords: response?.data?.data?.secondaryKeywords || "",
      isFeatured: Boolean(response?.data?.data?.isFeatured),
      relatedEpisodeUuids: Array.isArray(response?.data?.data?.relatedEpisodeUuids) ? response.data.data.relatedEpisodeUuids : [],
      homePageHeroPhone: Boolean(response?.data?.data?.heroPhones?.length),
      heroPhones: (response?.data?.data?.heroPhones || []).map((phone) => ({ ...phone, thumbnail: null, shortVideo: null, shortVideoUrl: phone.shortVideo || null, removeShortVideo: false })),
    });

    setThumbnailPreview(response?.data?.data?.thumbnail || null);
    setHomepageThumbnailPreview(response?.data?.data?.homepageThumbnail || null);
    setWebsiteThumbnailPreview(response?.data?.data?.websiteThumbnail || null);
    } catch (error) {
      console.log("error", error);
      setData(null);
      toast.error(error?.response?.data?.message || "Failed to load episode");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails(id);
    }
  }, [id]);

  // console.log("formData", formData);

  return (
    <AdminLayout>
      {fetchLoading || !id ? (
        <PageLoader />
      ) : (
      <div className="max-w-5xl mx-auto">
        <div className="">
          <div className="flex flex-col gap-1 text-start">
            <h3 className="text-3xl font-bold heading">Edit Episode</h3>
            <p className="text-sm text-gray-400">
              Short summary in Description, full content in Details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full text-white space-y-8 mx-auto mt-8">
            <div className="rounded-xl border border-gray-800 bg-[#111111] p-4 md:p-6 space-y-5">
              <h4 className="text-lg font-semibold">Basic Info</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                <div className="space-y-1">
                  <label className="block text-sm font-medium">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="topic"
                    className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
                    value={formData.topic}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="space-y-1"><label className="block text-sm font-medium">Episode number</label><input type="number" min="1" step="1" name="episodeNumber" value={formData.episodeNumber} onChange={handleChange} placeholder="24" className="w-full rounded-lg border border-gray-700 bg-[#1c1c1c] p-3 text-white" /></div>
                <div className="space-y-1"><label className="block text-sm font-medium">Publication date</label><input type="date" name="publishedDate" value={formData.publishedDate} onChange={handleChange} className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700" /></div>
                <div className="space-y-1"><label className="block text-sm font-medium">Duration (minutes)</label><input type="number" min="0" step="1" value={formData.duration || ""} onChange={(event) => setFormData((current) => ({ ...current, duration: Number(event.target.value), durationInSec: Number(event.target.value) * 60 }))} className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700" /></div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  rows="4"
                  maxLength={DESCRIPTION_LIMIT}
                  placeholder={`Short summary (max ${DESCRIPTION_LIMIT} characters). Full description Details me daalein.`}
                  className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white resize-none"
                  value={formData.description}
                  onChange={handleChange}
                />
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Max {DESCRIPTION_LIMIT} characters</span>
                  <span className={formData.description.length >= DESCRIPTION_LIMIT ? "text-yellow-400" : ""}>
                    {formData.description.length}/{DESCRIPTION_LIMIT}
                  </span>
                </div>
              </div>
            </div>

            <SeoFields formData={formData} onChange={handleChange} />

            <HostSelector hosts={hosts} selected={formData.hostSlugs} onChange={(hostSlugs) => setFormData((current) => ({ ...current, hostSlugs }))} guestSelected={formData.guestHostSlugs} onGuestChange={(guestHostSlugs) => setFormData((current) => ({ ...current, guestHostSlugs }))} />
            <EpisodeRelationsFields formData={formData} episodes={episodes} currentUuid={id} onChange={setFormData} />
            <EpisodeHeroPhoneFields formData={formData} onChange={setFormData} />

            <div className="rounded-xl border border-gray-800 bg-[#111111] p-4 md:p-6 space-y-5">
              <h4 className="text-lg font-semibold">Media</h4>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
                    className="relative w-full h-[320px] bg-[#1c1c1c] border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center text-gray-400 cursor-pointer hover:border-white transition"
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

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Homepage hero image <span className="text-gray-400">(optional)</span></label>
                  <p className="text-xs text-gray-400">Used only for this episode when it appears in the homepage hero. The RSS artwork is used when this is empty.</p>
                  <div className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-gray-600 bg-[#1c1c1c] text-gray-400 transition hover:border-white">
                    {homepageThumbnailPreview ? (
                      <img src={homepageThumbnailPreview} alt="Homepage hero preview" className="h-full w-full rounded object-cover" />
                    ) : (
                      <p className="absolute inset-0 grid place-items-center px-4 text-center text-sm">Click to upload a separate homepage hero image</p>
                    )}
                    <input type="file" name="homepageThumbnail" accept="image/*" onChange={handleChange} className="absolute inset-0 cursor-pointer opacity-0" />
                  </div>
                </div>

                <div className="space-y-2 lg:col-span-2">
                  <label className="block text-sm font-medium">Website card thumbnail <span className="text-gray-400">(optional)</span></label>
                  <p className="text-xs text-gray-400">Used only on episode cards—never in the homepage hero, episode detail page, players, search results or RSS. Recommended: 1600 × 900 px; any 16:9 image at least 1280 × 720 px is accepted. The RSS artwork is the fallback when empty.</p>
                  <div className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-gray-600 bg-[#1c1c1c] text-gray-400 transition hover:border-white lg:max-w-[calc(50%-0.625rem)]">
                    {websiteThumbnailPreview ? (
                      <img src={websiteThumbnailPreview} alt="Website card thumbnail preview" className="h-full w-full rounded object-cover" />
                    ) : (
                      <p className="absolute inset-0 grid place-items-center px-4 text-center text-sm">Click to upload an episode-card thumbnail</p>
                    )}
                    <input type="file" name="websiteThumbnail" accept="image/*" onChange={handleChange} className="absolute inset-0 cursor-pointer opacity-0" />
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Episode File <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-400">
                      Upload video or audio file
                    </p>
                    <input
                      type="file"
                      name="video"
                      accept="video/*,audio/*"
                      onChange={handleChange}
                      className="w-full h-fit text-sm text-gray-400 file:bg-white file:text-black file:rounded-lg file:px-4 file:py-2 border border-gray-700 bg-[#1c1c1c]"
                    />
                    {uploadingVideo && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <progress className="w-full" value={uploadProgress} max="100"></progress>
                      </div>
                    )}
                    {uploadedFileUrl && (
                      <div className="text-green-400 text-sm">File uploaded ✔</div>
                    )}
                    {typeof formData.video === "string" && (
                      <video controls className="mt-2 w-full max-h-96 rounded-lg">
                        <source src={data?.link} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>

                </div>
              </div>
                  <div className="mt-4 space-y-3">
                    <label className="block text-sm font-medium">Audio</label>
                    <p className="text-xs text-gray-400">
                      Optional separate audio (if needed)
                    </p>
                    <input
                      type="file"
                      name="audio"
                      accept="audio/*"
                      onChange={handleChange}
                      className="w-full text-sm text-gray-400 file:bg-white file:text-black file:rounded-lg file:px-4 file:py-2 border border-gray-700 bg-[#1c1c1c]"
                    />

                    {uploadingAudio && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Uploading...</span>
                          <span>{audioUploadProgress}%</span>
                        </div>
                        <progress className="w-full" value={audioUploadProgress} max="100"></progress>
                      </div>
                    )}

                    {uploadedAudioUrl && (
                      <div className="text-green-400 text-sm">
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
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#111111] p-4 md:p-6 space-y-5">
              <h4 className="text-lg font-semibold">Full Content</h4>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Details
                </label>
                <RichTextEditor
                  label="details"
                  desc={formData?.details}
                  handleBioChange={(val) => handleQuillChange('details', val)}
                />
              </div>

            </div>

            <EpisodeContentFields
              formData={formData}
              onChange={handleChange}
              onTranscriptChange={(value) => setFormData((prev) => ({ ...prev, transcript: value }))}
              transcription={{ status: data?.transcriptStatus, error: data?.transcriptError, generatedAt: data?.transcriptGeneratedAt }}
              onRegenerate={handleRegenerateTranscript}
              regenerating={regeneratingTranscript}
            />

            <div className="rounded-xl border border-gray-800 bg-[#111111] p-4 md:p-6 space-y-5">
              <h4 className="text-lg font-semibold">Platforms</h4>

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
        </div>
      </div>
      )}
    </AdminLayout>
  );
}
