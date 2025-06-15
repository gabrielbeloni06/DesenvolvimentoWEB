document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('graficoFilmes');
  if (!canvas) {
    console.error('Canvas com ID "graficoFilmes" não encontrado.');
    return;
  }
  const ctx = canvas.getContext('2d');
  console.log('Canvas encontrado, iniciando gráfico...');

  Chart.register(ChartDataLabels);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [
        'Minecraft: O Filme',
        'A Presença',
        'Five Nights at Freddy\'s',
        'Avatar 2',
        'Interestelar'
      ],
      datasets: [{
        label: 'Nota média',
        data: [7.2, 6.8, 7.5, 8.4, 9.1],
        backgroundColor: [
          '#4CAF50',
          '#FF5722',
          '#3F51B5',
          '#009688',
          '#FFC107'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          ticks: {
            color: '#eee'
          }
        },
        x: {
          ticks: {
            color: '#eee'
          }
        }
      },
      plugins: {
        datalabels: {
          color: '#eee',
          anchor: 'end',
          align: 'top',
          font: {
            weight: 'bold',
            size: 12
          },
          formatter: (value, context) => context.chart.data.labels[context.dataIndex]
        },
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: context => `Nota: ${context.parsed.y}`
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
});