// Dependencies
import Moralis from "moralis/node";

async function saveNFTAddress({ type, address}: Record<string, string>) {
  const NFTAddresses = Moralis.Object.extend("NFTAddresses");
  
  const nftAddresses = new NFTAddresses();

  nftAddresses.set('type', type);
  nftAddresses.set('address', address);

  nftAddresses
    .save(null, { useMasterKey: true })
    .then((res: unknown) => {
      console.log(`NFTAddresses ${type} saved!`)
      console.log(res);
    })
}

async function main() {
  const { APP_ID, SERVER_URL, MASTER_KEY } = process.env;
  
  const moralisConfig = {
    appId: APP_ID,
    serverUrl: SERVER_URL,
    masterKey: MASTER_KEY,
  };

  await Moralis.start(moralisConfig);

  const nfts = [
    {
      "type": "MARKET",
      "address": "0x8a791620dd6260079bf849dc5567adc3f2fdc318"
    },
    {
      "type": "BATTERY_FACTORY",
      "address": "0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6"
    },
    {
      "type": "MUNITION_FACTORY",
      "address": "0xa513e6e4b8f2a923d98304ec87f64353c4d5c853"
    },
    {
      "type": "LAND",
      "address": "0x0165878a594ca255338adfa4d48449f69242eb8f"
    },
    {
      "type": "WEAPON",
      "address": "0x5fc8d32690cc91d4c39d9d3abcbd16989f875707"
    },
    {
      "type": "SKIN",
      "address": "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9"
    },
    {
      "type": "CARD",
      "address": "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0"
    },
    {
      "type": "TOY",
      "address": "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9"
    }
  ]

  nfts.map(saveNFTAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});