// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { AggregatorV3Interface } from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED
 * VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/**
 * If you are reading data feeds on L2 networks, you must
 * check the latest answer from the L2 Sequencer Uptime
 * Feed to ensure that the data is accurate in the event
 * of an L2 sequencer outage. See the
 * https://docs.chain.link/data-feeds/l2-sequencer-feeds
 * page for details.
 */

contract DataConsumerV3 {
    AggregatorV3Interface internal ETH_USD;
    AggregatorV3Interface internal BTC_USD;
    AggregatorV3Interface internal LINK_USD;
    AggregatorV3Interface internal AAVE_USD;
    AggregatorV3Interface internal DOGE_USD;
    AggregatorV3Interface internal SOL_USD;

    /**
     * Network: zkSync Sepolia Testnet
     */
    constructor() {
        ETH_USD = AggregatorV3Interface(
            0xfEefF7c3fB57d18C5C6Cdd71e45D2D0b4F9377bF
        );
        
        BTC_USD = AggregatorV3Interface(
            0x95Bc57e794aeb02E4a16eff406147f3ce2531F83
        );
        
        LINK_USD = AggregatorV3Interface(
            0x894423C43cD7230Cd22a47B329E96097e6355292
        );
        AAVE_USD = AggregatorV3Interface(
            0x2137c69DCb41f611Cc8f39F8A98047e774d6ED74
        );
        
        DOGE_USD = AggregatorV3Interface(
            0x2cC24D99500a134ea7f78736b5C329C84599fb1B
        );
        
        SOL_USD = AggregatorV3Interface(
            0x498232F0a52D4e94A6e0Ea93D63C07Bc63133009
        );
    }

    /**
     * Returns the latest answer.
     */
    function getETH_USD() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = ETH_USD.latestRoundData();
        return answer;
    }
    
    function getBTC_USD() public view returns (int) {
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = BTC_USD.latestRoundData();
        return answer;
    }
    
    function getLINK_USD() public view returns (int) {
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = LINK_USD.latestRoundData();
        return answer;
    }
    
    function getAAVE_USD() public view returns (int) {
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = AAVE_USD.latestRoundData();
        return answer;
    }
    
    function getDOGE_USD() public view returns (int) {
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = DOGE_USD.latestRoundData();
        return answer;
    }
    
    function getSOL_USD() public view returns (int) {
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = SOL_USD.latestRoundData();
        return answer;
    }
}
