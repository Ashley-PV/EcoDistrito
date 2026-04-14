// reportes.js
let reportChart;
async function loadReport() {
  const period = document.getElementById('periodReport').value;
  const summaryRes = await fetch(`/api/reportes/summary?period=${period}`);
  const summary = await summaryRes.json();
  document.getElementById('indRec').textContent = `${summary.pctReciclaje}%`;
  // eficiencia: ejemplo simple (count / expected) -> aquí no tenemos expected, muestro count
  document.getElementById('indEff').textContent = `${summary.count} recolecciones`;

  // series
  const days = period === 'monthly' ? 30 : (period === 'weekly' ? 7 : 1);
  const seriesRes = await fetch(`/api/reportes/series?days=${days}`);
  const series = await seriesRes.json();
  const labels = series.map(s => s.date);
  const data = series.map(s => s.totalKg);

  const ctx = document.getElementById('reportChart').getContext('2d');
  if (reportChart) reportChart.destroy();
  reportChart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ label:'kg recolectados', data, borderColor:'#2fa84f', backgroundColor:'rgba(47,168,79,0.12)', fill:true }] },
    options: { plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true } } }
  });
}

// Export CSV (descarga de series)
function exportCSV() {
  const period = document.getElementById('periodReport').value;
  fetch(`/api/reportes/series?days=${period==='monthly'?30:(period==='weekly'?7:1)}`)
    .then(r=>r.json())
    .then(data=>{
      let csv = 'date,totalKg,count\n';
      data.forEach(d => csv += `${d.date},${d.totalKg},${d.count}\n`);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `reportes_${period}.csv`; a.click();
      URL.revokeObjectURL(url);
    });
}

// PDF: simple impresión de la página (cliente)
function exportPDF() {
  window.print();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('periodReport').addEventListener('change', loadReport);
  document.getElementById('btnExportCSV').addEventListener('click', exportCSV);
  document.getElementById('btnExportPDF').addEventListener('click', exportPDF);
  loadReport();
});
