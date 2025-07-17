import React, { useRef, useState, useCallback } from 'react';
import styles from "./styles.module.scss";

interface DragDropUploadProps {
  onFileSelect: (files: FileList | null) => void;
  accept?: string;
  key?: string | number;
  multiple?: boolean;
  maxSize?: number; // в байтах
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  buttonText?: string;
  showProgress?: boolean;
  progress?: number;
  isLoading?: boolean;
  selectedFiles?: FileList | undefined;
}

const DragDropUpload: React.FC<DragDropUploadProps> = ({
  onFileSelect,
  accept = "*",
  key,
  multiple = false,
  maxSize,
  disabled = false,
  className = "",
  children,
  buttonText = "Выберите файл",
  showProgress = false,
  progress = 0,
  isLoading = false,
  selectedFiles: propSelectedFiles,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null); // Удален

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFiles = useCallback((files: FileList) => {
    if (maxSize) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > maxSize) {
          const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
          setError(`Файл "${files[i].name}" превышает максимальный размер ${maxSizeMB} MB`);
          return false;
        }
      }
    }
    setError(null);
    return true;
  }, [maxSize]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    
    setIsDragActive(true);
    setIsDragOver(true);
  }, [disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
      setIsDragActive(false);
    }
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    setIsDragOver(false);
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (validateFiles(files)) {
        onFileSelect(files);
      }
    }
  }, [disabled, onFileSelect, validateFiles]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (validateFiles(files)) {
        onFileSelect(files);
      }
    }
  }, [onFileSelect, validateFiles]);

  const handleButtonClick = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

//   const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
//     if (disabled) return;
//     if (e.key === 'Enter' || e.key === ' ') {
//       e.preventDefault();
//       handleButtonClick();
//     }
//   }, [disabled, handleButtonClick]);

  const handleRemoveFile = useCallback(() => {
    setError(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileSelect]);

  const getClassName = () => {
    let finalClassName = `${styles.dragDropArea} ${className}`;
    
    if (isDragActive) {
      finalClassName += ` ${styles.dragActive}`;
    }
    
    if (isDragOver) {
      finalClassName += ` ${styles.dragOver}`;
    }
    
    if (error) {
      finalClassName += ` ${styles.dragError}`;
    }
    
    return finalClassName;
  };

  // selectedFiles теперь приходит из пропсов, а не из внутреннего useState
  const selectedFiles = propSelectedFiles || null;

  return (
    <div className={styles.section}>
      <div
        className={getClassName()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
        style={{
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
        
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
          </div>
        )}
        
        {children || (
          <div className={styles.dragDropContent}>
            <div className={styles.uploadIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <p className={styles.dragDropText}>
              Перетащите файлы сюда или <span>выберите файлы</span>
            </p>
            <p className={styles.dragDropSubtext}>
              {maxSize && `Максимальный размер файла: ${formatFileSize(maxSize)}`}
            </p>
            <button
              type="button"
              className={styles.selectButton}
              onClick={handleButtonClick}
              disabled={disabled}
            >
              {buttonText}
            </button>
          </div>
        )}
        
        {showProgress && progress > 0 && (
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      
      {selectedFiles && selectedFiles.length > 0 && (
        <div className={styles.selectedFileBox}>
          <div className={styles.selectedFileInfo}>
            <div>
              {Array.from(selectedFiles).map((file, index) => (
                <div key={index}>
                  <strong>{file.name}</strong>
                  <div className={styles.fileSize}>{formatFileSize(file.size)}</div>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            className={styles.removeFileButton}
            onClick={handleRemoveFile}
          >
            Удалить
          </button>
        </div>
      )}
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
    </div>
  );
};

export default DragDropUpload;