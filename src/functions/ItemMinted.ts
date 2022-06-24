// Dependencies
import Moralis from 'moralis';

// Models
import NFTs from 'models/NFTs';

Moralis.Cloud.afterSave('ItemMinted', async function (request) {
  // @ts-ignore
  const logger = Moralis.Cloud.getLogger();
  const confirmed = request.object.get('confirmed');

  if (!confirmed) return;

  logger.info(`ItemMinted Object: ${JSON.stringify(request.object)}`);

  const variation = request.object.get('variation');
  const tokenId = request.object.get('tokenId');
  const address = request.object.get('nft');

  NFTs.createItem({ variation, tokenId, address }).then(
    (nft) => {
      logger.info(`NFT saved: ${JSON.stringify(nft)}`);
    },
    (error) => {
      logger.error(error.message);
    },
  );
});
