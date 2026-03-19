import type {
    ProcessMethodology,
    Profile,
    Student,
    TeamScrumMemberId,
    TeamsScrum,
    TeamsScrumDto,
} from "@/graphql/generated";

// ========================= MOCK START =========================
// TODO: BORRAR este archivo cuando se conecte backend real para Team Scrum.
// Cambiar a false para volver a usar la lógica funcional de backend.
export const USE_TEAM_SCRUM_MOCK = true;

export const MOCK_PROCESS_METHODOLOGIES: ProcessMethodology[] = [
    {
        id: "scrum",
        name: "Scrum",
        description: "Marco ágil basado en sprints",
        profiles: [
            { id: "scrum-master", name: "Scrum Master", isUnique: true },
            { id: "product-owner", name: "Product Owner", isUnique: true },
            { id: "dev-frontend", name: "Dev Frontend", isUnique: false },
            { id: "dev-backend", name: "Dev Backend", isUnique: false },
        ],
    },
    {
        id: "kanban",
        name: "Kanban",
        description: "Flujo continuo de trabajo",
        profiles: [
            { id: "flow-manager", name: "Flow Manager", isUnique: true },
            { id: "developer", name: "Developer", isUnique: false },
            { id: "qa", name: "QA", isUnique: false },
        ],
    },
];

export const MOCK_STUDENTS_BY_STUDY_SHEET: Record<number, Student[]> = {
    1: [
        { id: "1001", person: { name: "Laura", lastname: "Pérez" } },
        { id: "1002", person: { name: "Camilo", lastname: "Rojas" } },
        { id: "1003", person: { name: "Sara", lastname: "Gómez" } },
        { id: "1004", person: { name: "Kevin", lastname: "Martínez" } },
        { id: "1005", person: { name: "Diana", lastname: "Castro" } },
        { id: "1006", person: { name: "Juan", lastname: "López" } },
    ],
    2: [
        { id: "1101", person: { name: "Daniela", lastname: "Ruiz" } },
        { id: "1102", person: { name: "Esteban", lastname: "Vargas" } },
        { id: "1103", person: { name: "Paula", lastname: "León" } },
        { id: "1104", person: { name: "Miguel", lastname: "Córdoba" } },
        { id: "1105", person: { name: "Tatiana", lastname: "Ortiz" } },
        { id: "1106", person: { name: "Julián", lastname: "Sarmiento" } },
    ],
    3: [
        { id: "1201", person: { name: "Lorena", lastname: "Mora" } },
        { id: "1202", person: { name: "Sebastián", lastname: "Cárdenas" } },
        { id: "1203", person: { name: "Carolina", lastname: "Pineda" } },
        { id: "1204", person: { name: "Felipe", lastname: "Gaitán" } },
        { id: "1205", person: { name: "Andrea", lastname: "Galindo" } },
        { id: "1206", person: { name: "Santiago", lastname: "Navas" } },
    ],
};

const fallbackStudents: Student[] = [
    { id: "2001", person: { name: "Nicolás", lastname: "Muñoz" } },
    { id: "2002", person: { name: "Valentina", lastname: "Suárez" } },
    { id: "2003", person: { name: "Andrés", lastname: "Ramírez" } },
    { id: "2004", person: { name: "María", lastname: "Torres" } },
];

export const getMockStudentsByStudySheet = (studySheetId: number): Student[] => {
    return MOCK_STUDENTS_BY_STUDY_SHEET[studySheetId] ?? fallbackStudents;
};

const getProfileById = (profileId?: string | null): Profile | null => {
    if (!profileId) return null;
    const allProfiles = MOCK_PROCESS_METHODOLOGIES.flatMap((methodology) => methodology.profiles ?? []);
    return (allProfiles.find((profile) => profile?.id === profileId) as Profile) ?? null;
};

const teamMembersFromMemberIds = (
    memberIds: TeamScrumMemberId[] = [],
    studySheetId: number,
): Student[] => {
    const students = getMockStudentsByStudySheet(studySheetId);

    return memberIds.reduce<Student[]>((acc, member) => {
        const found = students.find((student) => Number(student.id) === Number(member.studentId));
        if (!found) return acc;

        const profile = getProfileById(member.profileId ?? undefined);
        acc.push({
            ...found,
            profiles: profile ? [profile] : [],
        });

        return acc;
    }, []);
};

export const createInitialMockTeams = (studySheetId: number): TeamsScrum[] => {
    const students = getMockStudentsByStudySheet(studySheetId);

    return [
        {
            id: "9001",
            teamName: "Team Aquiles",
            projectName: "Gestor de Evidencias",
            description: "Plataforma para centralizar evidencias de formación.",
            objectives: "Automatizar carga, revisión y trazabilidad de entregas.",
            problem: "Hay dispersión de evidencias y seguimiento manual.",
            projectJustification: "Reduce reprocesos y mejora visibilidad del avance.",
            processMethodology: MOCK_PROCESS_METHODOLOGIES[0],
            students: [
                { ...students[0], profiles: [{ id: "scrum-master", name: "Scrum Master", isUnique: true }] },
                { ...students[1], profiles: [{ id: "dev-frontend", name: "Dev Frontend", isUnique: false }] },
                { ...students[2], profiles: [{ id: "dev-backend", name: "Dev Backend", isUnique: false }] },
            ],
        },
    ];
};

export const buildMockTeamFromInput = (
    input: TeamsScrumDto,
    studySheetId: number,
): TeamsScrum => {
    const members = teamMembersFromMemberIds((input.memberIds ?? []) as TeamScrumMemberId[], studySheetId);
    const processMethodology =
        MOCK_PROCESS_METHODOLOGIES.find((methodology) => methodology.id === input.processMethodologyId) ??
        MOCK_PROCESS_METHODOLOGIES[0];

    return {
        id: String(Date.now()),
        teamName: input.teamName ?? "Nuevo Team",
        projectName: input.projectName ?? "Proyecto sin nombre",
        description: input.description ?? "",
        objectives: input.objectives ?? "",
        problem: input.problem ?? "",
        projectJustification: input.projectJustification ?? "",
        processMethodology,
        students: members,
    };
};

// ========================== MOCK END ==========================