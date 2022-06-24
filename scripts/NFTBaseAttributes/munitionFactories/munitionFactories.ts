// Dependencies
import Moralis from "moralis/node";
import { join } from 'node:path';
import { readFileSync } from 'node:fs';

async function saveMunitionFactory(filename: string, variation: string) {
  const NFTBaseAttributes = Moralis.Object.extend("NFTBaseAttributes");

  const bufferArray = Array.from(readFileSync(join(__dirname, filename)));

  const file = new Moralis.File(filename, bufferArray, "image/png");

  const description = 'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.';

  const nftBaseAttributes = new NFTBaseAttributes();

  nftBaseAttributes.set('image', file);
  nftBaseAttributes.set('variation', variation);
  nftBaseAttributes.set('description', description);
  nftBaseAttributes.set(
    'nftAddress',
    "0xa513e6e4b8f2a923d98304ec87f64353c4d5c853".toLowerCase()
  );

  nftBaseAttributes
    .save(null, { useMasterKey: true })
    .then((res: unknown) => {
      console.log(
        `NFTBaseAttributes Munition Factory variation ${variation} saved!`
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
    "munition-common.png",
    "munition-pro.png",
    "munition-legendary.png",
  ];
  
  filenames.map((filename, index) => saveMunitionFactory(
    filename,
    (index + 1).toString()
  ));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});