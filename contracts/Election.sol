pragma solidity ^0.4.24;

contract Election {

    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    //store account
    mapping (address => bool) public voters;

    //store candidates
    //fetch candidates
    mapping (uint => Candidate) public candidates;
    //contador de candidatos
    uint public candidatesCount;
    
    event votedEvent(
        uint indexed _candidateid
    );

    constructor() public{
        addCandidate(100,"Bill Gates");
        addCandidate(200,"Elon Musk");
        addCandidate(300,"Mark Zuckerberg");
        addCandidate(400,"Steve Jobs");
    }

    function addCandidate (uint _id,string _name)private {
    	candidatesCount =_id;
    	candidates[_id]= Candidate(_id,_name,0);
    }

    function vote(uint _candidateid) public {

        //required that they haven`t voted before
        require(!voters[msg.sender]);

        //required a valid candidate
        require(_candidateid== 100 || _candidateid== 200 || _candidateid== 300 || _candidateid== 400  );

        //record that voter has voted
        voters[msg.sender] = true;

        //update candidate vote voteCount
        candidates[_candidateid].voteCount++;

        //refresh
        emit votedEvent(_candidateid);
    }

}