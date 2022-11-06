// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;
import "./MyERC20.sol";
// Uncomment the line to use openzeppelin/ERC20
// You can use this dependency directly because it has been installed already
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
//import "hardhat/console.sol";

contract StudentSocietyDAO {
    // use a event if you want
    event ProposalInitiated(uint32 proposalIndex);

    struct Proposal {
        uint32 index; // index of this proposal
        address proposer; // who make this proposal
        uint256 startTime; // proposal start time
        uint256 duration; // proposal duration
        string name; // proposal name
        string content;
        uint256 agree;
        uint256 disagree;
        bool state;
    }

    struct Voter {
        bool ifvote;
    }

    MyERC20 public studentERC20;
    mapping(uint32 => Proposal) proposals; // A map from proposal index to proposal
    uint32 proposalIndex = 0;
    mapping(uint32 => Voter) voter;

    // ...
    // TODO add any variables if you want

    constructor() public {
        // maybe you need a constructor
        studentERC20 = new MyERC20("bccoin", "bccoinSymbol");
    }

    function addproposal(
        uint256 _duration,
        string memory _name,
        string memory _content
    ) public {
        studentERC20.transfer(msg.sender, 100);
        studentERC20.allow(msg.sender, 100);
        proposals[proposalIndex] = Proposal(
            proposalIndex,
            msg.sender,
            block.timestamp,
            _duration,
            _name,
            _content,
            0,
            0,
            false
        );
        voter[proposalIndex].ifvote = false;
        proposalIndex += 1;
    }

    function agreeproposal(uint32 index) public {
        if (
            (block.timestamp > proposals[index].startTime &&
                block.timestamp <
                (proposals[index].startTime + proposals[index].duration)) &&
            (voter[index].ifvote == false)
        ) {
            studentERC20.transfer(msg.sender, 50);
            studentERC20.allow(msg.sender, 50);
            proposals[index].agree++;
            voter[index].ifvote = true;
        }
    }

    function disagree(uint32 index) public {
        if (
            (block.timestamp > proposals[index].startTime &&
                block.timestamp <
                (proposals[index].startTime + proposals[index].duration)) &&
            (voter[index].ifvote == false)
        ) {
            studentERC20.transfer(proposals[index].proposer, 50);
            studentERC20.allow(proposals[index].proposer, 50);
            proposals[index].disagree++;
            voter[index].ifvote = true;
        }
    }

    function getproposal(uint32 index) public view returns (Proposal memory) {
        return proposals[index];
    }

    function gettime() external returns (uint256) {
        return block.timestamp;
    }

    function rewards(uint32 index) public {
        if (
            block.timestamp >
            (proposals[index].startTime + proposals[index].duration)
        ) {
            proposals[index].state = true;
            if (proposals[index].agree > proposals[index].disagree) {
                studentERC20.airdrop(300);
            }
        }
    }

    function getBankBalance() external view returns (uint256) {
        return studentERC20.balanceOf(address(this));
    }

    function getproposalIndex() external view returns (uint32) {
        return proposalIndex;
    }

    function getaddress() external view returns (address) {
        return address(this);
    }

    function blanceready() public {
        studentERC20.airdrop(10000);
    }

    function getstate(uint32 index) external view returns (bool) {
        return proposals[index].state;
    }
}
