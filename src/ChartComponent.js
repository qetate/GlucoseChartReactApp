import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartComponent = ({ data }) => {
    const graphData = data && data.graphData;
    if (!Array.isArray(graphData) || graphData.length === 0) {
      return null;
    }

    // Extract timestamps and glucose values from graph data
    const timestamps = graphData.map((point) => new Date(point.Timestamp));
    const glucoseValues = graphData.map((point) => point.Value);

    // Calculate the start time for the last 12 hours
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

    // Filter graph data for the last 12 hours
    const last12HoursData = graphData.filter((point) => new Date(point.Timestamp) >= twelveHoursAgo);

    // Calculate average glucose level for the last 12 hours
    const averageGlucose = last12HoursData.reduce((sum, point) => sum + point.Value, 0) / last12HoursData.length;

    const chartData = {
      labels: timestamps,
      datasets: [
        {
          label: 'CGM Data',
          data: graphData.map((point) => ({ x: new Date(point.Timestamp), y: point.Value })),
          borderColor: graphData.map((point) => {
            return point.Value >= 70 && point.Value <= 180 ? 'rgba(0, 128, 0, 1)' : 'rgba(255, 0, 0, 1)';
          }),
          backgroundColor: 'transparent',
          fill: false,
        },
      ],
    };

    const options = {
        scales: {
        x: {
            type: 'time',
            time: {
            unit: 'hour',
            displayFormats: {
                hour: 'HH:mm'
            },
            tooltipFormat: 'PPpp',
            },
            title: {
            display: true,
            text: 'Time',
            },
            ticks: {
            autoSkip: true,
            maxTicksLimit: 12,
            source: 'auto',
            },
            min: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            max: new Date().toISOString(),
        },
        y: {
            min: 40,
            max: 400,
            title: {
            display: true,
            text: 'Glucose Level (mg/dL)',
            },
        },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: '100vw', height: '600px', margin: '0 auto', padding: '20px' }}>
          <div style={{ width: '90%', height: '100%', margin: '0 auto' }}>
            <p>Average Glucose (Last 12 Hours): {averageGlucose.toFixed(2)} mg/dL</p>
            <Line data={chartData} options={options} />
          </div>
        </div>
      );
};

export default ChartComponent;