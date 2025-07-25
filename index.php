<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ShareWise – Smart Profit Sharing</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
  <link rel="stylesheet" href="assets/css/style.css" />
  <link rel="stylesheet" href="assets/css/footer.css">
</head>

<body>

  <div class="container py-2 px-3 animate__animated animate__fadeInUp animate__faster">

    <div class="position-relative d-flex justify-content-between align-items-center mb-4 flex-wrap">
      <h1 class="m-0 text-primary fw-bold position-absolute top-50 start-50 translate-middle-x animate__animated animate__fadeInDown">
        ShareWise
      </h1>
      <p class="text-center mb-3 text-muted text-center mb-5 text-muted animate__animated animate__fadeIn animate__delay-1s">Smart profit sharing calculator for partners</p>
      <button id="modeToggle">🌙 Dark Mode</button>
    </div>

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

    <div id="resultArea" class="mt-4">
    </div>
    <canvas id="profitChart" width="400" height="200" class="mt-4"></canvas>
    <div class="text-center mt-2">
      <button id="chartModeToggle" class="btn btn-outline-primary">Switch to Advanced Chart</button>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="assets/js/script.js"></script>
  <?php include 'includes/footer.php'; ?>
</body>

</html>