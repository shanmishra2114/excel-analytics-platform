import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import { ChartConfig } from '@/store/slices/chartSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartViewerProps {
  data: any[];
  config: ChartConfig;
}

export const ChartViewer: React.FC<ChartViewerProps> = ({ data, config }) => {
  const processedData = useMemo(() => {
    if (!data || !config.xAxis || !config.yAxis) return null;

    const filteredData = data.filter(row => 
      row[config.xAxis] !== undefined && 
      row[config.yAxis] !== undefined &&
      row[config.xAxis] !== null &&
      row[config.yAxis] !== null
    );

    const labels = filteredData.map(row => String(row[config.xAxis]));
    const values = filteredData.map(row => {
      const value = row[config.yAxis];
      return typeof value === 'number' ? value : parseFloat(value) || 0;
    });

    return { labels, values, rawData: filteredData };
  }, [data, config.xAxis, config.yAxis]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!config.title,
        text: config.title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: config.type !== 'pie' ? {
      x: {
        title: {
          display: true,
          text: config.xAxis,
        },
      },
      y: {
        title: {
          display: true,
          text: config.yAxis,
        },
      },
    } : undefined,
  };

  if (!processedData) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        No valid data to display
      </div>
    );
  }

  const generateColors = (count: number) => {
    const colors = [
      'hsl(244, 57%, 42%)',
      'hsl(142, 71%, 45%)',
      'hsl(38, 92%, 50%)',
      'hsl(0, 84%, 60%)',
      'hsl(271, 81%, 56%)',
      'hsl(204, 86%, 53%)',
      'hsl(13, 100%, 62%)',
      'hsl(159, 64%, 52%)',
    ];
    
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length]);
    }
    return result;
  };

  const chartData = {
    labels: processedData.labels,
    datasets: [
      {
        label: config.yAxis,
        data: processedData.values,
        backgroundColor: config.type === 'pie' 
          ? generateColors(processedData.labels.length)
          : 'hsla(244, 57%, 42%, 0.8)',
        borderColor: config.type === 'pie'
          ? generateColors(processedData.labels.length)
          : 'hsl(244, 57%, 42%)',
        borderWidth: config.type === 'line' ? 3 : 1,
        fill: config.type === 'area',
        tension: config.type === 'line' || config.type === 'area' ? 0.4 : undefined,
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
        label: `${config.xAxis} vs ${config.yAxis}`,
        data: processedData.rawData.map(row => ({
          x: parseFloat(row[config.xAxis]) || 0,
          y: parseFloat(row[config.yAxis]) || 0,
        })),
        backgroundColor: 'hsla(244, 57%, 42%, 0.6)',
        borderColor: 'hsl(244, 57%, 42%)',
        pointRadius: 6,
      },
    ],
  };

  // 3D Bar Chart Component
  const ThreeDBars = () => {
    const maxValue = Math.max(...processedData.values);
    const normalizedData = processedData.values.map(value => (value / maxValue) * 5);

    return (
      <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        
        {normalizedData.map((height, index) => (
          <group key={index} position={[index * 1.2 - (normalizedData.length - 1) * 0.6, 0, 0]}>
            <Box args={[0.8, height, 0.8]} position={[0, height / 2, 0]}>
              <meshStandardMaterial color="hsl(244, 57%, 42%)" />
            </Box>
            <Text
              position={[0, -0.5, 0]}
              fontSize={0.3}
              color="black"
              anchorX="center"
              anchorY="middle"
            >
              {processedData.labels[index]}
            </Text>
          </group>
        ))}
        
        <Text
          position={[0, 6, 0]}
          fontSize={0.5}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {config.title}
        </Text>
      </Canvas>
    );
  };

  // 3D Scatter Plot Component
  const ThreeDScatter = () => {
    const points = processedData.rawData.map(row => ({
      x: parseFloat(row[config.xAxis]) || 0,
      y: parseFloat(row[config.yAxis]) || 0,
      z: Math.random() * 5, // Random Z for 3D effect
    }));

    return (
      <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        
        {points.map((point, index) => (
          <Box
            key={index}
            args={[0.2, 0.2, 0.2]}
            position={[point.x / 10, point.y / 10, point.z]}
          >
            <meshStandardMaterial color="hsl(244, 57%, 42%)" />
          </Box>
        ))}
        
        <Text
          position={[0, 3, 0]}
          fontSize={0.5}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {config.title}
        </Text>
      </Canvas>
    );
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      options: chartOptions,
      height: 400,
    };

    switch (config.type) {
      case 'bar':
        return <Bar {...commonProps} />;
      case 'line':
        return <Line {...commonProps} />;
      case 'area':
        return <Line {...commonProps} />;
      case 'pie':
        return <Pie data={chartData} options={chartOptions} height={400} />;
      case 'scatter':
        return <Scatter data={scatterData} options={chartOptions} height={400} />;
      case '3d-bar':
        return (
          <div className="h-96 w-full">
            <ThreeDBars />
          </div>
        );
      case '3d-scatter':
        return (
          <div className="h-96 w-full">
            <ThreeDScatter />
          </div>
        );
      default:
        return <Bar {...commonProps} />;
    }
  };

  return (
    <div className="w-full">
      {renderChart()}
    </div>
  );
};