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
  color = 'var(--flirt-surge)',
  showGrid = true 
}) => {
  // Create a light background color for the chart fill
  const getBackgroundColor = (borderColor: string) => {
    if (borderColor.includes('--flirt-surge')) {
      return 'rgba(39, 174, 96, 0.08)'; // Light green fill
    } else if (borderColor.includes('--heartline-red')) {
      return 'rgba(231, 76, 60, 0.08)'; // Light red fill
    } else if (borderColor.includes('--trust-blue')) {
      return 'rgba(41, 128, 185, 0.08)'; // Light blue fill
    } else {
      return 'rgba(39, 174, 96, 0.08)'; // Default light green
    }
  };

  const chartData = {
    labels: data.map(item => item.time),
    datasets: [
      {
        label: symbol,
        data: data.map(item => item.price),
        borderColor: color,
        backgroundColor: getBackgroundColor(color),
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: 'var(--card)',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: 'var(--card)',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'var(--card)',
        titleColor: 'var(--foreground)',
        bodyColor: 'var(--foreground)',
        borderColor: 'var(--border)',
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
          color: 'var(--border)',
          drawBorder: false,
        },
        ticks: {
          display: showGrid,
          color: 'var(--muted-foreground)',
          maxTicksLimit: 6,
        },
      },
      y: {
        display: showGrid,
        position: 'right' as const,
        grid: {
          display: showGrid,
          color: 'var(--border)',
          drawBorder: false,
        },
        ticks: {
          display: showGrid,
          color: 'var(--muted-foreground)',
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
    <div style={{ 
      height: '100%', 
      width: '100%',
      backgroundColor: 'var(--card)',
      borderRadius: '8px'
    }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StockChart; 