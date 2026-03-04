import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FileUp, Image as ImageIcon, Paperclip, Trash2, X } from 'lucide-react';

function humanFileSize(size: number) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(1) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
}

type BaseProps = {
  className?: string;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  description?: string;
};

export const FileDropzoneMulti: React.FC<
  BaseProps & {
    files: File[];
    onFilesChange: (files: File[]) => void;
  }
> = ({ className = '', accept, maxSizeMB, label, description, files, onFilesChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const maxBytes = useMemo(() => (maxSizeMB ? maxSizeMB * 1024 * 1024 : undefined), [maxSizeMB]);

  const openPicker = () => inputRef.current?.click();

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const incoming = Array.from(fileList);
      const filtered = maxBytes ? incoming.filter((f) => f.size <= maxBytes) : incoming;
      onFilesChange([...(files || []), ...filtered]);
    },
    [files, maxBytes, onFilesChange]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={className}>
      {label && <p className="text-sm font-medium text-secondary mb-2">{label}</p>}
      <div
        onClick={openPicker}
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={onDrop}
        className={`group cursor-pointer relative rounded-2xl border-2 border-dashed transition-all p-6 flex items-center justify-center text-center
          ${isDragging ? 'border-primary bg-gradient-to-br from-primary/5 to-secondary/5' : 'border-lightGray hover:bg-lightGray/40'}
        `}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10 text-secondary">
            <Paperclip size={20} />
          </div>
          <div className="text-sm">
            <span className="font-medium text-secondary">Arrastra y suelta archivos</span>
            <span className="text-darkGray"> o </span>
            <span className="text-primary underline">haz clic para seleccionar</span>
          </div>
          {description && <p className="text-xs text-darkGray">{description}</p>}
          {accept && <p className="text-xs text-darkGray">Tipos permitidos: {accept}</p>}
          {maxSizeMB && <p className="text-xs text-darkGray">Tamaño máximo por archivo: {maxSizeMB}MB</p>}
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            multiple
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {(files || []).length > 0 ? (
          files.map((f, i) => {
            const isImage = f.type.startsWith('image/');
            return (
              <div key={`${f.name}-${i}`} className="flex items-center gap-3 rounded-xl border border-lightGray bg-white/80 dark:bg-dark-card/80 backdrop-blur px-3 py-2">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-lightGray/60 flex items-center justify-center shrink-0">
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                  ) : (
                    <FileUp className="text-secondary" size={18} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-secondary truncate" title={f.name}>{f.name}</p>
                  <p className="text-xs text-darkGray">{humanFileSize(f.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const next = [...files];
                    next.splice(i, 1);
                    onFilesChange(next);
                  }}
                  className="p-1 rounded-lg hover:bg-lightGray text-secondary"
                  aria-label={`Eliminar ${f.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-darkGray">No hay archivos seleccionados.</p>
        )}
      </div>
    </div>
  );
};

export const FileDropzoneSingle: React.FC<
  BaseProps & {
    file: File | null;
    onFileChange: (file: File | null) => void;
    showPreview?: boolean;
  }
> = ({ className = '', accept, maxSizeMB, label, description, file, onFileChange, showPreview = true }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const maxBytes = useMemo(() => (maxSizeMB ? maxSizeMB * 1024 * 1024 : undefined), [maxSizeMB]);

  const openPicker = () => inputRef.current?.click();

  const applyFile = (f: File | null) => {
    if (!f) return onFileChange(null);
    if (maxBytes && f.size > maxBytes) return; // silently ignore oversize
    onFileChange(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0] || null;
    applyFile(f);
  };

  return (
    <div className={className}>
      {label && <p className="text-sm font-medium text-secondary mb-2">{label}</p>}
      <div
        onClick={openPicker}
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={onDrop}
        className={`group cursor-pointer relative rounded-2xl border-2 border-dashed transition-all p-6 flex items-center justify-center text-center
          ${isDragging ? 'border-primary bg-gradient-to-br from-primary/5 to-secondary/5' : 'border-lightGray hover:bg-lightGray/40'}
        `}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10 text-secondary">
            <ImageIcon size={20} />
          </div>
          <div className="text-sm">
            <span className="font-medium text-secondary">Arrastra tu imagen de firma</span>
            <span className="text-darkGray"> o </span>
            <span className="text-primary underline">haz clic para seleccionar</span>
          </div>
          {description && <p className="text-xs text-darkGray">{description}</p>}
          {accept && <p className="text-xs text-darkGray">Tipos permitidos: {accept}</p>}
          {maxSizeMB && <p className="text-xs text-darkGray">Tamaño máximo: {maxSizeMB}MB</p>}
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={(e) => applyFile(e.target.files?.[0] || null)}
          />
        </div>
      </div>

      {file && (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-lightGray bg-white dark:bg-dark-card px-3 py-2">
          <div className="flex items-center gap-3 min-w-0">
            <ImageIcon className="text-secondary" size={16} />
            <div className="min-w-0">
              <p className="text-sm text-secondary truncate" title={file.name}>{file.name}</p>
              <p className="text-xs text-darkGray">{humanFileSize(file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onFileChange(null); }}
            className="p-1 rounded-lg hover:bg-lightGray text-secondary"
            aria-label="Eliminar archivo"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {file && showPreview && (
        <div className="mt-4">
          <p className="text-sm text-darkGray mb-2">Vista previa:</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={URL.createObjectURL(file)} alt="Firma" className="h-24 object-contain rounded-xl border border-lightGray animate-fade-in-up" />
        </div>
      )}
    </div>
  );
};
