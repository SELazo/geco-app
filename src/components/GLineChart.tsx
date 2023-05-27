import { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';

import '../styles/gchart.css';

type ContactGrowthChartProps = {
  data: {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    backgroundColor: string;
    borderDash?: any;
  }[];
  labels: string[];
};

export const GLineChart: React.FC<ContactGrowthChartProps> = (
  props: ContactGrowthChartProps
) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [activeDataset, setActiveDataset] = useState<number | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.clear();
          chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: props.labels,
            datasets: props.data.map((dataset, index) => {
              return {
                ...dataset,
                hidden: activeDataset !== null && activeDataset !== index,
              };
            }),
          },
          options: {
            animation: {
              duration: 1500,
            },
            font: {
              family: "'Montserrat', sans-serif",
              size: 12,
            },
            plugins: {
              legend: {
                display: false,
              },
            },
            onClick: (event, elements) => {
              if (elements && elements.length > 0) {
                const datasetIndex = elements[0].datasetIndex;
                setActiveDataset(datasetIndex);
              } else {
                setActiveDataset(null);
              }
            },
          },
        });
      }
    }
  }, [props.data, activeDataset]);

  const renderLegend = () => {
    return props.data.map((dataset, index) => (
      <div
        key={dataset.label}
        className="geco-legend"
        onClick={() => onClickLegend(index)}
      >
        <div
          className="geco-legend-icon"
          style={{ backgroundColor: dataset.backgroundColor }}
        ></div>
        <span className="geco-legend-label">{dataset.label}</span>
      </div>
    ));
  };

  const onClickLegend = (index: number) => {
    if (props.data[index]) {
      setActiveDataset(index);
    } else {
      setActiveDataset(null);
    }
    console.log(activeDataset);
  };

  return (
    <>
      <canvas ref={chartRef} className="geco-statistics-contacts-line-chart" />
      <div className="geco-legend-container">{renderLegend()}</div>
    </>
  );
};
