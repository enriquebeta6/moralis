// Dependencies
import Moralis from "moralis/node";
import { join } from 'node:path';
import { readFileSync } from 'node:fs';

async function saveBatteryFactory(filename: string, variation: string) {
  const NFTBaseAttributes = Moralis.Object.extend("NFTBaseAttributes");

  const bufferArray = Array.from(readFileSync(join(__dirname, filename)));

  const file = new Moralis.File(filename, bufferArray, "image/png");

  const description = `
    This skin change your character’s appearance, improve his stats and additionally give you a special ability that you can unlock depending on the gamemode.
    This ability can be attack, defense, healing or stun, and visually it will depend on each skin.
  `;

  const nftBaseAttributes = new NFTBaseAttributes();

  nftBaseAttributes.set('image', file);
  nftBaseAttributes.set('variation', variation);
  nftBaseAttributes.set('description', description);
  nftBaseAttributes.set(
    'nftAddress',
    "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9".toLowerCase()
  );

  nftBaseAttributes
    .save(null, { useMasterKey: true })
    .then((res: unknown) => {
      console.log(
        `NFTBaseAttributes Skin variation ${variation} saved!`
      );
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

  const filenames = [
    "skin-1.png",
    "skin-2.png",
    "skin-3.png",
    "skin-4.png",
    "skin-5.png",
  ];
  
  filenames.map((filename, index) => saveBatteryFactory(
    filename,
    (index + 1).toString()
  ));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});