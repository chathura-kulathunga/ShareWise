// Function to create contribution inputs dynamically based on people count
function createContributionInputs(count) {
  const container = document.getElementById('contributionsArea');
  container.innerHTML = ''; // Clear previous inputs

  for (let i = 1; i <= count; i++) {
    const div = document.createElement('div');
    div.className = 'mb-3';

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
      let html = '<h4>Profit Sharing Result</h4>';
      html += `<p><strong>Total Profit:</strong> ${data.totalProfit.toFixed(2)} LKR</p>`;
      html += '<ul class="list-group">';

      data.shares.forEach((share, index) => {
        html += `<li class="list-group-item">Person ${index + 1}: ${share.toFixed(2)} LKR</li>`;
      });
      html += '</ul>';

      resultArea.innerHTML = html;
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
