export interface OpenseaCollectionContract {
  address: string;
  chain: string;
  collection: string;
  contract_standard: string;
  name: string;
  total_supply: number;
}

export interface OpenseaCollection {
  collection: string;
  name: string;
  description: string;
  image_url: string;
  banner_image_url: string;
  owner: string;
  safelist_status: Record<string, unknown>;
  category: string;
  is_disabled: boolean;
  is_nsfw: boolean;
  trait_offers_enabled: boolean;
  collection_offers_enabled: boolean;
  opensea_url: string;
  project_url: string;
  wiki_url: string;
  discord_url: string;
  telegram_url: string;
  twitter_username: string;
  instagram_username: string;
  contracts: Contract[];
  editors: string[];
  fees: Fee[];
  required_zone: string;
  rarity: Rarity;
  payment_tokens: PaymentToken[];
  total_supply: number;
  created_date: string; // Assuming ISO 8601 date format
}

interface Contract {
  address: string;
}

interface Fee {
  fee: number;
  recipient: string;
  required: boolean;
}

interface Rarity {
  strategy_version: string;
  calculated_at: string; // ISO 8601 datetime
  max_rank: number;
  total_supply: number;
}

interface PaymentToken {
  symbol: string;
  address: string;
  chain: string;
  image: string;
  name: string;
  decimals: number;
  eth_price: string;
  usd_price: string;
}

export interface OpenseaNFT {
  nft: {
    identifier: string;
    collection: string;
    contract: string;
    token_standard: string;
    name: string;
    description: string;
    image_url: string;
    display_image_url: string;
    display_animation_url: string;
    metadata_url: string;
    opensea_url: string;
    updated_at: string;
    is_disabled: boolean;
    is_nsfw: boolean;
    animation_url: string;
    is_suspicious: boolean;
    creator: string;
    traits: Trait[];
    owners: Owner[];
    rarity: Rarity;
  };
}

interface Trait {
  trait_type: string;
  display_type: string;
  max_value: string;
  value: number;
}

interface Owner {
  address: string;
  quantity: number;
}

interface Rarity {
  strategy_version: string;
  rank: number;
  score: number;
  calculated_at: string; // Assuming ISO 8601 datetime
  max_rank: number;
  total_supply: number;
  ranking_features: RankingFeatures;
}

interface RankingFeatures {
  unique_attribute_count: number;
}

export interface OpenseaNFTListResponse {
  nfts: OpenseaNFT[];
  next: string;
}

export interface OpenseaNFT {
  identifier: string;
  collection: string;
  contract: string;
  token_standard: string;
  name: string;
  description: string;
  image_url: string;
  display_image_url: string;
  display_animation_url: string;
  metadata_url: string;
  opensea_url: string;
  updated_at: string;
  is_disabled: boolean;
  is_nsfw: boolean;
}
