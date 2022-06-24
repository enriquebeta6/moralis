// Dependencies
import Moralis from 'moralis';

export default class NFTs extends Moralis.Object {
  constructor() {
    super('NFTs');
  }

  getSkillList() {
    return [
      'stamina',
      'rechargeTime',
      'staminaConsumption',
      'life',
      'letalDamage',
      'criticDamage',
      'sparkInventory',
      'plasticInventory',
      'recovery',
      'dash',
      'shield',
      'aimAssistence',
      'jump',
      'secrecy',
      'movementSpeed',
    ];
  }

  random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  randomItems<T>(items: T[], count: number) {
    return items.sort(() => Math.random() - Math.random()).slice(0, count);
  }

  total(arr: number[]) {
    let acc = 0;

    for (let i = 0; i < arr.length; i++) {
      acc = acc + arr[i];
    }

    return acc;
  }

  posMax(arr: number[]) {
    let max = 0;
    let j = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i];
        j = i;
      }
    }

    return j;
  }

  posMin(arr: number[]) {
    let min = 101;
    let j = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] < min) {
        min = arr[i];
        j = i;
      }
    }

    return j;
  }

  generateToyAttributes() {
    const skills = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < skills.length; i++) {
      skills[i] = this.random(60, 100);
    }

    let bad = true;

    while (bad) {
      const s = this.total(skills) - 1200;

      if (s == 0) {
        bad = false;
      } else {
        let j = 0;

        if (s > 0) {
          j = this.posMax(skills);
          if (skills[j] - s < 60) {
            skills[j] = 60;
          } else {
            skills[j] -= s;
          }
        } else {
          j = this.posMin(skills);

          if (skills[j] - s > 100) {
            skills[j] = 100;
          } else {
            skills[j] -= s;
          }
        }
      }
    }

    return this.getSkillList().reduce(
      (obj, skill, index) => ({
        ...obj,
        [skill]: skills[index] - 60,
      }),
      {},
    );
  }

  generateSkinAttributes() {
    const attributes: Record<string, number | string> = {};

    const skills = this.randomItems<string>(this.getSkillList(), 5);

    skills.forEach((skill, index) => {
      attributes[skill] = index + 1;
    });

    return attributes;
  }

  generateCardAttribute(variation: string) {
    const [skill] = this.randomItems<string>(this.getSkillList(), 1);

    type Attributes = Record<number, number>;

    const commons: Attributes = {};

    for (let i = 1, value = 5; i < 11; i++, value++) {
      commons[i] = value;
    }

    const rare: Attributes = {};

    for (let i = 11, value = 15; i < 17; i++, value++) {
      rare[i] = value;
    }

    const epic: Attributes = {};

    for (let i = 17, value = 21; i < 21; i++, value++) {
      epic[i] = value;
    }

    const pro: Attributes = {};

    for (let i = 21, value = 25; i < 24; i++, value++) {
      pro[i] = value;
    }

    const legendary: Attributes = {
      24: 28,
    };

    const superLegendary: Attributes = {
      25: 30,
    };

    const value = {
      ...commons,
      ...rare,
      ...epic,
      ...pro,
      ...legendary,
      ...superLegendary,
    }[variation];

    return {
      name: skill,
      value,
    };
  }

  generateAttributesByType(type: string, variant: string) {
    switch (type) {
      case 'TOY': {
        return this.generateToyAttributes();
      }

      case 'SKIN': {
        return this.generateSkinAttributes();
      }

      case 'CARD': {
        return this.generateCardAttribute(variant);
      }

      case 'MARKET':
      case 'WEAPON':
      case 'BATTERY_FACTORY':
      case 'MUNITION_FACTORY': {
        return {
          variant,
        };
      }

      default: {
        return {};
      }
    }
  }

  static async createItem({
    variation,
    tokenId,
    address,
  }: Record<string, string>) {
    const nftAddressesQuery = new Moralis.Query('NFTAddresses');

    nftAddressesQuery.equalTo('address', address);

    const nftAddressData = await nftAddressesQuery.first();

    if (typeof nftAddressData === 'undefined') {
      throw new Error('NFT address not found');
    }

    const nft = nftAddressData.get('type');

    const name = `${nft}-${tokenId}`;

    const nfts = new NFTs();

    let _variation = variation;

    if (nft === 'SKIN') {
      const variations = [1, 2, 3, 4, 5];
      
      _variation = nfts.randomItems(variations, 1).toString();
    }

    nfts.set('name', name);
    nfts.set('tokenId', tokenId);
    nfts.set('address', address);
    nfts.set('variation', _variation);
    nfts.set('attributes', nfts.generateAttributesByType(nft, variation));

    return nfts.save();
  }

  static async createLand({
    y,
    x,
    position,
    variation,
    tokenId,
    address,
  }: Record<string, string>) {
    const nfts = new NFTs();
    const name = `LAND-${tokenId}`;

    const attributes = {
      y,
      x,
      position,
    };

    nfts.set('name', name);
    nfts.set('tokenId', tokenId);
    nfts.set('address', address);
    nfts.set('variation', variation);
    nfts.set('attributes', attributes);

    return nfts.save();
  }

  static async getNFT({ type, tokenId }: Record<string, string>) {
    if (!tokenId) throw new Error('tokenId is required');
    if (!type) throw new Error('type is required');

    const nftAddressesQuery = new Moralis.Query('NFTAddresses');

    nftAddressesQuery.equalTo('type', type);

    const nftAddressData = await nftAddressesQuery.first();

    if (!nftAddressData) throw new Error('NFT Address not found');

    const nftAddress = nftAddressData.get('address');

    const nftsQuery = new Moralis.Query(NFTs);

    nftsQuery.equalTo('tokenId', tokenId);
    nftsQuery.equalTo('address', nftAddress);

    const nftData = await nftsQuery.first();

    if (!nftData) throw new Error('NFT not found');

    const variation = nftData.get('variation');

    const nftBaseAttributesQuery = new Moralis.Query('NFTBaseAttributes');

    nftBaseAttributesQuery.equalTo('variation', variation);
    nftBaseAttributesQuery.equalTo('nftAddress', nftAddress);

    const baseData = await nftBaseAttributesQuery.first();

    if (!baseData) {
      throw new Error('NFTBaseAttributes not found');
    }

    const baseAttributes = baseData.get('attributes');
    const nftAttributes = nftData.get('attributes');

    let attributes = nftAttributes;

    if (['TOY'].includes(type)) {
      const nfts = new NFTs();

      const removeAttributes = [
        'letalDamage',
        'criticDamage'
      ];

      attributes = nfts
        .getSkillList()
        .filter(skill => !removeAttributes.includes(skill))
        .reduce((obj: Record<string, number>, skill: string) => {
          return {
            ...obj,
            [skill]: baseAttributes[skill] + nftAttributes[skill],
          };
        }, {});
    }

    return {
      attributes,
      name: nftData.get('name'),
      image: baseData.get('image').url(),
      description: baseData.get('description'),
    };
  }
}