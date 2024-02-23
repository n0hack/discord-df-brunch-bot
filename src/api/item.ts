import client, { NEOPLE_API_KEY } from './client';

export type ItemStatusName = '힘' | '지능' | '체력' | '정신력';

type ItemStatus = {
  name: ItemStatusName;
  value: number;
};

type ItemDetail = {
  itemStatus: ItemStatus[];
};

type ItemSalesDetail = ItemDetail & {
  itemGradeName: string;
  itemGradeValue: number;
};

export const getItemDetail = async (itemId: string) => {
  const res = await client.get<ItemDetail>(`https://api.neople.co.kr/df/items/${itemId}?apikey=${NEOPLE_API_KEY}`);
  return res.data;
};

export const getItemSalesDetail = async (itemId: string) => {
  const res = await client.get<ItemSalesDetail>(
    `https://api.neople.co.kr/df/items/${itemId}/shop?apikey=${NEOPLE_API_KEY}`
  );
  return res.data;
};
