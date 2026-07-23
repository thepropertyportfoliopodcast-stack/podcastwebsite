import React, { useEffect, useState } from "react";
import Popup from "@/common/Popup";
import toast from "react-hot-toast";
import Listing from "@/pages/api/Listing";
import SeoFields from "@/common/SeoFields";

export default function AddEpisode({
  isOpen,
  onClose,
  podcast,
  fetchDetails,
  selectedEpisode,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    seoTitle: "",
    seoDescription: "",
    primaryKeyword: "",
    secondaryKeywords: "",
    thumbnail: null,
    video: null,
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  // console.log("podcast", podcast);

  useEffect(() => {
    setFormData({
      title: selectedEpisode?.title || "",
      description: selectedEpisode?.description || "",
      seoTitle: selectedEpisode?.seoTitle || "",
      seoDescription: selectedEpisode?.seoDescription || "",
      primaryKeyword: selectedEpisode?.primaryKeyword || "",
      secondaryKeywords: selectedEpisode?.secondaryKeywords || "",
      thumbnail: selectedEpisode?.thumbnail || null,
      video: selectedEpisode?.link || null,
    });

    if (selectedEpisode?.thumbnail) {
      setThumbnailPreview(selectedEpisode.thumbnail);
      return;
    }
    setThumbnailPreview(null);
  }, [selectedEpisode]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "thumbnail" && files?.[0]) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files allowed");
        return;
      }
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      setThumbnailPreview(URL.createObjectURL(file));
    } else if (name === "video" && files?.[0]) {
      const file = files[0];
      if (!file.type.startsWith("video/") && !file.type.startsWith("audio/")) {
      toast.error("Only video or audio files allowed");
      return;
      }
      setFormData((prev) => ({ ...prev, video: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      toast.error("Only image files are allowed");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const main = new Listing();
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("seoTitle", formData.seoTitle);
      payload.append("seoDescription", formData.seoDescription);
      payload.append("primaryKeyword", formData.primaryKeyword);
      payload.append("secondaryKeywords", formData.secondaryKeywords);
      payload.append("podcastId", podcast?.id);
      if (formData.thumbnail) payload.append("thumbnail", formData.thumbnail);
      if (formData.video) payload.append("video", formData.video);
      let size = 0;
      if (formData.video) {
        size = Number((formData.video.size / (1024 * 1024)).toFixed(2)) || 0;
      }
      payload.append("size", size);
      const response = await main.EpisodeAdd(payload);

      if (response?.data?.status) {
        toast.success(response.data.message);
        setFormData({
          title: "",
          description: "",
          thumbnail: null,
          video: null,
        });
        setThumbnailPreview(null);
        fetchDetails(podcast?.uuid);
        onClose();
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const main = new Listing();
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("seoTitle", formData.seoTitle);
      payload.append("seoDescription", formData.seoDescription);
      payload.append("primaryKeyword", formData.primaryKeyword);
      payload.append("secondaryKeywords", formData.secondaryKeywords);
      payload.append("podcastId", podcast?.id);
      if (formData.thumbnail instanceof File) {
        payload.append("thumbnail", formData.thumbnail);
      }
      if (formData.video instanceof File) {
        payload.append("video", formData.video);
      }
      if (formData.video instanceof File) {
        let size = Number((formData.video.size / (1024 * 1024)).toFixed(2)) || 0;
        payload.append("size", size);
      }
      const response = await main.EpisodeUpdate(selectedEpisode?.uuid, payload);

      if (response?.data?.status) {
        toast.success(response.data.message);
        setFormData({
          title: "",
          description: "",
          thumbnail: null,
          video: null,
        });
        setThumbnailPreview(null);
        fetchDetails(podcast?.uuid);
        onClose();
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

  // console.log("formData",formData);

  return (
    <Popup isOpen={isOpen} onClose={onClose} size="max-w-lg">
      <form onSubmit={selectedEpisode ? handleUpdate : handleSubmit} className="w-full text-white space-y-6">
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

        <SeoFields formData={formData} onChange={handleChange} />

        {/* Thumbnail */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Thumbnail <span className="text-red-500">*</span>
          </label>
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
            className="w-full text-sm text-gray-400 file:bg-white file:text-black file:rounded-lg file:px-4 file:py-2 border border-gray-700 bg-[#1c1c1c]"
          />
          {typeof formData.video === "string" && selectedEpisode && (
            <video controls className="mt-2 w-full rounded-lg">
              <source src={selectedEpisode.link} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full button-bg font-semibold py-3 rounded-lg transition cursor-pointer"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </Popup>
  );
}
