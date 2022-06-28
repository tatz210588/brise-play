// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

contract POGPlay is Initializable, ERC20Upgradeable, OwnableUpgradeable {
  using Counters for Counters.Counter;
  Counters.Counter public _itemIds;
  address[] public winners;
  address[] public lastLotteryRoundWinners;
  address payable public admin;
  uint256 internal startKey;
  uint256 public constant duration = 14 days;
  uint256 public total;
  address evoTokenAddress;
  uint256 public noOfWinners;

  mapping(uint256 => PlayersGravity) public playerData;

  struct PlayersGravity {
    uint256 tokenNumber;
    address playerAddress;
    uint256 startNumber;
    uint256 endNumber;
    uint256 amount;
    uint256 startTime;
    uint256 end;
  }

  function initialize() public initializer {
    __ERC20_init('', '');
    __Ownable_init();
    admin = payable(msg.sender);
    startKey = block.timestamp;
    //evoTokenAddress = 0x267Ae4bA9CE5ef3c87629812596b0D89EcBD81dD; // EVO token address provided by Sathya
    //evoTokenAddress = 0x02F21d483BeCfe74E8E1C67590d265E493498d1E; //my ERC20 LoloCoin
    evoTokenAddress = 0x796963FD33a4D40091449Dde1781b2F65298A9dF; //Lolcoin of bitgert testnet
    total = 0;
  }

  function getAdmin() public view returns (address payable) {
    return admin;
  }

  function setNoOfWinners(uint256 _noOfWinners) public onlyOwner {
    noOfWinners = _noOfWinners;
  }

  function deposit(uint256 amount) public payable returns (uint256) {
    _itemIds.increment();
    uint256 slno = _itemIds.current();
    playerData[slno] = PlayersGravity(
      slno + 5678,
      msg.sender,
      total + 1,
      total + amount,
      amount,
      block.timestamp,
      block.timestamp + duration
    );
    total += amount;
    IERC20Upgradeable(evoTokenAddress).transferFrom(
      msg.sender, //from
      address(this), //to
      amount
    );
    return (slno + 5678);
  }

  function getMyTotalDeposits() public view returns (uint256) {
    uint256 myDepositedAmount = 0;
    uint256 slno = _itemIds.current();
    for (uint256 i = 0; i < slno; i++) {
      if (playerData[i + 1].playerAddress == msg.sender) {
        myDepositedAmount += playerData[i + 1].amount;
      }
    }
    return myDepositedAmount;
  }

  function netClaimableAmount() public view returns (uint256) {
    uint256 totalItemCount = _itemIds.current();
    uint256 claimableAmount = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (
        playerData[i + 1].playerAddress == msg.sender &&
        block.timestamp >= playerData[i + 1].end
      ) {
        claimableAmount += playerData[i + 1].amount;
      }
    }
    return claimableAmount;
  }

  function netLockedAmount() public view returns (uint256) {
    uint256 totalItemCount = _itemIds.current();
    uint256 lockedAmount = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (
        playerData[i + 1].playerAddress == msg.sender &&
        block.timestamp < playerData[i + 1].end
      ) {
        lockedAmount += playerData[i + 1].amount;
      }
    }
    return lockedAmount;
  }

  function redeemClaimable() public payable {
    uint256 totalItemCount = _itemIds.current();
    for (uint256 i = 0; i < totalItemCount; i++) {
      if (
        playerData[i + 1].playerAddress == msg.sender &&
        block.timestamp >= playerData[i + 1].end
      ) {
        //uint noOfDaysPassed = (block.timestamp -  playerData[i+1].startTime) / 86400;
        uint256 noOfDaysPassed = (block.timestamp -
          playerData[i + 1].startTime) / 1 days;
        uint256 interest = calculateNetInterestValue(
          playerData[i + 1].amount,
          noOfDaysPassed
        );
        IERC20Upgradeable(evoTokenAddress).transfer(
          msg.sender,
          (playerData[i + 1].amount + interest)
        );
        playerData[i + 1].amount = 0;
      }
    }
  }

  function forceWithdraw(uint256 userAmount) public payable {
    require(userAmount > 0, 'Withdraw Amount must be greater than 0');
    require(
      userAmount <= netLockedAmount(),
      'You cannot withdraw more than you deposited'
    );
    uint256 totalItemCount = _itemIds.current();
    uint256 amount = userAmount;
    for (uint256 i = 0; i < totalItemCount; i++) {
      if (
        playerData[i + 1].playerAddress == msg.sender &&
        block.timestamp < playerData[i + 1].end
      ) {
        uint256 noOfDaysPassed = (block.timestamp -
          playerData[i + 1].startTime) / 1 days;
        uint256 taxDeductionRate = 28 - (2 * noOfDaysPassed);
        uint256 taxDeduction = (amount * taxDeductionRate) / 100;
        uint256 inHand = amount - taxDeduction;
        if (playerData[i + 1].amount > amount) {
          IERC20Upgradeable(evoTokenAddress).transfer(
            payable(msg.sender),
            inHand
          );
          playerData[i + 1].amount -= inHand;
          break;
        } else {
          IERC20Upgradeable(evoTokenAddress).transfer(
            payable(msg.sender),
            playerData[i + 1].amount
          );
          playerData[i + 1].amount = 0;
          amount -= playerData[i + 1].amount;
        }
      }
    }
  }

  function getPrizeMoney() public view returns (uint256) {
    uint256 totalItemCount = _itemIds.current();
    uint256 totalPrizeMoney = 0;
    for (uint256 i = 0; i < totalItemCount; i++) {
      uint256 noOfDaysPassed = (block.timestamp - playerData[i + 1].startTime) /
        1 days;
      uint256 p = playerData[i + 1].amount;
      uint256 intr = 0;
      for (uint256 j = 0; j < noOfDaysPassed; j++) {
        //checking needed
        intr += (p * 3) / 1000;
        p += intr;
      }
      totalPrizeMoney += intr;
    }
    return totalPrizeMoney;
  }

  function calculateNetInterestValue(uint256 principal, uint256 noOfDaysPassed)
    public
    pure
    returns (uint256)
  {
    uint256 p = principal;
    uint256 intr = 0;
    for (uint256 i = 0; i < noOfDaysPassed; i++) {
      //checking needed
      intr += ((p * 13283933) / 10000000000);
      p += intr;
    }
    return intr;
  }

  function burnHere() public payable onlyOwner returns (uint256) {
    uint256 totalItemCount = _itemIds.current();
    uint256 burnAmount = 0;
    for (uint256 i = 0; i < totalItemCount; i++) {
      uint256 noOfDaysPassed = (block.timestamp - playerData[i + 1].startTime) /
        1 days;
      uint256 p = playerData[i + 1].amount;
      uint256 intr = 0;
      for (uint256 j = 0; j < noOfDaysPassed; i++) {
        //checking needed
        intr += (p * 2) / 1000;
        p += intr;
      }
      burnAmount += intr;
    }
    IERC20Upgradeable(evoTokenAddress).transfer(address(0), burnAmount);
    return burnAmount;
  }

  function getMyAccumulatedInterest() public view returns (uint256) {
    uint256 totalItemCount = _itemIds.current();
    uint256 totalInterest = 0;
    for (uint256 i = 0; i < totalItemCount; i++) {
      if (playerData[i + 1].playerAddress == msg.sender) {
        uint256 noOfDaysPassed = (block.timestamp -
          playerData[i + 1].startTime) / 1 days;
        //weiValue/(1 ether)
        uint256 p = playerData[i + 1].amount;
        uint256 intr = 0;
        for (uint256 j = 0; j < noOfDaysPassed; j++) {
          //checking needed
          intr += (p * 13283933) / 10000000000;
          p += intr;
        }
        totalInterest += intr;
      }
    }
    return totalInterest;
  }

  function getRandomNumber() internal view returns (uint256) {
    return
      uint256(
        keccak256(
          abi.encodePacked(admin, startKey, block.difficulty, block.timestamp)
        )
      );
  }

  function setWinners(address addr) public onlyOwner {
    winners.push(addr);
  }

  function distributePrizeMoney() public payable onlyOwner {
    uint256 prizeMoney = getPrizeMoney();
    uint256 distributablePrizeMoney = (prizeMoney * 80) / 100;
    uint256 burnAblePrizeMoney = (prizeMoney * 20) / 100;
    uint256 perWinnerPrizeAmount = distributablePrizeMoney / winners.length;
    IERC20Upgradeable(evoTokenAddress).transfer(address(0), burnAblePrizeMoney); //20% prize money will be burned
    for (uint256 i = 0; i < winners.length; i++) {
      //distributing 80% prize money equally to all winners
      IERC20Upgradeable(evoTokenAddress).transfer(
        winners[i],
        perWinnerPrizeAmount
      );
    }
  }

  function startLottery() public payable onlyOwner {
    for (uint256 i = 0; i < noOfWinners; i++) {
      if (winners.length != noOfWinners) {
        uint256 luckyRandomNumber = getRandomNumber();
        uint256 uinqieNUmber = luckyRandomNumber % total;
        uint256 totalItemCount = _itemIds.current();
        for (uint256 j = 0; j < totalItemCount; j++) {
          if (uinqieNUmber < playerData[j + 1].endNumber) {
            bool duplicateEntry = false;
            for (uint256 k = 0; k < winners.length; k++) {
              if (winners[k] == playerData[j + 1].playerAddress) {
                //duplicate entry coming
                duplicateEntry = true;
                break;
              }
            }
            if (duplicateEntry == false) {
              //means genuine winner found
              winners.push(playerData[j + 1].playerAddress);
              break;
            }
          }
        }
      } else {
        break;
      }
    }
    distributePrizeMoney();
    lastLotteryRoundWinners = winners;
    delete winners;
  }

  function chanceOfUserToBeWinner() public view returns (uint256) {
    uint256 totalDeposit = getMyTotalDeposits();
    uint256 chancePercent = 1;
    if (total != 0) {
      chancePercent = (totalDeposit * 100) / total;
    }
    return chancePercent * 10**18;
  }

  function withdraw(uint256 amount) public onlyOwner {
    require(
      amount <= IERC20Upgradeable(evoTokenAddress).balanceOf(address(this)),
      'Insufficient Balance'
    );
    IERC20Upgradeable(evoTokenAddress).transfer(admin, amount);
  }
}
