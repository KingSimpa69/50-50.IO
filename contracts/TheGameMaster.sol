// SPDX-License-Identifier: The Unlicense
pragma solidity ^0.8.26;

import "./5050.sol";

interface IFiftyFiftyRaffle {
    function name() external view returns (string memory);
}

/// @title The Game Master for 50/50 Raffle Games
/// @dev This contract manages creation and status updates for multiple 50/50 raffle games
contract TheGameMaster {
    uint256 public launchPrice = 500000000000000;
    uint256[] private active;  
    mapping(address => bool) private game; 
    mapping(address => uint256) private addressToGameId;  
    mapping(uint256 => address) public gameIdToAddress; 
    uint256 private currentGameId; 
    address public gameMaster = 0xc6e6e91957aD7079827103799e3631F2B5Ff8c87;

    event GameCreated(uint256 gameId, address gameAddress);
    event GameUpdated();

    /// @notice Creates a new 50/50 Raffle game and registers it
    /// @param _fundraiserWallet Address where funds are sent post-raffle
    /// @param _name Name of the raffle
    /// @param _blocksFromDeploy Blocks after deploy height after which no more tickets can be purchased
    /// @param _winnerSuspense Blocks to wait after endBlock to draw the winner
    /// @param _ticketPrice Price per ticket
    /// @return gameId The unique ID of the newly created game
    /// @dev Emits the GameCreated event on successful creation
    function create(address _fundraiserWallet, string memory _name, uint256 _blocksFromDeploy, uint256 _winnerSuspense, uint256 _ticketPrice) public payable returns (uint256 gameId) {
        require(msg.value >= launchPrice, "You must pay the game creation fee");
        (bool sent, ) = gameMaster.call{value: msg.value}("");
        require(sent, "Failed to send Ether to gameMaster");
        FiftyFiftyRaffle newGame = new FiftyFiftyRaffle(_fundraiserWallet, _name, _blocksFromDeploy, _winnerSuspense, _ticketPrice);
        address gameAddress = address(newGame);
        gameId = ++currentGameId; 
        addressToGameId[gameAddress] = gameId;  
        gameIdToAddress[gameId] = gameAddress;
        game[gameAddress] = true; 
        emit GameCreated(gameId, gameAddress);
        return gameId;
    }

    /// @notice Updates the status of a game by moving its ID to the front of the array if it already exists, or by adding it if not
    /// @dev Only callable by an active game, ensures no duplicate entries and maintains a limit of 30 active games
    /// @dev Emits the GameUpdated event on updating the game status
    function updateStatus() public {
        require(game[msg.sender] == true, "Only callable by an active game");
        require(addressToGameId[msg.sender] != 0, "Game not registered");

        uint256 gameId = addressToGameId[msg.sender];
        bool exists = false;
        uint256 index;

        for (uint256 i = 0; i < active.length; i++) {
            if (active[i] == gameId) {
                exists = true;
                index = i;
                break;
            }
        }

        if (exists) {
            for (uint256 i = index; i > 0; i--) {
                active[i] = active[i - 1];
            }
            active[0] = gameId;  
        } else {
            active.push(0);
            for (uint256 i = active.length - 1; i > 0; i--) {
                active[i] = active[i - 1];
            }
            active[0] = gameId;
            if (active.length > 30) {
                active.pop();
            }
        }

        emit GameUpdated();
    }

    /// @notice Retrieves the address of the game master for this contract
    /// @dev Returns the stored gameMaster address state variable
    /// @return address The current game master's address
    function getGameMaster() public view returns (address) {
        return gameMaster;
    }


    /// @notice Returns the full list of active game IDs
    /// @return A list of active game IDs
    function getGames() private view returns (uint256[] memory) {
        return active;
    }

    /// @notice Retrieves the names of all active games
    /// @return names An array of names of all active games
    function getActiveGameNames() private view returns (string[] memory) {
        string[] memory names = new string[](active.length);
        for (uint256 i = 0; i < active.length; i++) {
            address gameAddress = gameIdToAddress[active[i]];
            IFiftyFiftyRaffle raffleContract = IFiftyFiftyRaffle(gameAddress);
            names[i] = raffleContract.name();
        }
        return names;
    }

    /// @notice Retrieves both IDs and names of all active games
    /// @return ids An array of active game IDs
    /// @return names An array of names of all active games
    function getActiveGames() public view returns (uint256[] memory ids, string[] memory names) {
        ids = getGames(); // Get the list of active game IDs
        names = getActiveGameNames(); // Get the names of the games
        return (ids, names);
    }
}
