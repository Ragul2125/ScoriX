import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ImageReorderPopup2({ onClose, onSave, setOpenPopUp }) {
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  // Enable mouse + touch drag sensors
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  // Handle file uploads
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const uploaded = files.map((file, idx) => ({
      id: `${file.name}-${Date.now()}-${idx}`,
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...uploaded]);
  };

  // Handle drag reorder
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Handle replace (open file input for a specific image)
  const handleReplace = (index) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const newImg = {
          id: `${file.name}-${Date.now()}`,
          url: URL.createObjectURL(file),
          file,
        };
        setImages((prev) => {
          const updated = [...prev];
          updated[index] = newImg;
          return updated;
        });
      }
    };
    fileInput.click();
  };

  // Save order (send to backend)
  // Save order (send to backend)
  const handleSave = async () => {
    if (images.length === 0) {
      alert("Please upload at least one image before saving.");
      return;
    }

    // Create a FormData object (like a normal file input)
    const formData = new FormData();
    images.forEach((img, index) => {
      formData.append("images", img.file); // 'files' can be the field name your backend expects
    });

    // Optional: Add extra metadata if needed
    // formData.append("studentId", selectedStudentId);
      formData.append("info_json", JSON.stringify({ type: "objective" }));

    console.log(formData);
    try {
      // Example POST request
      const res = await fetch(
        "https://a9b0719e2853.ngrok-free.app/process",
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.status != 200) throw new Error("Upload failed");

      const data = await res.json();
    //   console.log(data.mark);
      localStorage.setItem("total_mark", data.mark);
      console.log("✅ Uploaded successfully:", data);

      // Pass data back to parent if needed
      onSave && onSave(data);

      // Close popup
      setOpenPopUp(false);
    } catch (err) {
      console.error("❌ Upload error:", err);
    //   alert("Failed to upload images. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-40 z-50">
      <div className="bg-white rounded-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 shadow-xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Upload & Rearrange Answer Papers
        </h2>

        {/* Upload input */}
        <label className="cursor-pointer flex items-center gap-2 mb-4 text-blue-600 font-medium">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 transition">
            + Add Images
          </span>
        </label>

        {/* Images Grid */}
        {images.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((i) => i.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <SortableImage
                    key={img.id}
                    id={img.id}
                    url={img.url}
                    index={index}
                    onDelete={() => handleDelete(img.id)}
                    onReplace={() => handleReplace(index)}
                    onPreview={() => setPreviewImage(img.url)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <p className="text-gray-500 text-center py-10 border rounded-md">
            No images added yet
          </p>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-end mt-6 gap-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            onClick={() => setOpenPopUp(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={handleSave}
          >
            Upload
          </button>
        </div>
      </div>

      {/* Zoom Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}

// ----------------------
// SORTABLE IMAGE ITEM
// ----------------------
function SortableImage({ id, url, index, onDelete, onReplace, onPreview }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group cursor-grab active:cursor-grabbing border rounded-lg overflow-hidden hover:shadow-lg transition-transform duration-150 ease-in-out"
    >
      {/* Image */}
      <img
        src={url}
        alt={`Page ${index + 1}`}
        className="object-cover w-full h-40"
        onClick={onPreview}
      />

      {/* Page Number */}
      <span className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
        Page {index + 1}
      </span>

      {/* Hover Toolbar */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReplace();
          }}
          className="bg-white text-gray-700 text-xs px-2 py-1 rounded shadow hover:bg-gray-100 mr-1"
        >
          Replace
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="bg-red-500 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
