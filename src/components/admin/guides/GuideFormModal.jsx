import Modal from "@/components/ui/Modal";
import PodcastApi from "@/services/podcastApi";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function GuideFormModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    guide: "",
    thumbnail: null,
    language: "",
    pages: "",
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

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
    } else if (name === "file" && files?.[0]) {
      console.log("files",files);
      const file = files[0];
      if (!file.type.startsWith("application/pdf")) {
        toast.error("Only video or audio files allowed");
        return;
      }
      setFormData((prev) => ({ ...prev, guide: file }));
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
    console.log("formdata", formData);
    if (loading) return;
    setLoading(true);
    try {
      const main = new PodcastApi();
      const payload = new FormData();
      const languageArray = formData.language
        ? formData.language.split(",").map((l) => l.trim())
        : [];
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("author", formData?.author);
      payload.append("language", JSON.stringify(languageArray));
      payload.append("pages", formData?.pages);
      if (formData.thumbnail) payload.append("thumbnail", formData.thumbnail);
      if (formData.guide) payload.append("guide", formData.guide);
      const response = await main.GuideAdd(payload);
      if (response?.data?.status) {
        toast.success(response.data.message);
        setFormData({
          title: "",
          description: "",
          author: "",
          guide: "",
          thumbnail: null,
          language: "",
          pages: "",
        });
        setThumbnailPreview(null);
        // fetchDetails(podcast?.uuid);
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="max-w-lg">
      <form onSubmit={handleSubmit} className=" w-full text-white">
        <h3 className="text-3xl font-bold text-center heading">Add Guide</h3>
        <div className="space-y-6">
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

          {/* Author */}
          <div className="space-y-1">
            <label className="block text-sm font-medium">
              Author<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="author"
              className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              value={formData.author}
              onChange={handleChange}
            />
          </div>

          {/* Language */}
          <div className="space-y-1">
            <label className="block text-sm font-medium">
              Language{" "}
              <span className="text-xs text-gray-400">(Comma-separated)</span>
            </label>
            <input
              type="text"
              name="language"
              className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              value={formData.language}
              onChange={handleChange}
            />
          </div>

          {/* Pages */}
          <div className="space-y-1">
            <label className="block text-sm font-medium">
              Pages<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pages"
              className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              value={formData.pages}
              onChange={(e) => {
                if (
                  e.target.value.length <= 3 &&
                  /^[0-9]*$/.test(e.target.value)
                ) {
                  handleChange(e);
                }
              }}
            />
          </div>

          {/* Thumbnail Uploader */}
          <div className="space-y-2">
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

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="4"
              name="description"
              className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* File */}
          <div className="space-y-1">
            <label className="block text-sm font-medium">
              File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="file"
              accept="application/pdf"
              onChange={handleChange}
              className="w-full text-sm text-gray-400 file:bg-white file:text-black file:rounded-lg file:px-4 file:py-2 border border-gray-700 bg-[#1c1c1c]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full button-bg font-semibold py-3 rounded-lg transition cursor-pointer"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
