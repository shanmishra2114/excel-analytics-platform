import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setCurrentChart, saveChart } from '@/store/slices/chartSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChartViewer } from './ChartViewer';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, Save, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const ChartGenerator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentFile, parsedData, columns } = useSelector((state: RootState) => state.file);
  const { currentChart, isSaving } = useSelector((state: RootState) => state.chart);
  const { toast } = useToast();

  const [chartConfig, setChartConfig] = useState<{
    type: 'bar' | 'line' | 'pie' | 'scatter' | 'area' | '3d-bar' | '3d-scatter';
    xAxis: string;
    yAxis: string;
    title: string;
  }>({
    type: 'bar',
    xAxis: '',
    yAxis: '',
    title: '',
  });

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'line', label: 'Line Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'scatter', label: 'Scatter Plot' },
    { value: 'area', label: 'Area Chart' },
    { value: '3d-bar', label: '3D Bar Chart' },
    { value: '3d-scatter', label: '3D Scatter Plot' },
  ];

  useEffect(() => {
    if (currentChart) {
      setChartConfig({
        type: currentChart.type,
        xAxis: currentChart.xAxis,
        yAxis: currentChart.yAxis,
        title: currentChart.title,
      });
    }
  }, [currentChart]);

  const handleConfigChange = (field: string, value: string) => {
    const newConfig = { ...chartConfig, [field]: value };
    setChartConfig(newConfig);
    
    if (currentFile && newConfig.xAxis && newConfig.yAxis) {
      dispatch(setCurrentChart({
        ...newConfig,
        fileId: currentFile.id,
      }));
    }
  };

  const handleSaveChart = async () => {
    if (!currentFile || !chartConfig.xAxis || !chartConfig.yAxis || !chartConfig.title) {
      toast({
        title: 'Invalid Configuration',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await dispatch(saveChart({
        ...chartConfig,
        fileId: currentFile.id,
      }));
      
      if (result.type === 'chart/save/fulfilled') {
        toast({
          title: 'Success',
          description: 'Chart saved successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save chart',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadPNG = async () => {
    const chartElement = document.getElementById('chart-container');
    if (!chartElement) return;

    try {
      const canvas = await html2canvas(chartElement);
      const link = document.createElement('a');
      link.download = `${chartConfig.title || 'chart'}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast({
        title: 'Success',
        description: 'Chart downloaded as PNG',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download chart',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadPDF = async () => {
    const chartElement = document.getElementById('chart-container');
    if (!chartElement) return;

    try {
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${chartConfig.title || 'chart'}.pdf`);
      
      toast({
        title: 'Success',
        description: 'Chart downloaded as PDF',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download chart',
        variant: 'destructive',
      });
    }
  };

  if (!currentFile) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No file selected</p>
          <p className="text-sm text-muted-foreground">Upload and select a file to create charts</p>
        </CardContent>
      </Card>
    );
  }

  if (!columns.length || !parsedData.length) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Alert>
            <AlertDescription>
              No data available for chart generation. Please ensure your file contains valid data.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Chart Configuration</CardTitle>
          <CardDescription>
            Configure your chart settings for {currentFile.originalName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chart-type">Chart Type</Label>
              <Select value={chartConfig.type} onValueChange={(value) => handleConfigChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  {chartTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chart-title">Chart Title</Label>
              <Input
                id="chart-title"
                placeholder="Enter chart title"
                value={chartConfig.title}
                onChange={(e) => handleConfigChange('title', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="x-axis">X-Axis (Categories)</Label>
              <Select value={chartConfig.xAxis} onValueChange={(value) => handleConfigChange('xAxis', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select X-axis column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="y-axis">Y-Axis (Values)</Label>
              <Select value={chartConfig.yAxis} onValueChange={(value) => handleConfigChange('yAxis', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Y-axis column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button 
              onClick={handleSaveChart}
              disabled={isSaving || !chartConfig.title || !chartConfig.xAxis || !chartConfig.yAxis}
              className="bg-gradient-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Chart'}
            </Button>
            
            <Button variant="outline" onClick={handleDownloadPNG}>
              <Download className="h-4 w-4 mr-2" />
              PNG
            </Button>
            
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chart Preview */}
      {chartConfig.xAxis && chartConfig.yAxis && (
        <Card>
          <CardHeader>
            <CardTitle>Chart Preview</CardTitle>
            <CardDescription>
              Live preview of your {chartTypes.find(t => t.value === chartConfig.type)?.label}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div id="chart-container">
              <ChartViewer
                data={parsedData}
                config={{
                  ...chartConfig,
                  fileId: currentFile.id,
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};