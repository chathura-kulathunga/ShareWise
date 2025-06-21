// Function to create contribution inputs dynamically based on people count
function createContributionInputs(count) {
  const container = document.getElementById('contributionsArea');
  container.innerHTML = ''; // Clear previous inputs

  for (let i = 1; i <= count; i++) {
    const div = document.createElement('div');
    div.className = 'mb-3 animate__animated animate__fadeInUp animate__faster';

    const label = document.createElement('label');
    label.className = 'form-label';
    label.htmlFor = 'contribution' + i;
    label.innerText = `Contribution of Person ${i} (LKR)`;

    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'form-control';
    input.id = 'contribution' + i;
    input.name = 'contribution' + i;  // This is VERY important for PHP to receive
    input.min = 0;
    input.required = true;
    //input.value = 0;

    div.appendChild(label);
    div.appendChild(input);
    container.appendChild(div);
  }
}

// Initialize contributions inputs on page load
document.addEventListener('DOMContentLoaded', () => {
  const peopleCountInput = document.getElementById('peopleCount');
  createContributionInputs(parseInt(peopleCountInput.value));

  // Update contributions inputs if people count changes
  peopleCountInput.addEventListener('input', () => {
    const count = parseInt(peopleCountInput.value);
    if (count >= 2 && count <= 10) {
      createContributionInputs(count);
    }
  });
});

// Handle form submit
document.getElementById('profitForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Optional: Add a loader or disable button here

  try {
    const response = await fetch('calculate.php', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    const resultArea = document.getElementById('resultArea');

    if (data.error) {
      resultArea.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
    } else {
      // Build results HTML here — example:
      let html = '<h4 class="animate__animated animate__fadeInDown">Profit Sharing Result</h4>';
      html += `<p class="animate__animated animate__fadeIn animate__delay-1s"><strong>Total Profit:</strong> ${data.totalProfit.toFixed(2)} LKR</p>`;

      if (data.commission && data.commission > 0) {
        html += `<p class="animate__animated animate__fadeIn animate__delay-2s text-info">
    <strong>Commission Deducted:</strong> ${data.commission}% 
    <span class="text-muted">(${data.commissionAmount.toFixed(2)} LKR)</span>
    </p>`;
      }

      html += '<ul class="list-group mt-3">';

      data.shares.forEach((share, index) => {
        html += `<li class="list-group-item animate__animated animate__fadeInUp">
    <strong>Contributor Person ${index + 1}:</strong> ${share.toFixed(2)} LKR
  </li>`;
      });

      html += '</ul>';
      document.getElementById('resultArea').innerHTML = html;

    }
  } catch (error) {
    document.getElementById('resultArea').innerHTML = `<div class="alert alert-danger">Error calculating profit.</div>`;
    console.error('Error:', error);
  }
});

// Handle Clear All button
document.getElementById("clearBtn").addEventListener("click", function () {
  // 1. Clear form fields
  document.getElementById("profitForm").reset();

  // 2. Clear result text
  const resultArea = document.getElementById("resultArea");
  resultArea.innerHTML = "";

  // 3. Reset contributions inputs
  createContributionInputs(parseInt(document.getElementById('peopleCount').value));

  // 4. Destroy chart if exists
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});

// Dark/Light mode toggle
document.getElementById('modeToggle').addEventListener('click', () => {
  const body = document.body;
  body.classList.toggle('dark-mode');

  const isDark = body.classList.contains('dark-mode');
  const toggleBtn = document.getElementById('modeToggle');
  toggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  toggleBtn.classList.toggle('btn-outline-light');
  toggleBtn.classList.toggle('btn-outline-dark');
});

// Chart Generating
let chartInstance = null; // for re-using chart if already exists

document.getElementById("profitForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  fetch("calculate.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      const resultArea = document.getElementById("resultArea");
      resultArea.innerHTML = "";

      if (data.error) {
        resultArea.innerHTML = `<div class="text-danger">${data.error}</div>`;
        if (chartInstance) {
          chartInstance.destroy();
        }
        return;
      }

      const { totalProfit, shares, commission, commissionAmount } = data;

      let output = `<div class="text-info">Total Profit: ${totalProfit.toFixed(2)} LKR</div>`;
      if (commission > 0) {
        output += `<div class="text-info">Commission (${commission}%): ${commissionAmount.toFixed(2)} LKR</div>`;
      }

      shares.forEach((share, index) => {
        output += `<div class="text-info">Person ${index + 1}: ${share.toFixed(2)} LKR</div>`;
      });

      resultArea.innerHTML = output;

      // Scroll to chart area
      document.getElementById("profitChart").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });


      // ======================
      // Draw the chart with commission included
      // ======================

      const ctx = document.getElementById("profitChart").getContext("2d");

      // Destroy previous chart if exists
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Labels & Data Arrays
      const labels = shares.map((_, i) => `Person ${i + 1}`);
      const dataPoints = [...shares];

      if (commissionAmount > 0) {
        labels.push("Commission");
        dataPoints.push(commissionAmount);
      }

      // Color Variety for each person + Orange for Commission
      const baseColors = [
        "#007bff", "#6610f2", "#6f42c1", "#e83e8c", "#ff6347",
        "#fd7e14", "#ffc107", "#28a745", "#20c997", "#17a2b8"
      ];

      const colors = labels.map((label, i) =>
        label === "Commission" ? "#dc3545" : baseColors[i % baseColors.length]
      );

      // Add shadow to bars (fake 3D)
      Chart.defaults.elements.bar.backgroundColor = "#007bff"; // default fallback
      Chart.defaults.elements.bar.borderSkipped = false;

      Chart.register({
        id: "shadowBar",
        beforeDraw: (chart) => {
          const ctx = chart.ctx;
          const _fill = ctx.fill;

          ctx.fill = function () {
            ctx.save();
            ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 4;
            ctx.shadowOffsetY = 4;
            _fill.apply(this, arguments);
            ctx.restore();
          };
        }
      });

      // Chart.js Setup
      chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Profit Share & Commission (LKR)",
              data: dataPoints,
              backgroundColor: colors,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context) => `LKR ${context.parsed.y.toFixed(2)}`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Amount (LKR)",
              },
            },
          },
        },
      });
    })
    .catch((err) => {
      document.getElementById("resultArea").innerHTML =
        `<div class="text-danger">Error calculating profit.</div>`;
      console.error(err);
    });
});
