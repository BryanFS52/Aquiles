import { IconType } from 'react-icons';

export interface Program {
  id: number;
  name: string;
  description: string;
  icon: keyof IconMapType;
}

export interface IconMapType {
  FaComputer: IconType;
  AiOutlineStock: IconType;
  GiTakeMyMoney: IconType;
  BsPersonRolodex: IconType;
  SlCalculator: IconType;
  FaPeopleRoof: IconType;
  GrUserSettings: IconType;
  LiaLanguageSolid: IconType;
  FaPeopleCarry: IconType;
}

export const ITEMS_PER_PAGE = 8;

