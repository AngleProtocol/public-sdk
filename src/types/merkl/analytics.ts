import { BigNumber } from 'ethers';
import { Int256 } from 'src/lib';

import { AggregatedRewardsType, MerklSupportedChainIdsType } from '.';

export type OnChainParamsType = {
  disputeToken: string;
  disputeAmount: BigNumber;
  disputePeriod: number;
  endOfDisputePeriod: number;
  disputer: string;
  endRoot: string;
  startRoot: string;
  currentRoot: string;
};

export type DistributionChangeType = {
  epoch: number;
  pool: string;
  poolName: string;
  ratePerEpoch: number;
  numRecipients: number;
  rewardSymbol: string;
  diff: number;
};

// export type HolderDetailsType = {
//   [rewardId: string]: {
//     poolName: string;
//     rewardDecimals?: number;
//     rewardSymbol: string;
//     rewardTokenAddress?: string;

//     holderDiff: number;
//     diffAverageBoost?: number;
//     issueSpotted?: boolean;
//     percent?: number;
//   };
// };

// export type HolderClaims = { [address: string]: { [symbol: string]: string } };

export type HoldersReportType = {
  [holder: string]: {
    [poolAddress: string]: {
      details: {
        [rewardId: string]: {
          poolName: string;
          rewardDecimals?: number;
          rewardSymbol: string;
          rewardTokenAddress?: string;

          holderDiff: number;
          diffAverageBoost?: number;
          issueSpotted?: boolean;
          percent?: number;
        };
      };
      // aggregated
      unclaimed: { [rewardSymbol: string]: Int256 }; // FIXME
      negativeDiffs: { [rewardSymbol: string]: number };
      overclaimed?: { [rewardSymbol: string]: number };
    };
  };
};

export type MerklReportType = Partial<{
  chainId: MerklSupportedChainIdsType;
  startTime: number;
  startEpoch: number;
  endEpoch: number;
  blockNumber: number;

  params: OnChainParamsType;
  startRoot: string;
  startAggregatedRewards: AggregatedRewardsType;
  endRoot: string;
  endAggregatedRewards: AggregatedRewardsType;

  poolsReport: { [poolAddress: string]: { [rewardId: string]: DistributionChangeType } };
  holdersReport: HoldersReportType;
}>;
