import { QUESTIONS_PART_1 } from './data1.ts';
import { QUESTIONS_PART_2 } from './data2.ts';
import { Question } from './types.ts';

export interface CategoryInfo {
  id: number;
  number: number;
  titleRu: string;
  titleHy: string;
  titleEs: string;
  iconName: string;
  range: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 1,
    number: 1,
    titleRu: "Первое знакомство",
    titleHy: "Առաջին ծանոթությունը",
    titleEs: "Primer encuentro",
    iconName: "Handshake",
    range: "1 - 10"
  },
  {
    id: 2,
    number: 2,
    titleRu: "Чтобы продолжить разговор",
    titleHy: "Խոսակցությունը շարունակելու համար",
    titleEs: "Continuar la conversación",
    iconName: "MessageCircle",
    range: "11 - 20"
  },
  {
    id: 3,
    number: 3,
    titleRu: "Школа и новые друзья",
    titleHy: "Դպրոց և նոր ընկերներ",
    titleEs: "Escuela y nuevos amigos",
    iconName: "GraduationCap",
    range: "21 - 30"
  },
  {
    id: 4,
    number: 4,
    titleRu: "Футбол с новыми друзьями",
    titleHy: "Ֆուտբոլ նոր ընկերների հետ",
    titleEs: "Fútbol con amigos",
    iconName: "Trophy",
    range: "31 - 40"
  },
  {
    id: 5,
    number: 5,
    titleRu: "Свободное время",
    titleHy: "Ազատ ժամանակ",
    titleEs: "Tiempo libre",
    iconName: "Gamepad2",
    range: "41 - 50"
  },
  {
    id: 6,
    number: 6,
    titleRu: "Еда и кафе с друзьями",
    titleHy: "Ուտելիք և սրճարան ընկերների հետ",
    titleEs: "Comida y cafetería",
    iconName: "Utensils",
    range: "51 - 60"
  },
  {
    id: 7,
    number: 7,
    titleRu: "Про семью и жизнь",
    titleHy: "Ընտանիքի և կյանքի մասին",
    titleEs: "Familia y vida",
    iconName: "Heart",
    range: "61 - 70"
  },
  {
    id: 8,
    number: 8,
    titleRu: "Про прошлое",
    titleHy: "Անցյալի մասին",
    titleEs: "El pasado",
    iconName: "History",
    range: "71 - 80"
  },
  {
    id: 9,
    number: 9,
    titleRu: "Про планы",
    titleHy: "Պլանների մասին",
    titleEs: "Los planes",
    iconName: "Calendar",
    range: "81 - 90"
  },
  {
    id: 10,
    number: 10,
    titleRu: "Быстрая разговорная реакция",
    titleHy: "Արագ խոսակցական արձագանք",
    titleEs: "Reacción rápida",
    iconName: "Zap",
    range: "91 - 100"
  }
];

export const ALL_QUESTIONS: Question[] = [
  ...QUESTIONS_PART_1,
  ...QUESTIONS_PART_2
];
