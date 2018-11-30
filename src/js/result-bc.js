App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    hasVoted: false,
  
    init: function() {
      return App.initWeb3();
    },
  
    initWeb3: function() {
      // TODO: refactor conditional
      if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        // Specify default instance if no web3 instance provided
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(App.web3Provider);
      }
      return App.initContract();
    },
  
    initContract: function() {
      $.getJSON("Election.json", function(election) {
        // Instantiate a new truffle contract from the artifact
        App.contracts.Election = TruffleContract(election);
        // Connect provider to interact with contract
        App.contracts.Election.setProvider(App.web3Provider);
  
        App.listenForEvents();
  
        return App.render();
      });
    },
  
    // Listen for events emitted from the contract
    listenForEvents: function() {
      App.contracts.Election.deployed().then(function(instance) {
        // Restart Chrome if you are unable to receive this event
        // This is a known issue with Metamask
        // https://github.com/MetaMask/metamask-extension/issues/2393
        instance.votedEvent({}, {
          fromBlock: 0,
          toBlock: 'latest'
        }).watch(function(error, event) {
          console.log("event triggered", event)
          // Reload when a new vote is recorded
          App.render();
        });
      });
    },
  
    render: function() {
      var electionInstance;
      var loader = $("#loader");
      var content = $("#content");
  
      loader.show();
      content.hide();
      var candidatesSort ;
    
      // Load account data
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          $("#accountAddress").html("Your Account: " + account);
        }
      });
  

      function callPromisseCandidate(instanciaAsset,i) {
        var candidate = electionInstance.candidates(i);
        return (candidate);
      }

      // Load contract data
      App.contracts.Election.deployed().then(function(instance) {
        electionInstance = instance;
        return electionInstance.candidatesCount();
      }).then(async function(candidatesCount) {
        var resultList=[];
        for (var i = 100; i <= candidatesCount; i=i+100) {
          var y = await  callPromisseCandidate(electionInstance,i).then( function(result) {
              let name = result[1];
              let imgFile = result[2];
              let percent = result[4];
              var obj = {
                name,
                imgFile,
                percent: percent.c[0]
              };
              resultList.push(obj);
          }) 
        }
        candidatesSort = resultList.sort(function(a, b) {
          if (a.percent === b.percent) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
          }
          if (a.percent < b.percent) return 1;
          if (a.percent > b.percent) return -1;
          return 0;
        });
        return electionInstance.totalVotes();
        
      }).then(async function(totalVotes) {
        totalVotes= totalVotes.c[0];
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

      }).catch(function(error) {
        console.warn(error);
      });
    }

  };
  
  $(document).ready(
  function (){
    $(window).load(function() {
      App.init();
    });
  }
  );

