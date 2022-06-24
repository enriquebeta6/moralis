// Dependencies
import Moralis from "moralis/node";
import { join } from 'node:path';
import { readFileSync } from 'node:fs';

async function main() {
  const { APP_ID, SERVER_URL, MASTER_KEY } = process.env;
  
  const moralisConfig = {
    appId: APP_ID,
    serverUrl: SERVER_URL,
    masterKey: MASTER_KEY,
  };

  const buffer = readFileSync(join(__dirname, 'land.png'));

  const image = Array.from(buffer);
  const file = new Moralis.File("land", image, "image/png");

  const description = `
    A Land is a space inside ToysLand where you can build your empire as a merchant.
    To have the establishments it is necessary to have a Land.
  `;

  await Moralis.start(moralisConfig);

  const NFTBaseAttributes = Moralis.Object.extend("NFTBaseAttributes");

  const nftBaseAttributes = new NFTBaseAttributes();

  nftBaseAttributes.set('image', file);
  nftBaseAttributes.set('variation', "0");
  nftBaseAttributes.set('description', description);
  nftBaseAttributes.set(
    'nftAddress',
    "0x0386a3758a2ad47bef79c27a67606bcab41de7a4".toLowerCase()
  );

  nftBaseAttributes
    .save(null, { useMasterKey: true })
    .then((res: unknown) => {
      console.log("NFTBaseAttributes Land saved!")
      console.log(res);
    })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});