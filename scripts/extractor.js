const fs = require('fs');
const { mkdir, readdir, readFile, writeFile } = require('fs').promises;
const path = require('path');

/*
Usage:
`node extractor.js [deployment directory]`
Exemple: `node extractor.js ../../angle-solidity/deployments/mainnet`
The abis are fetched and saved in the `output directory`.
*/

/* 
{
  contractName: "outputName"
}
*/
const CONTRACTS_PER_STABLE_PER_COLLAT = {
  FeeManager: 'FeeManager',
  GenericCompound: 'GenericCompound',
  GenericAave: 'GenericAave',
  Oracle: 'Oracle',
  PerpetualManagerFront: 'PerpetualManager',
  PoolManager: 'PoolManager',
  SanToken: 'SanToken',
  Strategy: 'Strategy',
  StakingRewards: 'Staking',
};
const CONTRACTS_PER_STABLE = {
  AgToken: 'AgToken',
  StableMasterFront: 'StableMaster',
  StakingRewards: 'Staking',
};
const CONTRACTS_GLOBAL = {
  ANGLE: 'ANGLE',
  Core: 'Core',
  Governor: 'Governor',
  RewardsDistributor: 'RewardsDistributor',
  Timelock: 'Timelock',
  ProxyAdmin: 'ProxyAdmin',
  Orchestrator: 'Orchestrator',
  GaugeController: 'GaugeController',
  SmartWalletWhitelist: 'SmartWalletWhitelist',
  veANGLE: 'veANGLE',
  veBoostProxy: 'veBoostProxy',
};

async function main() {
  if (process.argv.length < 3) {
    console.log(`
      Wrong number of argument
      Usage: node extractor.js [deployment directory]
      
      example: node extractor.js ../../angle-solidity/deployments/rinkeby
    `);
    return;
  }

  const deploymentPath = path.resolve(__dirname, process.argv[2]);
  const outPath = path.resolve(__dirname, '../src/constants/abis');

  // if (fs.existsSync(outPath)) {
  //   console.log(`
  //   Output directory already exists.
  //   Please delete before running the script.
  //   It will be recreated automatically.
  //   !!! This is a protection to make sure this script doesn't delete your files
  //   `);
  //   return;
  // }

  // Create output directory
  await mkdir(outPath, { recursive: true });

  // read files from input directory, keep only JSON files (abis) and sanitize name (remove '.json' at the end)
  const deployedContracts = (await readdir(deploymentPath))
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => fileName.replace('.json', ''));

  const ADDRESSES = {};

  for (const contract of deployedContracts) {
    for (const contractName in CONTRACTS_GLOBAL) {
      if (contractName === contract) {
        const fileContent = JSON.parse(await readFile(path.resolve(deploymentPath, `${contractName}.json`), 'utf8'));

        const contractOutputName = CONTRACTS_GLOBAL[contractName];
        ADDRESSES[contractOutputName] = fileContent.address;

        const fileName = `${contractName}.json`;
        await writeFile(path.resolve(outPath, fileName), JSON.stringify(fileContent.abi));
        console.log(path.resolve(outPath, fileName));
      }
    }

    for (const tokenKey in CONTRACTS_PER_STABLE) {
      if (contract.includes(tokenKey)) {
        let splitted = contract.split('_');

        // We skip the "_Implementation" and "_Proxy" contracts. We only need the base contract
        if (splitted.length > 2) continue;

        const contractName = splitted[0];
        const stableName = `ag${splitted[1]}`;

        if (!ADDRESSES.hasOwnProperty(stableName)) {
          ADDRESSES[stableName] = {};
        }

        const fileContent = JSON.parse(await readFile(path.resolve(deploymentPath, `${contract}.json`), 'utf8'));

        const contractOutputName = CONTRACTS_PER_STABLE[contractName];
        ADDRESSES[stableName][contractOutputName] = fileContent.address;

        const fileName = `${contractName}.json`;
        await writeFile(path.resolve(outPath, fileName), JSON.stringify(fileContent.abi));
      }
    }

    for (const collatKey in CONTRACTS_PER_STABLE_PER_COLLAT) {
      if (contract.includes(collatKey)) {
        // In case there is an "_" in the name, we need to bypass it. For example in "StakingRewards_ANGLE"
        let splitted = [collatKey, ...contract.replace(`${collatKey}_`, '').split('_')];

        // We skip the "_Implementation" and "_Proxy" contracts. We only need the base contract
        if (splitted.length > 3) continue;

        const contractName = splitted[0];

        let stableName = `ag${splitted[1]}`;
        let collatName = splitted[2];

        // Oracle has a special naming convention. The collateral name is before the stable name, so we have to treat it differently
        if (contractName === 'Oracle') {
          stableName = `ag${splitted[2]}`;
          collatName = splitted[1];
        }

        // StakingRewards also has a special naming convention.
        if (contractName === 'StakingRewards') {
          stableName = `ag${splitted[2]}`;
          collatName = splitted[1].replace('san', '');
        }

        const fileContent = JSON.parse(await readFile(path.resolve(deploymentPath, `${contract}.json`), 'utf8'));

        // If it is a "global" Oracle (Bonding Curve)
        const allStables = Object.keys(ADDRESSES)
          .filter((key) => key.substr(0, 2) === 'ag')
          .map((key) => key.slice(2));

        if (contractName === 'Oracle' && allStables.includes(collatName)) {
          ADDRESSES[`Oracle_${stableName}_${collatName}`] = fileContent.address;
          continue;
        }

        if (!ADDRESSES.hasOwnProperty(stableName)) continue;
        if (!ADDRESSES[stableName].hasOwnProperty('collaterals')) {
          ADDRESSES[stableName]['collaterals'] = {};
        }
        if (!ADDRESSES[stableName]['collaterals'].hasOwnProperty(collatName)) {
          ADDRESSES[stableName]['collaterals'][collatName] = {};
        }

        const contractOutputName = CONTRACTS_PER_STABLE_PER_COLLAT[contractName];
        ADDRESSES[stableName]['collaterals'][collatName][contractOutputName] = fileContent.address;

        const fileName = `${contractName}.json`;

        await writeFile(path.resolve(outPath, fileName), JSON.stringify(fileContent.abi));
      }
    }
  }

  await writeFile(path.resolve(outPath, '../rinkeby.json'), JSON.stringify(ADDRESSES, null, 2));
  console.log(path.resolve(outPath, '../rinkeby.json'));
}

main();
