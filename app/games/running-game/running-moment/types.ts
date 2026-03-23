export interface GameConfig {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  descriptionCn: string;
  route: string;
  icon: string;
  coverImage: string;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  minPlayers: number;
  maxPlayers: number;
}
