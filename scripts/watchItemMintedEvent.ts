// Dependencies
import Moralis from 'moralis/node';

// Utils
import getEvent from '../src/utils/getEvent';
import getTopicFromEvent from '../src/utils/getTopicFromEvent';

// Contracts
import contract from '../contracts/NFTSale'

async function main() {
  const { APP_ID, SERVER_URL, MASTER_KEY } = process.env;
  
  const moralisConfig = {
    appId: APP_ID,
    serverUrl: SERVER_URL,
    masterKey: MASTER_KEY,
  };

  const eventABI = getEvent("ItemMinted", contract.abi);
  const topic = getTopicFromEvent(eventABI);

  const options = {
    topic: topic,
    abi: eventABI,
    limit: 500000,
    sync_historical: true,
    tableName: eventABI.name,
    address: contract.address,
    chainId: process.env.CHAIN_ID || '',
  };

  await Moralis.start(moralisConfig);

  Moralis.Cloud.run("watchContractEvent", options, { useMasterKey: true });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});