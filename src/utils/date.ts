/**
 * 환경 상관 없이 한국 시간을 가져오는 함수
 */
export const getKST = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  return new Date(utc + 9 * 60 * 60 * 1000);
};
