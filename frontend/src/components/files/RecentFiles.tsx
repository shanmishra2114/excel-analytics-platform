import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Download, Trash2, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RecentFilesProps {
  limit?: number;
}

export const RecentFiles: React.FC<RecentFilesProps> = ({ limit }) => {
  const { uploads } = useSelector((state: RootState) => state.file);
  
  const displayedFiles = limit ? uploads.slice(0, limit) : uploads;

  if (displayedFiles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No files uploaded yet</p>
        <p className="text-sm">Upload your first Excel file to get started</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'processing':
        return 'bg-warning text-warning-foreground';
      case 'error':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {displayedFiles.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" title={file.originalName}>
                {file.originalName}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className={getStatusColor(file.status)}>
                  {file.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};