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

  const buffer = readFileSync(join(__dirname, 'market.png'));

  const image = Array.from(buffer);
  const file = new Moralis.File("market", image, "image/png");

  const description = '"But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"';

  await Moralis.start(moralisConfig);

  const NFTBaseAttributes = Moralis.Object.extend("NFTBaseAttributes");

  const nftBaseAttributes = new NFTBaseAttributes();

  nftBaseAttributes.set('image', file);
  nftBaseAttributes.set('variation', "1");
  nftBaseAttributes.set('description', description);
  nftBaseAttributes.set(
    'nftAddress',
    "0x759e32e4cef865699deea2b8ed265afb47f1469e".toLowerCase()
  );

  nftBaseAttributes
    .save(null, { useMasterKey: true })
    .then((res: unknown) => {
      console.log("NFTBaseAttributes Market saved!")
      console.log(res);
    })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});