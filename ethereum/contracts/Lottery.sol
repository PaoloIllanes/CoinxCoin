// SPDX-License-Identifier:GPL-3.0
pragma solidity 0.8.14;
contract Lottery{
    address[] public players;
    address public manager;

    constructor(){
        manager = msg.sender;
    }

    function enter()public payable{
        require(msg.value> 1000 wei);
        players.push(msg.sender);

    }

    function random() public view returns (uint){

        return uint(keccak256(abi.encodePacked(block.difficulty,block.timestamp,players)));

    }
    function pickWinner()public  restricted{
        uint index =  random()%players.length;
        payable(players[index]).transfer(address(this).balance);
        players= new address[](0);
    }
    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    function getPlayers()public view returns(address[]memory){
        return players;
    }

}
