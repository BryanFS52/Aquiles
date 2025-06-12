import { IconType } from 'react-icons';

export interface Program {
    id: number;
    name: string;
    description: string;
    icon: string;
}

export interface IconMapType {
    [key: string]: IconType;
}

export const programsData: Program[] = [
    {
        id: 1,
        name: "Análisis y Desarrollo de Software",
        description: "Programa para el desarrollo de soluciones informáticas.",
        icon: "FaComputer"
    },
    {
        id: 2,
        name: "Gestión Empresarial",
        description: "Preparación para la gestión eficiente de empresas.",
        icon: "AiOutlineStock"
    },
    {
        id: 3,
        name: "Gestión Bancaria y Financiera",
        description: "Formación en operaciones bancarias y financieras.",
        icon: "GiTakeMyMoney"
    },
    {
        id: 4,
        name: "Marketing Digital",
        description: "Estrategias modernas para el marketing en línea.",
        icon: "BsPersonRolodex"
    },
    {
        id: 5,
        name: "Contabilidad Financiera",
        description: "Fundamentos de contabilidad y gestión financiera.",
        icon: "SlCalculator"
    },
    {
        id: 6,
        name: "Gestión de Recursos Humanos",
        description: "Técnicas para la gestión efectiva del talento humano.",
        icon: "FaPeopleRoof"
    },
    {
        id: 7,
        name: "Administración Pública",
        description: "Preparación para roles administrativos en el sector público.",
        icon: "GrUserSettings"
    },
    {
        id: 8,
        name: "Idiomas Extranjeros",
        description: "Aprendizaje de lenguas extranjeras y cultura.",
        icon: "LiaLanguageSolid"
    },
    {
        id: 9,
        name: "Logística Empresarial",
        description: "Gestión de operaciones logísticas y cadena de suministro.",
        icon: "FaPeopleCarry"
    },
];

export const ITEMS_PER_PAGE = 4;