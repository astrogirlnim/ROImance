import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface StockData {
  time: string;
  price: number;
}

interface StockChartProps {
  data: StockData[];
  symbol: string;
  color?: string;
  showGrid?: boolean;
}

const StockChart: React.FC<StockChartProps> = ({ 
  data, 
  symbol, 
  color = '#00d4aa',
  showGrid = true 
}) => {
  const chartData = {
    labels: data.map(item => item.time),
    datasets: [
      {
        label: symbol,
        data: data.map(item => item.price),
        borderColor: color,
        backgroundColor: `${color}15`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: '#1c2536',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#2d3748',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context: any) {
            return context[0].label;
          },
          label: function(context: any) {
            return `$${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: showGrid,
        grid: {
          display: showGrid,
          color: '#2d3748',
          drawBorder: false,
        },
        ticks: {
          display: showGrid,
          color: '#64748b',
          maxTicksLimit: 6,
        },
      },
      y: {
        display: showGrid,
        position: 'right' as const,
        grid: {
          display: showGrid,
          color: '#2d3748',
          drawBorder: false,
        },
        ticks: {
          display: showGrid,
          color: '#64748b',
          callback: function(value: any) {
            return `$${value}`;
          },
        },
      },
    },
    elements: {
      point: {
        hoverRadius: 8,
      },
    },
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StockChart; 