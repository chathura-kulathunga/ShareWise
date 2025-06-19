<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ShareWise – Smart Profit Sharing</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
  <link rel="stylesheet" href="assets/css/style.css" />
</head>

<body>
  <div class="container py-5">
    <div class="d-flex justify-content-end mb-3">
  <button id="modeToggle" class="btn btn-outline-dark">🌙 Dark Mode</button>
</div>

    <h1 class="text-center mb-4 text-primary fw-bold">ShareWise</h1>
    <p class="text-center mb-5 text-muted">Smart profit sharing calculator for partners</p>

    <form id="profitForm">
      <div class="mb-3">
        <label for="peopleCount" class="form-label">Number of People</label>
        <input type="number" class="form-control" id="peopleCount" name="peopleCount" min="2" max="10" value="2" required />
      </div>

      <div id="contributionsArea" class="mb-3">
        <!-- Contributions inputs added by JS -->
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="purchasePrice" class="form-label">Purchase Price (LKR)</label>
          <input type="number" class="form-control" id="purchasePrice" name="purchasePrice" required />
        </div>
        <div class="col-md-6 mb-3">
          <label for="salePrice" class="form-label">Sale Price (LKR)</label>
          <input type="number" class="form-control" id="salePrice" name="salePrice" required />
        </div>
      </div>

      <div class="mb-3">
        <label for="commission" class="form-label">Commission (%)</label>
        <input type="number" class="form-control" id="commission" name="commission" placeholder="Optional" />
      </div>

      <div class="mb-3">
        <label class="form-label">Sharing Method</label>
        <div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              name="shareType"
              id="byContribution"
              value="contribution"
              checked />
            <label class="form-check-label" for="byContribution">By Contribution</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              name="shareType"
              id="byPercentage"
              value="percentage" />
            <label class="form-check-label" for="byPercentage">By Percentage</label>
          </div>
        </div>
      </div>

      <!-- <button type="submit" class="btn btn-primary w-100">Calculate Profit</button> -->
      <div class="d-flex gap-2">
        <button type="button" id="clearBtn" class="btn btn-secondary w-100">Clear All</button>
        <button type="submit" class="btn btn-primary w-100">Calculate Profit</button>
      </div>

    </form>

    <div id="resultArea" class="mt-4"></div>
  </div>

  <script src="assets/js/script.js"></script>
</body>

</html>