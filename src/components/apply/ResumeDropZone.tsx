import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle } from 'lucide-react';

interface ResumeDropZoneProps {
  onFileSelect: (file: File) => void;
}

export const ResumeDropZone: React.FC<ResumeDropZoneProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div className="mb-8">
      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2 block">
        Neural Uplink (Resume)
      </label>
      <input 
        type="file" 
        accept="application/pdf"
        className="hidden" 
        ref={fileInputRef}
        onChange={handleChange}
      />
      <motion.div 
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        animate={{
          borderColor: isDragging || fileName ? '#f97316' : '#27272a',
          boxShadow: isDragging || fileName ? '0 0 20px rgba(249,115,22,0.2)' : 'none'
        }}
        className="relative flex flex-col items-center justify-center p-12 border-2 border-dashed bg-zinc-950 transition-colors cursor-pointer rounded-none"
      >
        {fileName ? (
           <CheckCircle className="w-8 h-8 mb-4 text-emerald-400" />
        ) : (
           <UploadCloud className={`w-8 h-8 mb-4 transition-colors ${isDragging ? 'text-orange-500' : 'text-zinc-600'}`} />
        )}
        <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
          {fileName ? fileName : (isDragging ? 'Drop Payload Here' : 'Drag & Drop Secure Payload')}
        </span>
        <span className="font-mono text-[10px] text-zinc-600 mt-2 uppercase">PDF (Max 5MB)</span>
      </motion.div>
    </div>
  );
};
