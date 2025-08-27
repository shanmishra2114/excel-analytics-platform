import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchUserFiles } from '@/store/slices/fileSlice';
import { fetchUserCharts } from '@/store/slices/chartSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { FileUpload } from '@/components/files/FileUpload';
import { RecentFiles } from '@/components/files/RecentFiles';
import { RecentCharts } from '@/components/charts/RecentCharts';
import { UploadCloud, BarChart3, FileText, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { uploads } = useSelector((state: RootState) => state.file);
  const { savedCharts } = useSelector((state: RootState) => state.chart);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchUserFiles());
    dispatch(fetchUserCharts());
  }, [dispatch]);

  const stats = [
    {
      title: 'Total Files',
      value: uploads.length,
      description: 'Excel files uploaded',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Charts',
      value: savedCharts.length,
      description: 'Charts generated',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Success Rate',
      value: uploads.filter(f => f.status === 'completed').length + '/' + uploads.length,
      description: 'Processing success',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Upload Excel files and create beautiful charts from your data
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-medium transition-shadow" onClick={() => navigate('/files')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upload New File</CardTitle>
              <UploadCloud className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">Upload</div>
              <p className="text-xs text-muted-foreground">
                Start by uploading an Excel file
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-medium transition-shadow" onClick={() => navigate('/charts')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Create Chart</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">Generate</div>
              <p className="text-xs text-muted-foreground">
                Create charts from your data
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">Analyze</div>
              <p className="text-xs text-muted-foreground">
                Get AI-powered insights
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Upload Section */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-primary" />
                Quick Upload
              </CardTitle>
              <CardDescription>
                Upload an Excel file to get started with data visualization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload />
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Files</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/files')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <RecentFiles limit={5} />
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Charts</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/charts')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <RecentCharts limit={5} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};