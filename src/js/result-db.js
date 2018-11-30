const RESULT = {
  candidatesCount: [{
    id: 100,
    name: "Bill Gates",
    imgFile: "bill-gates-picture1x1.jpg",
    percent: 4
  }, {
    id: 200,
    name: "Elon Musk",
    imgFile: "elon-musk-picture1x1.jpg",
    percent: 1
  }, {
    id: 300,
    name: "Mark Zuckerberg",
    imgFile: "mark-zuckerberg-picture1x1.jpg",
    percent: 92
  }, {
    id: 400,
    name: "Steve Jobs",
    imgFile: "steve-jobs-picture1x1.jpg",
    percent: 3
  }],
  totalVotes: 40,
};

function compare(a, b) {
  if (a.percent === b.percent) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
  }
  if (a.percent < b.percent) return 1;
  if (a.percent > b.percent) return -1;
  return 0;
}

async function setPercentage(candidate, place) {
  const index = place - 1;
  $(`#divPercent${place}`).width(`${candidate.percent}%`)
}

$(document).ready(function() {
  let candidatesSort = RESULT.candidatesCount.sort(compare);
  const totalVotes = RESULT.totalVotes;
  let candidatesTemplate = ``, candidateNumber = 0;

  for (let candidate of candidatesSort) {
    candidateNumber++;
    candidatesTemplate += `<div class="row mb-4">
      <div class="col-auto align-self-center">
        <div class="percent-box">
          <span>${candidate.percent}</span>
          <small>%</small>
        </div>
      </div>
      <div class="col align-self-center p-0">
        <div class="progress">
          <div id="divPercent${candidateNumber}" class="progress-bar" aria-valuenow="${candidate.percent}" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>
        </div>
      </div>
      <div class="col-auto align-self-center">
        <img class="img-thumbnail" src="img/${candidate.imgFile}" alt="${candidate.name} picture" width="100" height="100" />
      </div>
      <div class="col-3 align-self-center">
        <p class="lead">${candidate.name}</p>
      </div>
    </div>`;
  }

  let resultTemplate = `<div class="container">
    <div class="row mb-5">
      <div class="col">
        <h2 class="display-4 text-uppercase text-center">Election results</h2>
      </div>
    </div>
    ${candidatesTemplate}
    <div class="row mt-5 mb-4">
      <div class="col">
        <p class="text-center">Total votes: ${totalVotes}</p>
      </div>
    </div>
  </div>`;
  $("#electionResults").empty().append(resultTemplate);

  setTimeout(function() {
    candidateNumber = 0;
    for (let candidate of candidatesSort) {
      candidateNumber++;
      $(`#divPercent${candidateNumber}`).width(`${candidate.percent}%`)
    }
  }, 600);
});