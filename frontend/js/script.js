document.addEventListener("DOMContentLoaded", () => {
  const peopleCountInput = document.getElementById("peopleCount");
  const contributionsArea = document.getElementById("contributionsArea");
  const form = document.getElementById("profitForm");
  const resultArea = document.getElementById("resultArea");

  function createContributionFields(count) {
    contributionsArea.innerHTML = "";
    for (let i = 1; i <= count; i++) {
      const div = document.createElement("div");
      div.classList.add("mb-3");

      div.innerHTML = `
        <label for="person${i}" class="form-label">Person ${i} Contribution (LKR)</label>
        <input type="number" class="form-control" id="person${i}" required>
      `;

      contributionsArea.appendChild(div);
    }
  }

  peopleCountInput.addEventListener("input", () => {
    const count = parseInt(peopleCountInput.value);
    if (count >= 2 && count <= 10) {
      createContributionFields(count);
    }
  });

  // Initial setup
  createContributionFields(parseInt(peopleCountInput.value));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const peopleCount = parseInt(peopleCountInput.value);
    const contributions = [];

    for (let i = 1; i <= peopleCount; i++) {
      const value = parseFloat(document.getElementById(`person${i}`).value) || 0;
      contributions.push(value);
    }

    const purchasePrice = parseFloat(document.getElementById("purchasePrice").value) || 0;
    const salePrice = parseFloat(document.getElementById("salePrice").value) || 0;
    const commission = parseFloat(document.getElementById("commission").value) || 0;

    const shareType = document.querySelector('input[name="shareType"]:checked').value;

    const data = {
      peopleCount,
      contributions,
      purchasePrice,
      salePrice,
      commission,
      shareType
    };

    try {
      const res = await fetch("http://localhost:8080/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        displayResults(result.shares, result.totalProfit);
      } else {
        resultArea.innerHTML = `<div class="alert alert-danger">${result.message}</div>`;
      }

    } catch (err) {
      console.error(err);
      resultArea.innerHTML = `<div class="alert alert-danger">Something went wrong. Please try again later.</div>`;
    }
  });

  function displayResults(shares, totalProfit) {
    let html = `<h4 class="text-success">Total Profit: LKR ${totalProfit.toFixed(2)}</h4><hr/>`;
    shares.forEach((amount, index) => {
      html += `<p><strong>Person ${index + 1}:</strong> LKR ${amount.toFixed(2)}</p>`;
    });
    resultArea.innerHTML = html;
  }
});
