import { Checklist, StudySheet, Student } from '@graphql/generated'
export interface TeamScrumItem {
    id: string;
    teamName: string;
    projectName: string
    problem: string
    objectives: string
    description: String
    projectJustification: string
    checklist: Checklist
    studySheet: StudySheet
    students: [Student]
}