"use client";
import React, { useState, useRef, useEffect } from "react";
import { MdClose, MdSave, MdDelete, MdZoomIn, MdLink } from "react-icons/md";
import { toast } from "react-toastify";

export default function HotspotEditor({ edition, pageNumber, onClose, onSave }) {
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentRect, setCurrentRect] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const containerRef = useRef(null);
  const page = edition.pages.find((p) => p.pageNumber === pageNumber);

  useEffect(() => {
    if (page?.hotspots) {
      setHotspots(page.hotspots);
    }
  }, [page]);

  const getPos = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x, y };
  };

  const handleMouseDown = (e) => {
    if (selectedHotspot !== null) return;
    setIsDrawing(true);
    setStartPos(getPos(e));
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const currentPos = getPos(e);
    setCurrentRect({
      x: Math.min(startPos.x, currentPos.x),
      y: Math.min(startPos.y, currentPos.y),
      width: Math.abs(currentPos.x - startPos.x),
      height: Math.abs(currentPos.y - startPos.y),
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    if (currentRect && currentRect.width > 1 && currentRect.height > 1) {
      const newHotspot = {
        title: "",
        coords: currentRect,
        type: "zoom",
        content: "",
        linkUrl: "",
      };
      setHotspots([...hotspots, newHotspot]);
      setSelectedHotspot(hotspots.length);
    }
    setIsDrawing(false);
    setCurrentRect(null);
  };

  const updateSelectedHotspot = (field, value) => {
    const updated = [...hotspots];
    updated[selectedHotspot] = { ...updated[selectedHotspot], [field]: value };
    setHotspots(updated);
  };

  const deleteHotspot = (index) => {
    const updated = hotspots.filter((_, i) => i !== index);
    setHotspots(updated);
    setSelectedHotspot(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/epaper/hotspots/${edition._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageNumber, hotspots }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Hotspots saved successfully");
        onSave();
      } else {
        toast.error(json.error || "Failed to save hotspots");
      }
    } catch (err) {
      toast.error("Error saving hotspots");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl flex overflow-hidden">
        {/* Visual Editor */}
        <div className="flex-1 bg-gray-200 relative overflow-auto p-8 flex items-start justify-center">
          <div 
            ref={containerRef}
            className="relative shadow-2xl bg-white cursor-crosshair select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <img 
              src={page.imageUrl} 
              alt="Page" 
              className="max-w-full h-auto pointer-events-none"
            />
            
            {/* Existing Hotspots */}
            {hotspots.map((hs, i) => (
              <div
                key={i}
                className={`absolute border-2 transition-colors ${
                  selectedHotspot === i ? "border-blue-600 bg-blue-500/30 z-10" : "border-red-500 bg-red-500/10 hover:bg-red-500/20"
                }`}
                style={{
                  left: `${hs.coords.x}%`,
                  top: `${hs.coords.y}%`,
                  width: `${hs.coords.width}%`,
                  height: `${hs.coords.height}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedHotspot(i);
                }}
              />
            ))}

            {/* Current Drawing Rect */}
            {currentRect && (
              <div
                className="absolute border-2 border-blue-600 bg-blue-500/20"
                style={{
                  left: `${currentRect.x}%`,
                  top: `${currentRect.y}%`,
                  width: `${currentRect.width}%`,
                  height: `${currentRect.height}%`,
                }}
              />
            )}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="w-80 border-l bg-gray-50 flex flex-col">
          <div className="p-4 border-b bg-white flex justify-between items-center">
            <h3 className="font-bold">Hotspot Editor</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <MdClose size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {selectedHotspot === null ? (
              <div className="text-center py-12 text-gray-500">
                <p>ক্লিক এবং ড্র্যাগ করে একটি এলাকা সিলেক্ট করুন।</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm uppercase text-gray-400">ম্যানেজ হটস্পট</h4>
                  <button 
                    onClick={() => deleteHotspot(selectedHotspot)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">টাইটেল</label>
                  <input 
                    type="text" 
                    value={hotspots[selectedHotspot].title || ""}
                    onChange={(e) => updateSelectedHotspot("title", e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">টাইপ</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateSelectedHotspot("type", "zoom")}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 border rounded text-xs font-bold transition ${
                        hotspots[selectedHotspot].type === "zoom" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600"
                      }`}
                    >
                      <MdZoomIn size={16} /> Zoom
                    </button>
                    <button 
                      onClick={() => updateSelectedHotspot("type", "link")}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 border rounded text-xs font-bold transition ${
                        hotspots[selectedHotspot].type === "link" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600"
                      }`}
                    >
                      <MdLink size={16} /> Link
                    </button>
                  </div>
                </div>

                {hotspots[selectedHotspot].type === "zoom" ? (
                  <div>
                    <label className="block text-xs font-bold mb-1">কন্টেন্ট (HTML)</label>
                    <textarea 
                      value={hotspots[selectedHotspot].content || ""}
                      onChange={(e) => updateSelectedHotspot("content", e.target.value)}
                      className="w-full h-64 px-3 py-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      placeholder="<p>খবরের বিস্তারিত এখানে লিখুন...</p>"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold mb-1">লিঙ্ক URL</label>
                    <input 
                      type="text" 
                      value={hotspots[selectedHotspot].linkUrl || ""}
                      onChange={(e) => updateSelectedHotspot("linkUrl", e.target.value)}
                      className="w-full px-3 py-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="/news/123456"
                    />
                  </div>
                )}
                
                <button 
                  onClick={() => setSelectedHotspot(null)}
                  className="w-full py-2 bg-gray-200 text-gray-700 rounded text-sm font-bold"
                >
                  সিলেকশন শেষ করুন
                </button>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition disabled:opacity-50"
            >
              <MdSave size={20} />
              {saving ? "সেভ হচ্ছে..." : "সব হটস্পট সেভ করুন"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
