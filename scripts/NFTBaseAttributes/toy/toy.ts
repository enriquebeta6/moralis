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

  const buffer = readFileSync(join(__dirname, 'toy.png'));

  const image = Array.from(buffer);
  const file = new Moralis.File("toy", image, "image/png");

  const description = 'This toy has random stats, which you can improve through skill cards and skins that will also change your visual appearance.';

  const baseAttributes = {
    "life": 60,
    "dash": 60,
    "jump": 60,
    "shield": 60,
    "stamina": 60,
    "secrecy": 60,
    "recovery": 60,
    "ultimate": 60,
    "letalDamage": 60,
    "criticDamage": 60,
    "rechargeTime": 60,
    "aimAssistence": 60,
    "movementSpeed": 60,
    "sparkInventory": 60,
    "plasticInventory": 60,
    "staminaConsumption": 60
  };

  await Moralis.start(moralisConfig);

  const NFTBaseAttributes = Moralis.Object.extend("NFTBaseAttributes");

  const nftBaseAttributes = new NFTBaseAttributes();

  nftBaseAttributes.set('image', file);
  nftBaseAttributes.set('variation', "1");
  nftBaseAttributes.set('description', description);
  nftBaseAttributes.set('attributes', baseAttributes);
  nftBaseAttributes.set(
    'nftAddress',
    "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9".toLowerCase()
  );

  nftBaseAttributes
    .save(null, { useMasterKey: true })
    .then((res: unknown) => {
      console.log("NFTBaseAttributes Toy saved!")
      console.log(res);
    })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});