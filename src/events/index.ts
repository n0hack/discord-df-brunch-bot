import { Client, GuildMember, Message } from 'discord.js';
import { getItemGradesMessage } from '../utils/itemGrade';
import { getKST } from '../utils/date';

/**
 * 디스코드 봇 로그인 이벤트
 */
export const initialize = (client: Client<true>) => {
  console.log(`${client.user.tag} Bot 로그인!`);
};

/**
 * 신규 멤버 환영 이벤트
 */
export const greetingToNewMember = (member: GuildMember) => {
  const channel = member.guild.channels.cache.find((ch) => ch.type === 0 && ch.name === '채팅');
  const message = `${member}님 안녕하세요. 디스코드 브런치 서버에 오신 걸 환영합니다!\n규칙 반드시 숙지해 주시고, 디스코드 닉네임도 인게임과 동일하게 변경해 주세요!`;

  (channel as any).send(message);
};

/**
 * 오늘의 등급 알림 이벤트
 * - 매일 자정마다 실행
 */
export const notifyTodayGrade = (client: Client) => {
  const channel = client.channels.cache.find((ch) => ch.type === 0 && ch.name === '오늘의-등급');

  setInterval(async () => {
    const kst = getKST();

    if (kst.getHours() === 0 && kst.getMinutes() === 0 && kst.getSeconds() === 0) {
      const todayGrade = await getItemGradesMessage();
      (channel as any).send(todayGrade);
    }
  }, 1000);
};

/**
 * 메시지 테스트 이벤트
 */
export const testMessage = async (message: Message) => {
  if (message.author.bot) return;

  if (message.content === '단진 안녕') {
    message.reply('안녕하세요!');
  }
};
