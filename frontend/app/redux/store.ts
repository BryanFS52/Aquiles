import { configureStore } from "@reduxjs/toolkit";
import justificationReducer from "@slice/justificationSlice";
import justificationTypeReducer from "@slice/justificationTypeSlice";
import justificationStatusReducer from "./slices/justificationStatusSlice";
import checklistReducer from "@slice/checklistSlice";
import evaluationReducer from "@slice/evaluationSlice";
import studentReducer from "@slice/olympo/studentSlice";
import programReducer from "@slice/olympo/programSlice";
import studySheetReducer from "@slice/olympo/studySheetSlice";
import teamScrumReducer from "@slice/teamScrumSlice"
import attendancesReducer from "@slice/attendanceSlice"
import attendanceStateReducer from "@slice/attendanceStateSlice"
import competenceQuarterJustificationsReducer from "@slice/competenceQuarterJustificationsSlice"
import profileReducer from "@slice/atlas/profileSlice";
import processMethodologiesReducer from "@slice/atlas/processMethodologiesSlice";
import generateQrReducer from "@redux/slices/generateQrSlice";

const store = configureStore({
    reducer: {
        justification: justificationReducer,
        justificationType: justificationTypeReducer,
        justificationStatus: justificationStatusReducer,
        checklist: checklistReducer,
        evaluation: evaluationReducer,
        student: studentReducer,
        program: programReducer,
        studySheet: studySheetReducer,
        teamScrum: teamScrumReducer,
        attendances: attendancesReducer,
        attendanceState: attendanceStateReducer,
        competenceQuarterJustifications: competenceQuarterJustificationsReducer,
        profile: profileReducer,
        processMethodologies: processMethodologiesReducer,
        generateQr: generateQrReducer
    }
});

// store.ts
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;