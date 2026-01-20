import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Rect } from "react-konva";

export default function AnnotatePage() {
  const [imageSrc, setImageSrc] = useState(null);
  const [rectangles, setRectangles] = useState([]);
  const [newRect, setNewRect] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const stageRef = useRef();

  // Upload handler
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  // Load uploaded image
  useEffect(() => {
    if (!imageSrc) return;
    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      setImageObj(img);
      setStageSize({ width: img.width, height: img.height });
    };
  }, [imageSrc]);

  // Draw rectangle handlers
  const handleMouseDown = (e) => {
    if (!imageObj) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    setNewRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (!newRect) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const width = pos.x - newRect.x;
    const height = pos.y - newRect.y;
    setNewRect({ ...newRect, width, height });
  };

  const handleMouseUp = () => {
    if (newRect) {
      setRectangles([...rectangles, newRect]);
      setNewRect(null);
    }
  };

  // Download annotated image with high quality
  const handleDownload = () => {
    // Use a higher pixel ratio for sharp export
    const uri = stageRef.current.toDataURL({ pixelRatio: 3 });
    const link = document.createElement("a");
    link.download = "annotated-paper.png";
    link.href = uri;
    link.click();
  };

  // Reset / clear annotations
  const handleClear = () => setRectangles([]);

  return (
    <div style={{width:"100dvw",height:"100dvh", textAlign: "center", fontFamily: "sans-serif" ,display:"flex",alignItems:"center",flexDirection:"column",overflowX:"hidden"}}>
      <h2>📝 Annotate Your Exam Paper</h2>

      {/* Step 1: Upload */}
      {!imageSrc && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ margin: "20px" }}
          />
        </div>
      )}

      {/* Step 2: Annotate */}
      {imageSrc && imageObj && (
        <div style={{ marginTop: "20px" }}>
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={stageRef}
            style={{ border: "2px solid #ccc", margin: "auto", display: "block" }}
          >
            <Layer>
              <KonvaImage image={imageObj} />
              {rectangles.map((r, i) => (
                <Rect
                  key={i}
                  x={r.x}
                  y={r.y}
                  width={r.width}
                  height={r.height}
                  stroke="red"
                  strokeWidth={2}
                  
                />
              ))}
              {newRect && (
                <Rect
                  x={newRect.x}
                  y={newRect.y}
                  width={newRect.width}
                  height={newRect.height}
                  stroke="red"
                  strokeWidth={2}
                  dash={[4, 2]}
                />
              )}
            </Layer>
          </Stage>

          {/* Step 3: Actions */}
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={handleDownload}
              style={{
                padding: "10px 16px",
                background: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Download Annotated Image
            </button>

            <button
              onClick={handleClear}
              style={{
                padding: "10px 16px",
                background: "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
