import { Chart, ChartOptions, PolarAreaControllerChartOptions } from 'chart.js';
import { useEffect, useRef } from 'react';

import '../styles/gchart.css';

export type DatasetPolarArea = {
  label: string;
  data: number[];
  backgroundColor: string[];
};

type PolarAreaChartProps = {
  datasets: DatasetPolarArea[];
  labels: string[];
};

export const GPolarAreaChart: React.FC<PolarAreaChartProps> = (
  props: PolarAreaChartProps
) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  } as ChartOptions<'polarArea'> & PolarAreaControllerChartOptions;

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      if (ctx) {
        const config: any = {
          type: 'polarArea',
          data: {
            labels: props.labels,
            datasets: props.datasets,
          },
          options: options,
        };
        chartInstance.current = new Chart(ctx, config);
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [props.datasets, props.labels]);

  const renderLegend = () => {
    return props.labels.map((dataset, index) => (
      <div key={dataset} className="geco-polar-legend">
        <div
          className="geco-polar-legend-icon"
          style={{
            backgroundColor: props.datasets[0].backgroundColor[index],
          }}
        ></div>
        <div className="geco-polar-legend-label">{dataset}</div>
      </div>
    ));
  };

  return (
    <>
      <canvas ref={chartRef} className="geco-statistics-contacts-polar-chart" />
      ;<div className="geco-polar-legend-container">{renderLegend()}</div>
    </>
  );
};
