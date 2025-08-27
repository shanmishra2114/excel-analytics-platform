import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchUserFiles, setCurrentFile, deleteFile } from '@/store/slices/fileSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Navbar } from '@/components/layout/Navbar';
import { FileUpload } from '@/components/files/FileUpload';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  FileSpreadsheet, 
  Upload, 
  Eye, 
  Download, 
  Trash2, 
  BarChart3,
  Calendar,
  HardDrive
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const FilesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { uploads, isUploading, error } = useSelector((state: RootState) => state.file);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchUserFiles());
  }, [dispatch]);

  const handleViewFile = (file: any) => {
    dispatch(setCurrentFile(file));
    navigate('/charts');
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const result = await dispatch(deleteFile(fileId));
      if (result.type === 'file/delete/fulfilled') {
        toast({
          title: 'Success',
          description: 'File deleted successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive',
      });
    }
  };

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

  const totalSize = uploads.reduce((sum, file) => sum + file.size, 0);
  const completedFiles = uploads.filter(file => file.status === 'completed').length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileSpreadsheet className="h-8 w-8 text-primary" />
            File Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Upload, manage, and analyze your Excel files
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uploads.length}</div>
              <p className="text-xs text-muted-foreground">
                {completedFiles} processed successfully
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Size</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
              <p className="text-xs text-muted-foreground">
                Across all uploaded files
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {uploads.length > 0 ? Math.round((completedFiles / uploads.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Processing success rate
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* File Upload */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload New File
              </CardTitle>
              <CardDescription>
                Upload Excel or CSV files to start analyzing your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload />
            </CardContent>
          </Card>

          {/* Files List */}
          <Card className="lg:col-span-2 shadow-medium">
            <CardHeader>
              <CardTitle>Your Files</CardTitle>
              <CardDescription>
                Manage and view your uploaded files
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploads.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No files uploaded yet</p>
                  <p className="text-sm">Upload your first Excel file to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {uploads.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <FileSpreadsheet className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" title={file.originalName}>
                            {file.originalName}
                          </p>
                          <div className="flex items-center space-x-3 mt-1">
                            <Badge variant="secondary" className={getStatusColor(file.status)}>
                              {file.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}
                            </span>
                          </div>
                          {file.columns && file.columns.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground">
                                Columns: {file.columns.slice(0, 3).join(', ')}
                                {file.columns.length > 3 && ` +${file.columns.length - 3} more`}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewFile(file)}
                          disabled={file.status !== 'completed'}
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};