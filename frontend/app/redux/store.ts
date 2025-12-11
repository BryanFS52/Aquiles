import { configureStore } from "@reduxjs/toolkit";
import attendancesReducer from "@slice/attendanceSlice"
import attendanceStateReducer from "@slice/attendanceStateSlice"
import generateQrReducer from "@redux/slices/generateQrSlice";
import sendEmailReducer from "@redux/slices/sendEmailSlice";
import justificationReducer from "@slice/justificationSlice";
import justificationTypeReducer from "@slice/justificationTypeSlice";
import justificationStatusReducer from "./slices/justificationStatusSlice";
import checklistReducer from "@slice/checklistSlice";
import evaluationReducer from "@slice/evaluationSlice";
import studySheetReducer from "@slice/olympo/studySheetSlice";
import studentReducer from "@slice/olympo/studentSlice";
import programReducer from "@slice/olympo/programSlice";
import collaboratorReducer from "@/redux/slices/olympo/coordinationSlice";
import teamScrumReducer from "@slice/teamScrumSlice"
import processMethodologiesReducer from "@slice/atlas/processMethodologiesSlice";
import profileReducer from "@slice/atlas/profileSlice";
import improvementPlanReducer from "@redux/slices/improvementPlanSlice"
import improvementPlanActivityReducer from "@redux/slices/improvementPlanActivitySlice"
import noveltyReducer from "@slice/themis/noveltySlice";
import noveltyTypeReducer from "@slice/themis/noveltyTypeSlice";
import coordinationReducer from "@slice/olympo/coordinationSlice";
import faultTypeReducer from "@/redux/slices/improvementPlanFaultTypeSlice";
import finalReportReducer from "@redux/slices/finalReportSlice"
import authReducer from "@redux/slices/cerberos/authSlice";


const store = configureStore({
    reducer: {
        auth: authReducer,
        justification: justificationReducer,
        justificationType: justificationTypeReducer,
        justificationStatus: justificationStatusReducer,
        checklist: checklistReducer,
        evaluation: evaluationReducer,
        student: studentReducer,
        program: programReducer,
        studySheet: studySheetReducer,
        collaborator: collaboratorReducer,
        teamScrum: teamScrumReducer,
        attendances: attendancesReducer,
        attendanceState: attendanceStateReducer,
        profile: profileReducer,
        processMethodologies: processMethodologiesReducer,
        generateQr: generateQrReducer,
        sendEmail: sendEmailReducer,
        improvementPlan: improvementPlanReducer,
        improvementPlanActivity: improvementPlanActivityReducer,
        novelty: noveltyReducer,
        noveltyType: noveltyTypeReducer,
        coordination: coordinationReducer,
        faultType: faultTypeReducer,
        finalReport: finalReportReducer,
        trainingProject: trainingProjectReducer,
    }
});

// store.ts
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;