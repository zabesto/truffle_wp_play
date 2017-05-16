pragma solidity ^0.4.2;


contract Voting {
    struct Voter {
        bool voted;
        uint vote;
        bool rightToVote;
    }

    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    address public chairperson;
    uint public votingStart;
    uint public votingTime;
    uint public numProposals;
    mapping(address => Voter) public voters;
    mapping(uint => Proposal) public proposals;

    function Voting(bytes32[] proposalNames, uint _votingTime){
        chairperson = msg.sender;
        voters[chairperson].rightToVote = true;
        votingStart = now;
        votingTime = _votingTime;
        numProposals = proposalNames.length;

        for (uint i=0; i < proposalNames.length; i++) {
            Proposal p = proposals[i];
            p.name = proposalNames[i];
            p.voteCount = 0;
        }
    }

    function giveRightToVote(address voter) {
        if (msg.sender != chairperson || voters[voter].voted) throw;
        voters[voter].rightToVote = true;
    }

    function vote(uint proposal) {
        if (now > votingStart + votingTime) throw;
        Voter sender = voters[msg.sender];

        if (sender.voted) throw;

        sender.voted = true;
        sender.vote = proposal;
        proposals[proposal].voteCount += 1;
    }

    function winningProposal() constant returns(uint winningProposal, bytes32 proposalName) {
        if (now < votingStart + votingTime) throw;

        for (uint p=0; p < numProposals; p++) {
            if (proposals[p].voteCount > winningCount) {
                uint winningCount = proposals[p].voteCount;
                winningProposal = p;
                proposalName = proposals[p].name;
            }
        }
    }
}
