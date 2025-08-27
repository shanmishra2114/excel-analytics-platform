import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Download, Trash2, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RecentChartsProps {
  limit?: number;
}

export const RecentCharts: React.FC<RecentChartsProps> = ({ limit }) => {
  const { savedCharts } = useSelector((state: RootState) => state.chart);
  
  const displayedCharts = limit ? savedCharts.slice(0, limit) : savedCharts;

  if (displayedCharts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No charts created yet</p>
        <p className="text-sm">Create your first chart from uploaded data</p>
      </div>
    );
  }

  const getChartIcon = (type: string) => {
    switch (type) {
      case '3d-bar':
      case '3d-scatter':
        return '🎲';
      case 'pie':
        return '🥧';
      case 'line':
        return '📈';
      case 'scatter':
        return '🔴';
      case 'area':
        return '🌊';
      default:
        return '📊';
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

  return (
    <div className="space-y-4">
      {displayedCharts.map((chart) => (
        <div
          key={chart.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="flex-shrink-0 text-2xl">
              {getChartIcon(chart.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" title={chart.title}>
                {chart.title}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline">
                  {getChartTypeLabel(chart.type)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {chart.xAxis} vs {chart.yAxis}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(chart.createdAt), { addSuffix: true })}
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