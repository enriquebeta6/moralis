// Dependencies
import Moralis from "moralis/node";
import { join } from 'node:path';
import { readFileSync } from 'node:fs';

async function saveCard(filename: string, variation: string) {
  const NFTBaseAttributes = Moralis.Object.extend("NFTBaseAttributes");

  const bufferArray = Array.from(readFileSync(join(__dirname, filename)));

  const file = new Moralis.File(filename, bufferArray, "image/png");

  const description = `
    This card will allow you to increase your character’s abilities.
    Their levels range from 5 to 30; Its use will be limited to one ability of the
    character (who has 15 in total). So if you want to increase the stats on all of
    them, you’ll need to purchase more cards.
  `.trim();

  const nftBaseAttributes = new NFTBaseAttributes();

  nftBaseAttributes.set('image', file);
  nftBaseAttributes.set('variation', variation);
  nftBaseAttributes.set('description', description);
  nftBaseAttributes.set(
    'nftAddress',
    "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0".toLowerCase()
  );

  nftBaseAttributes
    .save(null, { useMasterKey: true })
    .then((res: unknown) => {
      console.log(`NFTBaseAttributes Card variation ${variation} saved!`)
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
    "card-common.png",
    "card-rare.png",
    "card-epic.png",
    "card-pro.png",
    "card-legendary.png",
    "card-superlegendary.png"
  ];
  
  filenames.map((filename, index) => saveCard(
    filename,
    (index + 1).toString()
  ));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});