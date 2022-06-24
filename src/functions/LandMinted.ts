// Dependencies
import Moralis from 'moralis';

// Models
import NFTs from 'models/NFTs';

Moralis.Cloud.afterSave('LandMinted', async function (request) {
  // @ts-ignore
  const logger = Moralis.Cloud.getLogger();
  const confirmed = request.object.get('confirmed');

  if (!confirmed) return;

  const nftAddressesQuery = new Moralis.Query('NFTAddresses');

  nftAddressesQuery.equalTo('type', 'LAND');

  const nftAddressData = await nftAddressesQuery.first();

  if (typeof nftAddressData === 'undefined') {
    throw new Error('NFT address not found');
  }

  logger.info(`LandMinted Object: ${JSON.stringify(request.object)}`);

  const address = nftAddressData.get('address');

  const y = request.object.get('y');
  const x = request.object.get('x');
  const position = request.object.get('position');
  const tokenId = request.object.get('tokenId');
  const variation = request.object.get('variation');

  NFTs.createLand({
    y,
    x,
    position,
    variation,
    tokenId,
    address,
  }).then(
    (land) => {
      logger.info(`Land saved: ${JSON.stringify(land)}`);
    },
    (error) => {
      logger.error(error.message);
    },
  );
});
