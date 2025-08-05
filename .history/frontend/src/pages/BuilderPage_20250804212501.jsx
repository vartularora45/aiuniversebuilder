import React, { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

const ToolBlock = ({ id, label }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-4 m-2 bg-purple-500 text-white rounded-lg cursor-grab shadow-md w-40 text-center"
    >
      {label}
    </div>
  );
};

const DropZone = ({ onDrop, droppedBlocks }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "dropzone",
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[300px] p-6 border-4 border-dashed rounded-xl transition-all duration-200 ${
        isOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <h2 className="text-xl font-bold mb-4 text-white">Drop your flow blocks here 👇</h2>
      <div className="flex flex-wrap gap-4">
        {droppedBlocks.map((block, index) => (
          <div
            key={index}
            className="bg-gray-800 text-white px-4 py-2 rounded shadow-lg"
          >
            {block}
          </div>
        ))}
      </div>
    </div>
  );
};

const BuilderPage = () => {
  const [droppedBlocks, setDroppedBlocks] = useState([]);

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (over && over.id === "dropzone") {
      setDroppedBlocks([...droppedBlocks, active.id]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-8 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
        AI Tool Drag & Drop Builder
      </h1>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex justify-center gap-10 flex-wrap">
          {/* Draggable Tool Blocks */}
          <div className="flex flex-col gap-4">
            <ToolBlock id="Ask Fees → Show Fee Details" label="Ask Fees → Show Fee Details" />
            <ToolBlock id="Ask Hostel → Show Hostel Info" label="Ask Hostel → Show Hostel Info" />
            <ToolBlock id="Ask Course → Show Course Info" label="Ask Course → Show Course Info" />
            <ToolBlock id="Ask Placement → Show Placement Stats" label="Ask Placement → Show Placement Stats" />
          </div>

          {/* Drop Zone */}
          <DropZone droppedBlocks={droppedBlocks} />
        </div>
      </DndContext>
    </div>
  );
};

export default BuilderPage;
