import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RootState, AppDispatch } from '@/store';
import { uploadFile } from '@/store/slices/fileSlice';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileSpreadsheet, X, Check } from 'lucide-react';
import * as XLSX from 'xlsx';

export const FileUpload = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isUploading, uploadProgress, error } = useSelector((state: RootState) => state.file);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFile = (file: File) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      throw new Error('Please select a valid Excel file (.xlsx, .xls) or CSV file');
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size must be less than 10MB');
    }
    
    return true;
  };

  const handleFileSelect = (file: File) => {
    try {
      validateFile(file);
      setSelectedFile(file);
    } catch (error) {
      toast({
        title: 'Invalid File',
        description: error instanceof Error ? error.message : 'Invalid file selected',
        variant: 'destructive',
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await dispatch(uploadFile(selectedFile));
      if (result.type === 'file/upload/fulfilled') {
        toast({
          title: 'Success',
          description: 'File uploaded and processed successfully',
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload file',
        variant: 'destructive',
      });
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragOver
            ? 'border-primary bg-accent/50'
            : selectedFile
            ? 'border-success bg-success/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-success">
              <Check className="h-8 w-8" />
              <FileSpreadsheet className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex justify-center space-x-2">
              <Button onClick={handleUpload} disabled={isUploading} className="bg-gradient-primary">
                {isUploading ? 'Uploading...' : 'Upload File'}
              </Button>
              <Button variant="outline" onClick={clearSelection} disabled={isUploading}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <p className="text-lg font-medium">Drop your Excel file here</p>
              <p className="text-sm text-muted-foreground">
                or click to browse files
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
            >
              Choose File
            </Button>
            <p className="text-xs text-muted-foreground">
              Supports .xlsx, .xls, and .csv files up to 10MB
            </p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
};