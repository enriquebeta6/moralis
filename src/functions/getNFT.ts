// Dependencies
import Moralis from 'moralis';

// Models
import NFTs from 'models/NFTs';

interface Params {
  type: string;
  tokenId: string;
}

Moralis.Cloud.define('getNFT', async (request) => {
  const { type, tokenId } = request.params as Params;

  return NFTs.getNFT({ type, tokenId });
});
