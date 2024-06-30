// SPDX-License-Identifier: The Unlicense
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface IGameMaster {
    function updateStatus() external;
    function getGameMaster() external view returns (address);
}

/// @title A 50/50 Raffle Contract
/// @dev Extends ReentrancyGuard to prevent reentrant calls
/// @notice This contract allows participants to buy tickets for a raffle and draws a winner after a specified block
contract FiftyFiftyRaffle is ReentrancyGuard {
    using Strings for uint256;
    uint256 private constant MAX_ENTRY = 10;
    uint256 public ticketPrice; 
    address private  gameMasterAddress;
    uint256 private gameMasterShareTotal = 0; 
    mapping(uint256 => address) private tickets;
    mapping(address => uint256) public balance;
    uint256 public ticketCount;
    address public fundraiser;
    uint256 public pot;
    uint256 public revealBlock;
    uint256 public endBlock;
    address public winner = address(0);

    string public name;

    event TicketPurchased();
    event WinnerDrawn(address winner, uint256 prize);
    event RevealBlockChanged();

    /// @param _fundraiserWallet Address to which raised funds will be sent
    /// @param _name Name of the raffle
    /// @param _blocksFromDeploy Blocks after deploy height after which no more tickets can be purchased
    /// @param _winnerSuspense Number of blocks to wait after endBlock to draw the winner
    constructor(address _fundraiserWallet, string memory _name, uint256 _blocksFromDeploy, uint256 _winnerSuspense, uint256 _ticketPrice) {
        gameMasterAddress = msg.sender;
        fundraiser = _fundraiserWallet;
        name = _name;
        endBlock = block.number + _blocksFromDeploy;
        revealBlock = endBlock + _winnerSuspense;
        ticketPrice = _ticketPrice;
    }

    /// @notice Allows users to purchase raffle tickets
    /// @dev Emits a TicketPurchased event for each ticket bought
    /// @param amount The number of tickets to purchase
    function buyTickets(uint256 amount) external payable nonReentrant {
        require(block.number < endBlock, "Ticket sales have ended");
        require(amount <= MAX_ENTRY, "You can only buy 10 tickets at a time");
        require(amount > 0, "Amount must be greater than zero");
        require(msg.value >= amount * ticketPrice, "Incorrect Ether value sent");

        for (uint256 i = 0; i < amount; i++) {
            balance[msg.sender]++;
            ticketCount++;
            uint256 ticketNumber = ticketCount;
            tickets[ticketNumber] = msg.sender;
        }

        uint256 gameMasterShare = msg.value / 100; // 1% set aside for the gameMaster
        gameMasterShareTotal += gameMasterShare;
        pot += (msg.value - gameMasterShare);

        IGameMaster(gameMasterAddress).updateStatus();
        emit TicketPurchased();
    }

    /// @notice Draws the winner of the raffle
    /// @dev Uses the block hash of the endBlock as a source of randomness
    function drawWinner() external nonReentrant {
        require(ticketCount > 0, "No tickets have been purchased");
        require(winner == address(0), "Winner has already been drawn");

        if (!(block.number > revealBlock)) {
            revert(string(abi.encodePacked("Please wait until block ", revealBlock.toString(), " to reveal winner")));
        }

        bytes32 goldenHash = blockhash(revealBlock);

        if (goldenHash == bytes32(0)) {
            revealBlock = block.number + 100;
            emit RevealBlockChanged();
            return;
        }

        uint256 randomNum = uint256(goldenHash) % ticketCount;
        winner = tickets[randomNum + 1]; 

        uint256 winnerShare = pot / 2;
        address gameMasterAddy = IGameMaster(gameMasterAddress).getGameMaster();

        (bool gameMasterPay, ) = gameMasterAddy.call{value: gameMasterShareTotal}("");
        require(gameMasterPay, "Failed to send Ether to gameMaster");

        (bool winnerPay, ) = winner.call{value: winnerShare}("");
        require(winnerPay, "Failed to send Ether to winner");

        uint256 remainingBalance = address(this).balance;

        (bool fundraiserPay, ) = fundraiser.call{value: remainingBalance}("");
        require(fundraiserPay, "Failed to send Ether to fundraiser");

        emit WinnerDrawn(winner, winnerShare);
    }

    /// @notice Retrieves the complete state of the raffle
    /// @return name of the raffle
    /// @return pot total amount in the pot
    /// @return ticketPrice price of a single ticket
    /// @return ticketCount total number of tickets sold
    /// @return endBlock block number after which no more tickets can be bought
    /// @return revealBlock block number after which the winning ticket can be revealed
    /// @return fundraiser the address to which half of the pot will be sent
    function getRaffleInfo() external view returns (string memory, uint256, uint256, uint256, uint256, uint256, address) {
        return (name,pot,ticketPrice,ticketCount,endBlock,revealBlock,fundraiser);
    }

    /// @notice Allows the contract to receive Ether directly with no extra logic
    receive() external payable {}
}
