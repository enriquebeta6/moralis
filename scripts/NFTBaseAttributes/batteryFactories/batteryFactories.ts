// Dependencies
import Moralis from "moralis/node";
import { join } from 'node:path';
import { readFileSync } from 'node:fs';

async function saveBatteryFactory(filename: string, variation: string) {
  const NFTBaseAttributes = Moralis.Object.extend("NFTBaseAttributes");

  const bufferArray = Array.from(readFileSync(join(__dirname, filename)));

  const file = new Moralis.File(filename, bufferArray, "image/png");

  const description = 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.';

  const nftBaseAttributes = new NFTBaseAttributes();

  nftBaseAttributes.set('image', file);
  nftBaseAttributes.set('variation', variation);
  nftBaseAttributes.set('description', description);
  nftBaseAttributes.set(
    'nftAddress',
    "0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6".toLowerCase()
  );

  nftBaseAttributes
    .save(null, { useMasterKey: true })
    .then((res: unknown) => {
      console.log(
        `NFTBaseAttributes Battery Factory variation ${variation} saved!`
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
    "battery-common.png",
    "battery-pro.png",
    "battery-legendary.png",
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