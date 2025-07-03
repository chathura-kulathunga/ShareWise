// Create contribution inputs dynamically
function createContributionInputs(count) {
  const container = document.getElementById('contributionsArea');
  container.innerHTML = '';
  for (let i = 1; i <= count; i++) {
    const div = document.createElement('div');
    div.className = 'mb-3 animate__animated animate__fadeInUp animate__faster';
    div.innerHTML = `
      <label class="form-label" for="contribution${i}">Contribution of Person ${i} (LKR)</label>
      <input type="number" class="form-control" id="contribution${i}" name="contribution${i}" min="0" required />
    `;
    container.appendChild(div);
  }
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  const peopleCountInput = document.getElementById('peopleCount');
  createContributionInputs(parseInt(peopleCountInput.value));
  peopleCountInput.addEventListener('input', () => {
    const count = parseInt(peopleCountInput.value);
    if (count >= 2 && count <= 10) createContributionInputs(count);
  });
});

// Globals
let chartInstance = null;
let chartMode = 'simple'; // default
let lastData = null;      // store last server data

// Color palette for persons
const baseColors = [
  "#007bff", "#6610f2", "#6f42c1", "#e83e8c", "#ff6347",
  "#fd7e14", "#ffc107", "#28a745", "#20c997", "#17a2b8"
];

// Draw simple bar chart
function drawSimpleChart(labels, shares, commissionAmount) {
  if (chartInstance) chartInstance.destroy();
  const ctx = document.getElementById('profitChart').getContext('2d');
  const dataPoints = [...shares];
  const colors = [...baseColors.slice(0, shares.length)];
  if (commissionAmount > 0) {
    labels.push("Commission");
    dataPoints.push(commissionAmount);
    colors.push("#dc3545"); // red for commission
  }
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Profit Share & Commission (LKR)',
        data: dataPoints,
        backgroundColor: colors,
        borderRadius: 6
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
}

// Draw advanced line chart
function drawAdvancedChart(labels, shares, contributions) {
  if (chartInstance) chartInstance.destroy();
  const ctx = document.getElementById('profitChart').getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Contribution (LKR)',
          data: contributions,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0,123,255,0.1)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Profit Share (LKR)',
          data: shares,
          borderColor: '#28a745',
          backgroundColor: 'rgba(40,167,69,0.1)',
          fill: true,
          tension: 0.3
        }
      ]
    },
    options: { responsive: true, plugins: { legend: { display: true } }, scales: { y: { beginAtZero: true } } }
  });
}

// Submit form
document.getElementById('profitForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  try {
    const response = await fetch('calculate.php', { method: 'POST', body: formData });
    const data = await response.json();
    lastData = data; // save for toggle

    const resultArea = document.getElementById('resultArea');
    if (data.error) {
      resultArea.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
      if (chartInstance) chartInstance.destroy();
      return;
    }

    const { totalProfit, shares, commission, commissionAmount } = data;
    const peopleCount = parseInt(formData.get('peopleCount'));
    const contributions = [];
    for (let i = 1; i <= peopleCount; i++) {
      contributions.push(parseFloat(formData.get('contribution' + i)) || 0);
    }
    const labels = shares.map((_, i) => `Person ${i + 1}`);

    // Result text
    let html = `<h4>Profit Sharing Result</h4>`;
    html += `<p><strong>Total Profit:</strong> ${totalProfit.toFixed(2)} LKR</p>`;
    if (commission && commission > 0) {
      html += `<p class="text-info"><strong>Commission Deducted:</strong> ${commission}% 
        <span class="text-muted">(${commissionAmount.toFixed(2)} LKR)</span></p>`;
    }
    html += '<ul class="list-group mt-3">';
    shares.forEach((share, i) => {
      html += `<li class="list-group-item"><strong>Contributor Person ${i+1}:</strong> ${share.toFixed(2)} LKR</li>`;
    });
    html += '</ul>';
    resultArea.innerHTML = html;

    // Default draw simple chart first
    drawSimpleChart([...labels], shares, commissionAmount);
    chartMode = 'simple';
    document.getElementById('chartModeToggle').textContent = 'Switch to Advanced Chart';

    document.getElementById("profitChart").scrollIntoView({ behavior: "smooth" });

  } catch (err) {
    document.getElementById('resultArea').innerHTML = `<div class="alert alert-danger">Error calculating profit.</div>`;
    console.error(err);
  }
});

// Switch chart mode
document.getElementById('chartModeToggle').addEventListener('click', () => {
  if (!lastData) return; // no data yet
  const { shares, commissionAmount } = lastData;
  const labels = shares.map((_, i) => `Person ${i+1}`);
  const formData = new FormData(document.getElementById('profitForm'));
  const peopleCount = parseInt(formData.get('peopleCount'));
  const contributions = [];
  for (let i=1; i<=peopleCount; i++) {
    contributions.push(parseFloat(formData.get('contribution' + i)) || 0);
  }

  if (chartMode === 'simple') {
    drawAdvancedChart(labels, shares, contributions);
    chartMode = 'advanced';
    document.getElementById('chartModeToggle').textContent = 'Switch to Simple Chart';
  } else {
    drawSimpleChart([...labels], shares, commissionAmount);
    chartMode = 'simple';
    document.getElementById('chartModeToggle').textContent = 'Switch to Advanced Chart';
  }
});

// Clear button
document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("profitForm").reset();
  document.getElementById("resultArea").innerHTML = "";
  createContributionInputs(parseInt(document.getElementById('peopleCount').value));
  if (chartInstance) chartInstance.destroy();
  lastData = null;
});

// Dark mode
document.getElementById('modeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const btn = document.getElementById('modeToggle');
  btn.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});