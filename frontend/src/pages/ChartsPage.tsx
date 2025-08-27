import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchUserCharts, deleteChart } from '@/store/slices/chartSlice';
import { fetchUserFiles } from '@/store/slices/fileSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Navbar } from '@/components/layout/Navbar';
import { ChartGenerator } from '@/components/charts/ChartGenerator';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  Plus, 
  Eye, 
  Download, 
  Trash2,
  TrendingUp,
  PieChart,
  LineChart
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const ChartsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { savedCharts, isGenerating, error } = useSelector((state: RootState) => state.chart);
  const { uploads } = useSelector((state: RootState) => state.file);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchUserCharts());
    dispatch(fetchUserFiles());
  }, [dispatch]);

  const handleDeleteChart = async (chartId: string) => {
    if (!confirm('Are you sure you want to delete this chart?')) return;
    
    try {
      const result = await dispatch(deleteChart(chartId));
      if (result.type === 'chart/delete/fulfilled') {
        toast({
          title: 'Success',
          description: 'Chart deleted successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete chart',
        variant: 'destructive',
      });
    }
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'pie':
        return PieChart;
      case 'line':
      case 'area':
        return LineChart;
      case 'bar':
      case '3d-bar':
        return BarChart3;
      default:
        return TrendingUp;
    }
  };

  const getChartTypeLabel = (type: string) => {
    switch (type) {
      case '3d-bar':
        return '3D Bar';
      case '3d-scatter':
        return '3D Scatter';
      case 'pie':
        return 'Pie Chart';
      case 'line':
        return 'Line Chart';
      case 'scatter':
        return 'Scatter Plot';
      case 'area':
        return 'Area Chart';
      case 'bar':
        return 'Bar Chart';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const completedFiles = uploads.filter(file => file.status === 'completed');
  const chartTypes = [...new Set(savedCharts.map(chart => chart.type))];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Chart Generator
          </h1>
          <p className="text-muted-foreground mt-2">
            Create beautiful charts from your Excel data
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
              <CardTitle className="text-sm font-medium">Total Charts</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{savedCharts.length}</div>
              <p className="text-xs text-muted-foreground">
                Charts created from your data
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Files</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedFiles.length}</div>
              <p className="text-xs text-muted-foreground">
                Ready for chart generation
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chart Types</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chartTypes.length}</div>
              <p className="text-xs text-muted-foreground">
                Different chart types used
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Generator */}
          <div className="lg:col-span-2">
            <ChartGenerator />
          </div>

          {/* Saved Charts */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Saved Charts</CardTitle>
              <CardDescription>
                Your previously created charts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedCharts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No charts created yet</p>
                  <p className="text-sm">Generate your first chart from uploaded data</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedCharts.slice(0, 10).map((chart) => {
                    const ChartIcon = getChartIcon(chart.type);
                    return (
                      <div
                        key={chart.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="flex-shrink-0">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <ChartIcon className="h-4 w-4 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" title={chart.title}>
                              {chart.title}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {getChartTypeLabel(chart.type)}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {chart.xAxis} vs {chart.yAxis}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(chart.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteChart(chart.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  
                  {savedCharts.length > 10 && (
                    <Button variant="outline" className="w-full">
                      View All Charts ({savedCharts.length})
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};