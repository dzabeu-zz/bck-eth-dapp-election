pragma solidity ^0.4.24;

contract Election {

    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        string imgFile;
        uint voteCount;
        uint percent;
    }

    //store account
    mapping (address => bool) public voters;

    //store candidates
    //fetch candidates
    mapping (uint => Candidate) public candidates;
    //contador de candidatos
    uint public candidatesCount;
    //contador total de votos
    uint public totalVotes;
    
    event votedEvent(
        uint indexed _candidateid
    );

    constructor() public{
        addCandidate(100,"Bill Gates","bill-gates-picture1x1.jpg");
        addCandidate(200,"Elon Musk","elon-musk-picture1x1.jpg");
        addCandidate(300,"Mark Zuckerberg","mark-zuckerberg-picture1x1.jpg");
        addCandidate(400,"Steve Jobs","steve-jobs-picture1x1.jpg");
    }

    function addCandidate (uint _id,string _name,string _imgFile)private {
    	candidatesCount =_id;
    	candidates[_id]= Candidate(_id,_name,_imgFile,0,0);
    }

    function vote(uint _candidateid) public {

        //required that they haven`t voted before
        require(!voters[msg.sender]);

        //required a valid candidate
        require(_candidateid== 100 || _candidateid== 200 || _candidateid== 300 || _candidateid== 400  );

        //record that voter has voted
        voters[msg.sender] = true;

        totalVotes++;
        //update candidate vote voteCount
        candidates[_candidateid].voteCount++;
        
        //update percent
        for (uint i=100; i<=400; i=i+100) {
            candidates[i].percent = ((candidates[i].voteCount * 100)/totalVotes);
        }

        //refresh
        emit votedEvent(_candidateid);

    }

}