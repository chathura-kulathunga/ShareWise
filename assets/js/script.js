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
document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('profitForm').reset();
  createContributionInputs(parseInt(document.getElementById('peopleCount').value));
  document.getElementById('resultArea').innerHTML = '';
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
