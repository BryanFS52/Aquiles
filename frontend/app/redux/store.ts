import { configureStore } from "@reduxjs/toolkit";
import justificationReducer from "@slice/justificationSlice";
import justificationTypeReducer from "@slice/justificationTypeSlice";
import checklistReducer from "@slice/checklistSlice";
import studentReducer from "@slice/olympo/studentSlice";
import programReducer from "@slice/olympo/programSlice";
import studySheetReducer from "@slice/olympo/studySheetSlice";
import teamScrumReducer from "@slice/teamScrumSlice"
import attendancesReducer from "@slice/attendanceSlice"
import attendanceStateReducer from "@slice/attendanceStateSlice"
import profileReducer from "@slice/atlas/profileSlice";

const store = configureStore({
    reducer: {
        justification: justificationReducer,
        justificationType: justificationTypeReducer,
        checklist: checklistReducer,
        student: studentReducer,
        program: programReducer,
        studySheet: studySheetReducer,
        teamScrum: teamScrumReducer,
        attendances: attendancesReducer,
        attendanceState: attendanceStateReducer,
        profile: profileReducer
    }
});

// store.ts
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;