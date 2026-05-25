import dynamic from "next/dynamic";
import React from "react";
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const ReactQuillEditor = ({ label, desc, handleBioChange }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <div className="mb-6 [&_.ql-toolbar]:border-gray-700 [&_.ql-container]:border-gray-700 [&_.ql-toolbar]:rounded-t-md [&_.ql-container]:rounded-b-md [&_.ql-container]:min-h-[200px] [&_.ql-editor]:min-h-[160px] [&_.ql-editor]:text-white [&_.ql-toolbar_.ql-stroke]:stroke-gray-300 [&_.ql-toolbar_.ql-fill]:fill-gray-300 [&_.ql-toolbar_.ql-picker]:text-gray-300">
      <div className="rounded-md mb-5">
        <ReactQuill
          value={desc}
          onChange={handleBioChange}
          modules={modules}
          formats={formats}
          theme="snow"
          className="mb-5"
        />
      </div>
    </div>
  );
};

export default ReactQuillEditor;
