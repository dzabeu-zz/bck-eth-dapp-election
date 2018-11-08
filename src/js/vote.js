const VALID_VOTES = ["100", "200", "300", "400"];
const MAX_LEN = 3;

$(document).ready(function() {
  $("#inputVote").on('change', function(e) {
    $(".vote-option").removeClass("unselected");
    const vote = e.target.value || "000";
    if (vote.length === MAX_LEN) {
      if (VALID_VOTES.includes(vote)) { // valid vote
        $(".vote-option").addClass("unselected");
        $(`.vote-option[data-vote=${vote}]`).removeClass("unselected");
      }
    }
  });
  
  $(".number-key").on('click', function(e) {
    const key = e.delegateTarget.dataset.key;
    if (key) {
      const vote = $("#inputVote").val() || "";
      switch (key) {
        case "Vote":
          break;
        case "Clear":
          $(".vote-option").removeClass("unselected");
          $("#voteForm").each(function() {
            this.reset();
          });
          break;
        default:
          if (vote.length < MAX_LEN) {
            $("#inputVote").val(vote + key).trigger('change');
          }
      }
    }
  });
});