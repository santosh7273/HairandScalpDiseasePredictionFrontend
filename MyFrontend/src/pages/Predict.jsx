import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

const Predict = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleImageChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      const response = await fetch(
        "http://127.0.0.1:5000/predict_disease_and_give_assistance",
        { method: "POST", body: formData }
      );
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
            Hair and Scalp Analysis
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Upload Your Image
          </h1>
          <p className="text-slate-400 text-base">
            Our AI will analyze your Hair and scalp photo and detect possible conditions.
          </p>
        </motion.div>

        {/* Upload Card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden mb-5"
        >
          {/* Drop Zone */}
          <div
            className={`relative p-6 transition-colors duration-200 ${
              dragOver ? "bg-teal-500/5 border-teal-500/40" : ""
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-64 object-contain rounded-xl border border-slate-700"
                />
                <button
                  onClick={handleReset}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-950/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-colors duration-150"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                  <svg className="w-4 h-4 text-teal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="truncate">{image?.name}</span>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-700 hover:border-teal-500/50 rounded-xl py-12 flex flex-col items-center gap-3 transition-colors duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-teal-500/10 border border-slate-700 group-hover:border-teal-500/30 flex items-center justify-center transition-colors duration-200">
                  <svg className="w-5 h-5 text-slate-500 group-hover:text-teal-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-200">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
                </div>
              </button>
            )}

            <input
              type="file"
              id="image-upload"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={!image || loading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-semibold text-sm transition-all duration-200 shadow-lg shadow-teal-500/20 hover:shadow-teal-400/30 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Analyze Image
                </>
              )}
            </button>

            {(image || result) && (
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                Reset
              </button>
            )}
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden"
            >
              {/* Result Header */}
              <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full" />
                <h2 className="text-sm font-semibold text-white">Analysis Results</h2>
              </div>

              <div className="p-6 space-y-4">
                {Object.entries(result).map(([key, value], i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.35 }}
                    className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-4 pb-4 last:pb-0 border-b border-slate-800/60 last:border-0"
                  >
                    <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest sm:w-40 flex-shrink-0 pt-0.5">
                      {key.replaceAll("_", " ")}
                    </span>
                    <span className="text-slate-300 text-sm leading-relaxed">{value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Predict;