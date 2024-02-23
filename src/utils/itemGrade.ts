import { ItemStatusName, getItemDetail, getItemSalesDetail } from '../api/item';
import items from '../data/gradeItems';
import { getKST } from './date';

type ConvertedItem = {
  Id: string;
  이름: string;
  부위: string;
  등급: string;
  퍼센트: number;
  힘_MAX: number;
  힘_NOW: number;
  지능_MAX: number;
  지능_NOW: number;
  체력_MAX: number;
  체력_NOW: number;
  정신력_MAX: number;
  정신력_NOW: number;
};

/**
 * 아이템 상세정보를 알맞게 가공하는 함수
 * - 힘, 지능, 체력, 정신력 최대치를 객체에 담아 반환
 */
const convertItemDetail = async (itemId: string) => {
  const itemDetail = await getItemDetail(itemId);

  return itemDetail.itemStatus.reduce((obj, status) => {
    if (status.name === '힘' || status.name === '지능' || status.name === '체력' || status.name === '정신력') {
      return { ...obj, [`${status.name}_MAX`]: status.value };
    }
    return obj;
  }, {} as Record<`${ItemStatusName}_MAX`, number>);
};

/**
 * 아이템 상점 판매 정보를 알맞게 가공하는 함수
 * - 등급, 퍼센트, 힘, 지능, 체력, 정신력 현재치를 객체에 담아 반환
 */
const convertItemSalesDetail = async (itemId: string) => {
  const itemSalesDetail = await getItemSalesDetail(itemId);

  const status = itemSalesDetail.itemStatus.reduce((obj, status) => {
    if (status.name === '힘' || status.name === '지능' || status.name === '체력' || status.name === '정신력') {
      return { ...obj, [`${status.name}_NOW`]: status.value };
    }
    return obj;
  }, {} as Record<`${ItemStatusName}_NOW`, number>);

  return { 등급: itemSalesDetail.itemGradeName, 퍼센트: itemSalesDetail.itemGradeValue, ...status };
};

/**
 * 아이템 등급 정보를 토대로 메시지를 생성하는 함수
 * - 해당 메시지를 디스코드 채널에 전송(등급 관련 채널)
 */
export const getItemGradesMessage = async () => {
  const itemList: ConvertedItem[] = [];

  for (const item of items) {
    const itemDetail = await convertItemDetail(item.itemId);
    const itemSalesDetail = await convertItemSalesDetail(item.itemId);

    itemList.push({
      Id: item.itemId,
      이름: item.itemName,
      부위: item.itemTypeDetial,
      ...itemDetail,
      ...itemSalesDetail,
    });
  }

  // 날짜 계산
  const kst = getKST();
  const year = kst.getFullYear();
  const month = `${kst.getMonth() + 1}`.padStart(2, '0');
  const date = `${kst.getDate()}`.padStart(2, '0');

  // 등급과 퍼센트는 첫 번째 아이템을 기준으로 표기
  let message = `## ${year}년 ${month}월 ${date}일 장비 등급은 ${itemList[0].등급}(${itemList[0].퍼센트}%)입니다!\n\n`;
  message += '```';

  // 반복문 돌면서 텍스트 생성
  // 개수는 계속 고정이기 때문에 하드코딩
  for (let i = 0; i < itemList.length; i++) {
    if (i === 0) message += '<방어구>\n';
    else if (i === 5) message += '<악세사리>\n';
    else if (i === 8) message += '<특수장비>\n';

    message += `- ${itemList[i].부위}: `;
    message += `힘(${itemList[i].힘_NOW}/${itemList[i].힘_MAX})${
      itemList[i].힘_NOW === itemList[i].힘_MAX ? '✨, ' : ', '
    }`;
    message += `지능(${itemList[i].지능_NOW}/${itemList[i].지능_MAX})${
      itemList[i].지능_NOW === itemList[i].지능_MAX ? '✨, ' : ', '
    }`;
    message += `체력(${itemList[i].체력_NOW}/${itemList[i].체력_MAX})${
      itemList[i].체력_NOW === itemList[i].체력_MAX ? '✨, ' : ', '
    }`;
    message += `정신력(${itemList[i].정신력_NOW}/${itemList[i].정신력_MAX})${
      itemList[i].정신력_NOW === itemList[i].정신력_MAX ? '✨' : ''
    }\n`;

    if (i === 4 || i === 7 || i === 11) message += '\n';
  }

  message += '\n※ 장비 능력치가 최대치인 경우, 우측에 ✨ 표시가 추가됩니다.';
  message += '\n※ 무기는 보통 마칼작을 하므로 제외했습니다.';
  message += '```';

  return message;
};
