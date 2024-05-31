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
    
    AggregatorV3Interface internal AAVE_USD;
    AggregatorV3Interface internal MATIC_USD;

    /**
     * Network: polygon cardona Testnet
     */
    constructor() {
        AAVE_USD = AggregatorV3Interface(
            0x6eaE3676F1124D7201c541950f633E3766D056dA
        );
        
        MATIC_USD = AggregatorV3Interface(
            0x1692Bdd32F31b831caAc1b0c9fAF68613682813b
        );
    }

    /**
     * Returns the latest answer.
     */
    function getAAVE_USD() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = AAVE_USD.latestRoundData();
        return answer;
    }
    
    function getMATIC_USD() public view returns (int) {
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = MATIC_USD.latestRoundData();
        return answer;
    }
}
// 377578825762