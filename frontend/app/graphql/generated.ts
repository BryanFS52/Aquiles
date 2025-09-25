import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Long: { input: any; output: any; }
  ObjectId: { input: any; output: any; }
};

export type Administrative = {
  administrativeType?: Maybe<AdministrativeType>;
  collaborator?: Maybe<Collaborator>;
  committees?: Maybe<Array<Maybe<Committee>>>;
  extensionMail?: Maybe<Scalars['String']['output']>;
  extensionPhone?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  novelties?: Maybe<Array<Maybe<Novelty>>>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type AdministrativeDto = {
  administrativeType?: InputMaybe<AdministrativeTypeDto>;
  collaborator?: InputMaybe<CollaboratorDto>;
  extensionMail?: InputMaybe<Scalars['String']['input']>;
  extensionPhone?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AdministrativePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Administrative>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type AdministrativeType = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type AdministrativeTypeDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AdministrativeTypePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<AdministrativeType>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type Attendance = {
  attendanceDate?: Maybe<Scalars['String']['output']>;
  attendanceState?: Maybe<AttendanceState>;
  competenceQuarter?: Maybe<TeacherStudySheet>;
  id: Scalars['ID']['output'];
  justification?: Maybe<Justification>;
  student?: Maybe<Student>;
};

export type AttendanceDto = {
  attendanceDate?: InputMaybe<Scalars['String']['input']>;
  attendanceState?: InputMaybe<AttendanceStateDto>;
  competenceQuarter?: InputMaybe<Scalars['Long']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  studentId?: InputMaybe<Scalars['Long']['input']>;
};

export type AttendancePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Attendance>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type AttendancePageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Attendance>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type AttendanceState = {
  id?: Maybe<Scalars['ID']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type AttendanceStateDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type AttendanceStatePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<AttendanceState>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type AttendanceStatePageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<AttendanceState>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type ChangeLog = {
  changedBy?: Maybe<Scalars['String']['output']>;
  changedDate?: Maybe<Scalars['DateTime']['output']>;
  changes?: Maybe<Scalars['JSON']['output']>;
  revision?: Maybe<Scalars['Int']['output']>;
};

export type ChangeLogDto = {
  changedBy?: InputMaybe<Scalars['String']['input']>;
  changedDate?: InputMaybe<Scalars['DateTime']['input']>;
  changes?: InputMaybe<Scalars['JSON']['input']>;
  revision?: InputMaybe<Scalars['Int']['input']>;
};

export type ChangeLogPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<ChangeLog>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type Checklist = {
  associatedJuries?: Maybe<Array<Maybe<Juries>>>;
  component?: Maybe<Scalars['String']['output']>;
  evaluationCriteria?: Maybe<Scalars['Boolean']['output']>;
  evaluations?: Maybe<Evaluation>;
  id: Scalars['ID']['output'];
  instructorSignature?: Maybe<Scalars['String']['output']>;
  items?: Maybe<Array<Maybe<Item>>>;
  remarks?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
  studySheets?: Maybe<Scalars['String']['output']>;
  trainingProjectId?: Maybe<Scalars['Long']['output']>;
  trainingProjectName?: Maybe<Scalars['String']['output']>;
  trimester?: Maybe<Scalars['String']['output']>;
};

export type ChecklistDto = {
  associatedJuries?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  component?: InputMaybe<Scalars['String']['input']>;
  deletedItemIds?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  evaluationCriteria: Scalars['Boolean']['input'];
  evaluationId?: InputMaybe<Scalars['Long']['input']>;
  evaluations?: InputMaybe<Array<InputMaybe<EvaluationDto>>>;
  instructorSignature: Scalars['String']['input'];
  items?: InputMaybe<Array<InputMaybe<ItemDto>>>;
  remarks: Scalars['String']['input'];
  state: Scalars['Boolean']['input'];
  studySheets?: InputMaybe<Scalars['String']['input']>;
  trainingProjectId?: InputMaybe<Scalars['Long']['input']>;
  trainingProjectName?: InputMaybe<Scalars['String']['input']>;
  trimester: Scalars['String']['input'];
};

export type ChecklistHistory = {
  actions?: Maybe<Scalars['String']['output']>;
  checklistId?: Maybe<Scalars['Long']['output']>;
  date?: Maybe<Scalars['String']['output']>;
  dateAfter?: Maybe<Scalars['String']['output']>;
  dateBefore?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  teacher?: Maybe<Scalars['String']['output']>;
};

export type ChecklistHistoryDto = {
  actions: Scalars['String']['input'];
  checklistId: Scalars['ID']['input'];
  date: Scalars['String']['input'];
  dateAfter?: InputMaybe<Scalars['String']['input']>;
  dateBefore?: InputMaybe<Scalars['String']['input']>;
  teacher: Scalars['String']['input'];
};

export type ChecklistHistoryPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<ChecklistHistory>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type ChecklistPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Checklist>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type ChecklistPageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Checklist>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type ClassType = {
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type ClassTypeDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ClassTypePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<ClassType>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type Collaborator = {
  administrative?: Maybe<Administrative>;
  contractType?: Maybe<ContractType>;
  coordination?: Maybe<Coordination>;
  endDate?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  laborDepartment?: Maybe<LaborDepartment>;
  person?: Maybe<Person>;
  starDate?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
  teacher?: Maybe<Teacher>;
};

export type CollaboratorDto = {
  contractType?: InputMaybe<ContractTypeDto>;
  coordination?: InputMaybe<CoordinationDto>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  laborDepartment?: InputMaybe<LaborDepartmentDto>;
  person?: InputMaybe<PersonDto>;
  starDate?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CollaboratorPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Collaborator>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type Committee = {
  administratives?: Maybe<Array<Maybe<Administrative>>>;
  committeeEvents?: Maybe<Array<Maybe<CommitteeEvent>>>;
  coordination?: Maybe<Coordination>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isCurrent?: Maybe<Scalars['Boolean']['output']>;
  students?: Maybe<Array<Maybe<Student>>>;
  teachers?: Maybe<Array<Maybe<Teacher>>>;
};

export type CommitteeDto = {
  administrativesIds?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  coordinationId?: InputMaybe<Scalars['Long']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isCurrent?: InputMaybe<Scalars['Boolean']['input']>;
  studentsIds?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  teachersIds?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
};

export type CommitteeEmailResponse = {
  code: Scalars['String']['output'];
  committeeEventId?: Maybe<Scalars['Long']['output']>;
  message: Scalars['String']['output'];
  recipients?: Maybe<Array<Scalars['String']['output']>>;
  totalRecipients?: Maybe<Scalars['Int']['output']>;
};

export type CommitteeEvent = {
  committee?: Maybe<Committee>;
  coordinationName?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['String']['output']>;
  finishedAt?: Maybe<Scalars['String']['output']>;
  hour?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  minutes?: Maybe<Array<Maybe<Minute>>>;
  novelties?: Maybe<Array<Maybe<Novelty>>>;
  session?: Maybe<Scalars['String']['output']>;
};

export type CommitteeEventDto = {
  committee?: InputMaybe<CommitteeDto>;
  coordinationName?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  finishedAt?: InputMaybe<Scalars['String']['input']>;
  hour?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  minutes?: InputMaybe<Array<InputMaybe<MinuteDto>>>;
  session?: InputMaybe<Scalars['String']['input']>;
};

export type CommitteeEventInput = {
  committee?: InputMaybe<CommitteeInput>;
  committeeId: Scalars['Long']['input'];
  date: Scalars['String']['input'];
  endHour: Scalars['String']['input'];
  id?: InputMaybe<Scalars['Long']['input']>;
  startHour: Scalars['String']['input'];
};

export type CommitteeEventPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<CommitteeEvent>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type CommitteeInput = {
  administrativesIds: Array<Scalars['Long']['input']>;
  committeeEvents?: InputMaybe<Array<CommitteeEventInput>>;
  coordinationId: Scalars['Long']['input'];
  id?: InputMaybe<Scalars['Long']['input']>;
  isActive: Scalars['Boolean']['input'];
  isCurrent: Scalars['Boolean']['input'];
  studentsIds: Array<Scalars['Long']['input']>;
  teachersIds: Array<Scalars['Long']['input']>;
};

export type CommitteeNoveltyObservationInput = {
  observation?: InputMaybe<Scalars['String']['input']>;
  studentId?: InputMaybe<Scalars['Long']['input']>;
};

export type CommitteePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Committee>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type Company = {
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type CompanyDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CompanyPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Company>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type CompetenceDto = {
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phases?: InputMaybe<Array<InputMaybe<PhaseDto>>>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Competences = {
  code?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  learningOutcome?: Maybe<Array<Maybe<LearningOutcome>>>;
  name?: Maybe<Scalars['String']['output']>;
  phases?: Maybe<Array<Maybe<Phase>>>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type CompetencesPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Competences>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type Condition = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type ConditionDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ConditionDetails = {
  condition?: Maybe<Condition>;
  id?: Maybe<Scalars['ID']['output']>;
  percentage?: Maybe<Scalars['Int']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
  teacher?: Maybe<Teacher>;
};

export type ConditionDetailsPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<ConditionDetails>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type ConditionPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Condition>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type ContractType = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type ContractTypeDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ContractTypePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<ContractType>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type Coordination = {
  committees?: Maybe<Array<Maybe<Committee>>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
  teachers?: Maybe<Array<Maybe<Teacher>>>;
  trainingCenter?: Maybe<TrainingCenter>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type CoordinationDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
  trainingCenter?: InputMaybe<TrainingCenterDto>;
};

export type CoordinationPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Coordination>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type DetailConditionDto = {
  condition?: InputMaybe<ConditionDto>;
  id?: InputMaybe<Scalars['ID']['input']>;
  percentage?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
  teacher?: InputMaybe<TeacherDto>;
};

export type DocumentType = {
  acronym?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type DocumentTypeDto = {
  acronym?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * extend type Mutation {
 *     addChecklistQualification(input: ChecklistQualificationDto): Response
 *     updateChecklistQualification(id: Long!, input: ChecklistQualificationDto): Response
 *     deleteChecklistQualification(id: Long!): Response
 * }
 */
export type EmailRequest = {
  email: Scalars['String']['input'];
  htmlContent: Scalars['String']['input'];
  subject: Scalars['String']['input'];
};

export type EmailResponse = {
  code: Scalars['String']['output'];
  emailDestinatario?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  noveltyId?: Maybe<Scalars['String']['output']>;
  totalDestinatarios?: Maybe<Scalars['Int']['output']>;
};

export type Environment = {
  capacity?: Maybe<Scalars['Int']['output']>;
  classTypes?: Maybe<Array<Maybe<ClassType>>>;
  coordinations?: Maybe<Array<Maybe<Coordination>>>;
  floor?: Maybe<Floor>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type EnvironmentDto = {
  capacity?: InputMaybe<Scalars['Int']['input']>;
  classTypes?: InputMaybe<Array<InputMaybe<ClassTypeDto>>>;
  coordinations?: InputMaybe<Array<InputMaybe<CoordinationDto>>>;
  floor?: InputMaybe<FloorDto>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type EnvironmentPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Environment>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export enum ErrorDetail {
  /**
   * The deadline expired before the operation could complete.
   *
   * For operations that change the state of the system, this error
   * may be returned even if the operation has completed successfully.
   * For example, a successful response from a server could have been
   * delayed long enough for the deadline to expire.
   *
   * HTTP Mapping: 504 Gateway Timeout
   * Error Type: UNAVAILABLE
   */
  DeadlineExceeded = 'DEADLINE_EXCEEDED',
  /**
   * The server detected that the client is exhibiting a behavior that
   * might be generating excessive load.
   *
   * HTTP Mapping: 420 Enhance Your Calm
   * Error Type: UNAVAILABLE
   */
  EnhanceYourCalm = 'ENHANCE_YOUR_CALM',
  /**
   * The requested field is not found in the schema.
   *
   * This differs from `NOT_FOUND` in that `NOT_FOUND` should be used when a
   * query is valid, but is unable to return a result (if, for example, a
   * specific video id doesn't exist). `FIELD_NOT_FOUND` is intended to be
   * returned by the server to signify that the requested field is not known to exist.
   * This may be returned in lieu of failing the entire query.
   * See also `PERMISSION_DENIED` for cases where the
   * requested field is invalid only for the given user or class of users.
   *
   * HTTP Mapping: 404 Not Found
   * Error Type: BAD_REQUEST
   */
  FieldNotFound = 'FIELD_NOT_FOUND',
  /**
   * The client specified an invalid argument.
   *
   * Note that this differs from `FAILED_PRECONDITION`.
   * `INVALID_ARGUMENT` indicates arguments that are problematic
   * regardless of the state of the system (e.g., a malformed file name).
   *
   * HTTP Mapping: 400 Bad Request
   * Error Type: BAD_REQUEST
   */
  InvalidArgument = 'INVALID_ARGUMENT',
  /**
   * The provided cursor is not valid.
   *
   * The most common usage for this error is when a client is paginating
   * through a list that uses stateful cursors. In that case, the provided
   * cursor may be expired.
   *
   * HTTP Mapping: 404 Not Found
   * Error Type: NOT_FOUND
   */
  InvalidCursor = 'INVALID_CURSOR',
  /**
   * Unable to perform operation because a required resource is missing.
   *
   * Example: Client is attempting to refresh a list, but the specified
   * list is expired. This requires an action by the client to get a new list.
   *
   * If the user is simply trying GET a resource that is not found,
   * use the NOT_FOUND error type. FAILED_PRECONDITION.MISSING_RESOURCE
   * is to be used particularly when the user is performing an operation
   * that requires a particular resource to exist.
   *
   * HTTP Mapping: 400 Bad Request or 500 Internal Server Error
   * Error Type: FAILED_PRECONDITION
   */
  MissingResource = 'MISSING_RESOURCE',
  /**
   * Service Error.
   *
   * There is a problem with an upstream service.
   *
   * This may be returned if a gateway receives an unknown error from a service
   * or if a service is unreachable.
   * If a request times out which waiting on a response from a service,
   * `DEADLINE_EXCEEDED` may be returned instead.
   * If a service returns a more specific error Type, the specific error Type may
   * be returned instead.
   *
   * HTTP Mapping: 502 Bad Gateway
   * Error Type: UNAVAILABLE
   */
  ServiceError = 'SERVICE_ERROR',
  /**
   * Request failed due to network errors.
   *
   * HTTP Mapping: 503 Unavailable
   * Error Type: UNAVAILABLE
   */
  TcpFailure = 'TCP_FAILURE',
  /**
   * Request throttled based on server concurrency limits.
   *
   * HTTP Mapping: 503 Unavailable
   * Error Type: UNAVAILABLE
   */
  ThrottledConcurrency = 'THROTTLED_CONCURRENCY',
  /**
   * Request throttled based on server CPU limits
   *
   * HTTP Mapping: 503 Unavailable.
   * Error Type: UNAVAILABLE
   */
  ThrottledCpu = 'THROTTLED_CPU',
  /**
   * The server detected that the client is exhibiting a behavior that
   * might be generating excessive load.
   *
   * HTTP Mapping: 429 Too Many Requests
   * Error Type: UNAVAILABLE
   */
  TooManyRequests = 'TOO_MANY_REQUESTS',
  /**
   * The operation is not implemented or is not currently supported/enabled.
   *
   * HTTP Mapping: 501 Not Implemented
   * Error Type: BAD_REQUEST
   */
  Unimplemented = 'UNIMPLEMENTED',
  /**
   * Unknown error.
   *
   * This error should only be returned when no other error detail applies.
   * If a client sees an unknown errorDetail, it will be interpreted as UNKNOWN.
   *
   * HTTP Mapping: 500 Internal Server Error
   */
  Unknown = 'UNKNOWN'
}

export enum ErrorType {
  /**
   * Bad Request.
   *
   * There is a problem with the request.
   * Retrying the same request is not likely to succeed.
   * An example would be a query or argument that cannot be deserialized.
   *
   * HTTP Mapping: 400 Bad Request
   */
  BadRequest = 'BAD_REQUEST',
  /**
   * The operation was rejected because the system is not in a state
   * required for the operation's execution.  For example, the directory
   * to be deleted is non-empty, an rmdir operation is applied to
   * a non-directory, etc.
   *
   * Service implementers can use the following guidelines to decide
   * between `FAILED_PRECONDITION` and `UNAVAILABLE`:
   *
   * - Use `UNAVAILABLE` if the client can retry just the failing call.
   * - Use `FAILED_PRECONDITION` if the client should not retry until
   * the system state has been explicitly fixed.  E.g., if an "rmdir"
   *      fails because the directory is non-empty, `FAILED_PRECONDITION`
   * should be returned since the client should not retry unless
   * the files are deleted from the directory.
   *
   * HTTP Mapping: 400 Bad Request or 500 Internal Server Error
   */
  FailedPrecondition = 'FAILED_PRECONDITION',
  /**
   * Internal error.
   *
   * An unexpected internal error was encountered. This means that some
   * invariants expected by the underlying system have been broken.
   * This error code is reserved for serious errors.
   *
   * HTTP Mapping: 500 Internal Server Error
   */
  Internal = 'INTERNAL',
  /**
   * The requested entity was not found.
   *
   * This could apply to a resource that has never existed (e.g. bad resource id),
   * or a resource that no longer exists (e.g. cache expired.)
   *
   * Note to server developers: if a request is denied for an entire class
   * of users, such as gradual feature rollout or undocumented allowlist,
   * `NOT_FOUND` may be used. If a request is denied for some users within
   * a class of users, such as user-based access control, `PERMISSION_DENIED`
   * must be used.
   *
   * HTTP Mapping: 404 Not Found
   */
  NotFound = 'NOT_FOUND',
  /**
   * The caller does not have permission to execute the specified
   * operation.
   *
   * `PERMISSION_DENIED` must not be used for rejections
   * caused by exhausting some resource or quota.
   * `PERMISSION_DENIED` must not be used if the caller
   * cannot be identified (use `UNAUTHENTICATED`
   * instead for those errors).
   *
   * This error Type does not imply the
   * request is valid or the requested entity exists or satisfies
   * other pre-conditions.
   *
   * HTTP Mapping: 403 Forbidden
   */
  PermissionDenied = 'PERMISSION_DENIED',
  /**
   * The request does not have valid authentication credentials.
   *
   * This is intended to be returned only for routes that require
   * authentication.
   *
   * HTTP Mapping: 401 Unauthorized
   */
  Unauthenticated = 'UNAUTHENTICATED',
  /**
   * Currently Unavailable.
   *
   * The service is currently unavailable.  This is most likely a
   * transient condition, which can be corrected by retrying with
   * a backoff.
   *
   * HTTP Mapping: 503 Unavailable
   */
  Unavailable = 'UNAVAILABLE',
  /**
   * Unknown error.
   *
   * For example, this error may be returned when
   * an error code received from another address space belongs to
   * an error space that is not known in this address space.  Also
   * errors raised by APIs that do not return enough error information
   * may be converted to this error.
   *
   * If a client sees an unknown errorType, it will be interpreted as UNKNOWN.
   * Unknown errors MUST NOT trigger any special behavior. These MAY be treated
   * by an implementation as being equivalent to INTERNAL.
   *
   * When possible, a more specific error should be provided.
   *
   * HTTP Mapping: 520 Unknown Error
   */
  Unknown = 'UNKNOWN'
}

export type Evaluation = {
  checklistId?: Maybe<Scalars['Long']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  observations?: Maybe<Scalars['String']['output']>;
  recommendations?: Maybe<Scalars['String']['output']>;
  teamScrumId?: Maybe<Scalars['Long']['output']>;
  valueJudgment?: Maybe<Scalars['String']['output']>;
};

export type EvaluationDto = {
  checklistId?: InputMaybe<Scalars['Long']['input']>;
  observations?: InputMaybe<Scalars['String']['input']>;
  recommendations?: InputMaybe<Scalars['String']['input']>;
  teamScrumId?: InputMaybe<Scalars['Long']['input']>;
  valueJudgment?: InputMaybe<Scalars['String']['input']>;
};

export type EvaluationPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Evaluation>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type EvaluationPageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Evaluation>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type External = {
  company?: Maybe<Company>;
  id?: Maybe<Scalars['ID']['output']>;
  person?: Maybe<Person>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type ExternalDto = {
  company?: InputMaybe<CompanyDto>;
  id?: InputMaybe<Scalars['ID']['input']>;
  person?: InputMaybe<PersonDto>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ExternalPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<External>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type FinalReport = {
  annexes?: Maybe<Scalars['String']['output']>;
  conclusions?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  disciplinaryOffenses?: Maybe<Scalars['String']['output']>;
  fileNumber?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  objectives?: Maybe<Scalars['String']['output']>;
  signature?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type FinalReportDto = {
  annexes?: InputMaybe<Scalars['String']['input']>;
  conclusions: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['String']['input']>;
  disciplinaryOffenses?: InputMaybe<Scalars['String']['input']>;
  fileNumber: Scalars['String']['input'];
  objectives: Scalars['String']['input'];
  signature: Scalars['String']['input'];
  state: Scalars['Boolean']['input'];
};

export type FinalReportPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<FinalReport>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type FinalReportPageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<FinalReport>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type Floor = {
  environments?: Maybe<Array<Maybe<Environment>>>;
  headquarter?: Maybe<Headquarter>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type FloorDto = {
  environments?: InputMaybe<Array<InputMaybe<EnvironmentDto>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FloorPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Floor>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type FollowUp = {
  caseDescription?: Maybe<Scalars['String']['output']>;
  committeeEventId?: Maybe<Scalars['ID']['output']>;
  coordinatorId?: Maybe<Scalars['ID']['output']>;
  creationDate?: Maybe<Scalars['String']['output']>;
  evidenceFiles?: Maybe<Scalars['String']['output']>;
  followUpFlowStatusId?: Maybe<Scalars['ID']['output']>;
  followUpStatusId?: Maybe<Scalars['ID']['output']>;
  followUpTypeId?: Maybe<Scalars['ID']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  studentId?: Maybe<Scalars['ID']['output']>;
  studySheetId?: Maybe<Scalars['ID']['output']>;
  teacherId?: Maybe<Scalars['ID']['output']>;
};

export type FollowUpAction = {
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  student?: Maybe<Scalars['Long']['output']>;
};

export type FollowUpActionDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  studentId?: InputMaybe<Scalars['Long']['input']>;
};

export type FollowUpActionPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<FollowUpAction>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type FollowUpActionPageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<FollowUpAction>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type FollowUpDto = {
  caseDescription?: InputMaybe<Scalars['String']['input']>;
  committeeEventId?: InputMaybe<Scalars['ID']['input']>;
  coordinatorId?: InputMaybe<Scalars['ID']['input']>;
  evidenceFiles?: InputMaybe<Scalars['String']['input']>;
  followUpFlowStatusId?: InputMaybe<Scalars['ID']['input']>;
  followUpStatusId?: InputMaybe<Scalars['ID']['input']>;
  followUpTypeId?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  studentId?: InputMaybe<Scalars['ID']['input']>;
  studySheetId?: InputMaybe<Scalars['ID']['input']>;
  teacherId?: InputMaybe<Scalars['ID']['input']>;
};

export type FollowUpFlowStatus = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type FollowUpFlowStatusDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type FollowUpFlowStatusPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<FollowUpFlowStatus>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type FollowUpPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<FollowUp>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type FollowUpStatus = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type FollowUpStatusDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type FollowUpStatusPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<FollowUpStatus>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type FollowUpType = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type FollowUpTypeDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type FollowUpTypePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<FollowUpType>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type Headquarter = {
  address?: Maybe<Scalars['String']['output']>;
  floors?: Maybe<Array<Maybe<Floor>>>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
  trainingCenter?: Maybe<TrainingCenter>;
};

export type HeadquarterDto = {
  address?: InputMaybe<Scalars['String']['input']>;
  floors?: InputMaybe<Array<InputMaybe<FloorDto>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
  trainingCenter?: InputMaybe<TrainingCenterDto>;
};

export type HeadquarterPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Headquarter>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type ImprovementPlan = {
  city?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['String']['output']>;
  faultType?: Maybe<ImprovementPlanFaultType>;
  id?: Maybe<Scalars['ID']['output']>;
  qualification?: Maybe<Scalars['Boolean']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
  student?: Maybe<Student>;
  teacherCompetence?: Maybe<TeacherStudySheet>;
};

export type ImprovementPlanActivity = {
  deliveryDate?: Maybe<Scalars['String']['output']>;
  deliveryFormat?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  improvementPlanId?: Maybe<Scalars['ID']['output']>;
  learningOutcome?: Maybe<Scalars['String']['output']>;
};

export type ImprovementPlanActivityDto = {
  deliveryDate?: InputMaybe<Scalars['String']['input']>;
  deliveryFormat?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  improvementPlanId?: InputMaybe<Scalars['ID']['input']>;
  learningOutcome?: InputMaybe<Scalars['String']['input']>;
};

export type ImprovementPlanActivityPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<ImprovementPlanActivity>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type ImprovementPlanActivityPageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<ImprovementPlanActivity>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type ImprovementPlanDelivery = {
  deliveryFormat: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type ImprovementPlanDeliveryDto = {
  deliveryFormat: Scalars['String']['input'];
};

export type ImprovementPlanDeliveryPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<ImprovementPlanDelivery>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type ImprovementPlanDeliveryPageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<ImprovementPlanDelivery>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type ImprovementPlanDto = {
  city?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  faultType?: InputMaybe<ImprovementPlanFaultTypeDto>;
  qualification?: InputMaybe<Scalars['Boolean']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
  studentId?: InputMaybe<Scalars['ID']['input']>;
  teacherCompetence?: InputMaybe<Scalars['ID']['input']>;
};

export type ImprovementPlanEvidenceType = {
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ImprovementPlanEvidenceTypeDto = {
  name: Scalars['String']['input'];
};

export type ImprovementPlanEvidenceTypePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<ImprovementPlanEvidenceType>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type ImprovementPlanEvidenceTypePageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<ImprovementPlanEvidenceType>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type ImprovementPlanFaultType = {
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  teacherCompetence?: Maybe<TeacherStudySheet>;
};

export type ImprovementPlanFaultTypeDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ImprovementPlanFaultTypePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<ImprovementPlanFaultType>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type ImprovementPlanFaultTypePageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<ImprovementPlanFaultType>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type ImprovementPlanPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<ImprovementPlan>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type ImprovementPlanPageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<ImprovementPlan>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type Item = {
  active: Scalars['Boolean']['output'];
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  indicator: Scalars['String']['output'];
};

export type ItemDto = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  code: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  indicator: Scalars['String']['input'];
};

export type ItemPageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Checklist>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type ItemType = {
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type ItemTypeDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ItemTypePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<ItemType>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type ItemTypePageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Array<Maybe<ItemType>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type Iteration = {
  endDate?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['Date']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  teamsScrum?: Maybe<TeamsScrum>;
  workItems?: Maybe<Array<Maybe<WorkItem>>>;
};

export type IterationDto = {
  endDate?: InputMaybe<Scalars['Date']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  teamScrumId?: InputMaybe<Scalars['Long']['input']>;
};

export type IterationPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Iteration>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type Journey = {
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type JourneyDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type JourneyPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Offer>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type Juries = {
  dateAssigned?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  listChecklistSubstantiationLists?: Maybe<Array<Maybe<Checklist>>>;
};

export type JuriesDto = {
  dateAssigned?: InputMaybe<Scalars['String']['input']>;
  listChecklistSubstantiationListsIds?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type JuriesPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Juries>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type JuriesPageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Juries>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type Justification = {
  absenceDate?: Maybe<Scalars['String']['output']>;
  attendance?: Maybe<Attendance>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  justificationDate?: Maybe<Scalars['String']['output']>;
  justificationFile?: Maybe<Scalars['String']['output']>;
  justificationStatus?: Maybe<JustificationStatus>;
  justificationType?: Maybe<JustificationType>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type JustificationDto = {
  absenceDate?: InputMaybe<Scalars['String']['input']>;
  attendance?: InputMaybe<AttendanceDto>;
  description?: InputMaybe<Scalars['String']['input']>;
  justificationDate?: InputMaybe<Scalars['String']['input']>;
  justificationFile?: InputMaybe<Scalars['String']['input']>;
  justificationStatus?: InputMaybe<JustificationStatusDto>;
  justificationType?: InputMaybe<JustificationTypeDto>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
  studentId?: InputMaybe<Scalars['Long']['input']>;
};

export type JustificationPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Justification>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type JustificationPageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Justification>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type JustificationStatus = {
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type JustificationStatusDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type JustificationStatusPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<JustificationStatus>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type JustificationStatusPageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<JustificationStatus>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type JustificationType = {
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type JustificationTypeDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type JustificationTypePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<JustificationType>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type JustificationTypePageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<JustificationType>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type JustificationsByStudySheetId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Array<Maybe<Justification>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type LaborDepartment = {
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type LaborDepartmentDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LaborDepartmentPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<LaborDepartment>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type LearningActivity = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  projectActivity?: Maybe<ProjectActivity>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type LearningActivityDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  projectActivity?: InputMaybe<ProjectActivityDto>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LearningActivityPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<LearningActivity>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type LearningOutcome = {
  code?: Maybe<Scalars['Int']['output']>;
  competence?: Maybe<Competences>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type LearningOutcomeDto = {
  code?: InputMaybe<Scalars['Int']['input']>;
  competence?: InputMaybe<CompetenceDto>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LearningOutcomePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<LearningOutcome>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type MacroRegion = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type MacroRegionDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Methodology = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type MethodologyDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type MethodologyPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Methodology>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type Minute = {
  committeeEventId?: Maybe<Scalars['ID']['output']>;
  fileContent?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
};

export type MinuteDto = {
  committeeEventId?: InputMaybe<Scalars['ID']['input']>;
  fileContent?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type MinutePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Minute>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type Mutation = {
  AddFollowUpAction?: Maybe<Response>;
  UpdateFollowUpAction?: Maybe<Response>;
  addAdministrative?: Maybe<Response>;
  addAdministrativeType?: Maybe<Response>;
  addAttendance?: Maybe<Response>;
  addChangeLog?: Maybe<StringResponse>;
  addChecklist?: Maybe<Response>;
  addChecklistHistory?: Maybe<Response>;
  addClassType?: Maybe<Response>;
  addCollaborator?: Maybe<Response>;
  addCommittee?: Maybe<Response>;
  addCommitteeAndSendEmail: CommitteeEmailResponse;
  addCommitteeEvent?: Maybe<Response>;
  addCommitteeEventAndSendEmail: CommitteeEmailResponse;
  addCommitteeEventsBulk?: Maybe<CommitteeEventPage>;
  addCompany?: Maybe<Response>;
  addCompetence?: Maybe<Response>;
  addCondition?: Maybe<Response>;
  addConditionDetails?: Maybe<Response>;
  addContractType?: Maybe<Response>;
  addCoordination?: Maybe<Response>;
  addDocumentType?: Maybe<Response>;
  addEnvironment?: Maybe<Response>;
  addEvaluation?: Maybe<Response>;
  addExternal?: Maybe<Response>;
  addFinalReport?: Maybe<Response>;
  addFollowUp?: Maybe<Response>;
  addFollowUpFlowStatus?: Maybe<Response>;
  addFollowUpStatus?: Maybe<Response>;
  addFollowUpType?: Maybe<Response>;
  addHeadquarter?: Maybe<Response>;
  addImprovementPlan?: Maybe<Response>;
  addImprovementPlanActivity?: Maybe<Response>;
  addImprovementPlanDelivery?: Maybe<Response>;
  addImprovementPlanEvidenceType?: Maybe<Response>;
  addImprovementPlanFaultType?: Maybe<Response>;
  addItem?: Maybe<ItemPageId>;
  addItemType?: Maybe<Response>;
  addIteration?: Maybe<StringResponse>;
  addJourney?: Maybe<Response>;
  addJury?: Maybe<Response>;
  addJustification?: Maybe<Response>;
  addJustificationStatus?: Maybe<Response>;
  addJustificationType?: Maybe<Response>;
  addLaborDepartment?: Maybe<Response>;
  addLearningActivity?: Maybe<Response>;
  addLearningOutcome?: Maybe<Response>;
  addMacroRegion?: Maybe<Response>;
  addMethodology?: Maybe<StringResponse>;
  addMinute?: Maybe<Response>;
  addNovelty?: Maybe<Response>;
  addNoveltyStatus?: Maybe<Response>;
  addNoveltyType?: Maybe<Response>;
  addOffer?: Maybe<Response>;
  addPerson?: Maybe<Response>;
  addPersonToCommittee?: Maybe<Response>;
  addPhase?: Maybe<Response>;
  addProcessFlowStatus?: Maybe<Response>;
  addProcessMethodology?: Maybe<StringResponse>;
  addProfile?: Maybe<StringResponse>;
  addProfileAssignment?: Maybe<StringResponse>;
  addProfileToStudent?: Maybe<AddProfileToStudentResponse>;
  addProgram?: Maybe<Response>;
  addProjectActivity?: Maybe<Response>;
  addQuarter?: Maybe<Response>;
  addRegion?: Maybe<Response>;
  addRelation?: Maybe<StringResponse>;
  addStateAttendance?: Maybe<Response>;
  addStudent?: Maybe<Response>;
  addStudentStudySheetState?: Maybe<Response>;
  addStudentsToStudySheet?: Maybe<Response>;
  addStudySheet?: Maybe<Response>;
  addStudySheetState?: Maybe<Response>;
  addTeacher?: Maybe<Response>;
  addTeacherStudySheetType?: Maybe<Response>;
  addTeamScrum?: Maybe<Response>;
  addTownship?: Maybe<Response>;
  addTrainingCenter?: Maybe<Response>;
  addTrainingLevel?: Maybe<Response>;
  addTrainingProject?: Maybe<Response>;
  addWorkItem?: Maybe<StringResponse>;
  addWorkItemState?: Maybe<StringResponse>;
  addWorkItemType?: Maybe<StringResponse>;
  assignCommitteeToEvents?: Maybe<CommitteeEventPage>;
  createNotification?: Maybe<Response>;
  deleteAdministrative?: Maybe<Response>;
  deleteAdministrativeType?: Maybe<Response>;
  deleteAttendance?: Maybe<Response>;
  deleteChecklist?: Maybe<Response>;
  deleteChecklistHistory?: Maybe<Response>;
  deleteClassType?: Maybe<Response>;
  deleteCollaborator?: Maybe<Response>;
  deleteCommittee?: Maybe<Response>;
  deleteCommitteeEvent?: Maybe<Response>;
  deleteCompany?: Maybe<Response>;
  deleteCompetence?: Maybe<Response>;
  deleteCondition?: Maybe<Response>;
  deleteConditionDetails?: Maybe<Response>;
  deleteContractType?: Maybe<Response>;
  deleteCoordination?: Maybe<Response>;
  deleteDocumentType?: Maybe<Response>;
  deleteEnvironment?: Maybe<Response>;
  deleteEvaluation?: Maybe<Response>;
  deleteExternal?: Maybe<Response>;
  deleteFinalReport?: Maybe<Response>;
  deleteFollowUp?: Maybe<Response>;
  deleteFollowUpFlowStatus?: Maybe<Response>;
  deleteFollowUpStatus?: Maybe<Response>;
  deleteFollowUpType?: Maybe<Response>;
  deleteHeadquarter?: Maybe<Response>;
  deleteImprovementPlan?: Maybe<Response>;
  deleteImprovementPlanActivity?: Maybe<Response>;
  deleteImprovementPlanDelivery?: Maybe<Response>;
  deleteImprovementPlanEvidenceType?: Maybe<Response>;
  deleteImprovementPlanFaultType?: Maybe<Response>;
  deleteItem?: Maybe<ItemPageId>;
  deleteItemType?: Maybe<Response>;
  deleteJourney?: Maybe<Response>;
  deleteJury?: Maybe<Response>;
  deleteJustification?: Maybe<Response>;
  deleteJustificationStatus?: Maybe<Response>;
  deleteJustificationType?: Maybe<Response>;
  deleteLaborDepartment?: Maybe<Response>;
  deleteLearningActivity?: Maybe<Response>;
  deleteLearningOutcome?: Maybe<Response>;
  deleteMacroRegion?: Maybe<Scalars['String']['output']>;
  deleteMinute?: Maybe<Response>;
  deleteNotification?: Maybe<Response>;
  deleteNovelty?: Maybe<Response>;
  deleteNoveltyStatus?: Maybe<Response>;
  deleteNoveltyType?: Maybe<Response>;
  deleteOffer?: Maybe<Response>;
  deletePerson?: Maybe<Response>;
  deletePhase?: Maybe<Response>;
  deleteProcessFlowStatus?: Maybe<Response>;
  deleteProgram?: Maybe<Response>;
  deleteProjectActivity?: Maybe<Response>;
  deleteQuarter?: Maybe<Response>;
  deleteRegion?: Maybe<Response>;
  deleteStateAttendance?: Maybe<Response>;
  deleteStudent?: Maybe<Response>;
  deleteStudentStudySheetState?: Maybe<Response>;
  deleteStudySheet?: Maybe<Response>;
  deleteStudySheetState?: Maybe<Response>;
  deleteTeacher?: Maybe<Response>;
  deleteTeacherStudySheetType?: Maybe<Response>;
  deleteTeamScrum?: Maybe<Response>;
  deleteTownship?: Maybe<Response>;
  deleteTrainingCenter?: Maybe<Response>;
  deleteTrainingLevel?: Maybe<Response>;
  deleteTrainingProject?: Maybe<Response>;
  finalizeCommitteeEvent?: Maybe<Response>;
  generateQRCode?: Maybe<QrCodePayload>;
  refreshTrainingProjectName?: Maybe<Response>;
  removePersonFromCommittee?: Maybe<Response>;
  returnNovelty?: Maybe<Response>;
  sendCommitteeEventCreationEmail: CommitteeEmailResponse;
  sendMultipleHtmlEmail: EmailResponse;
  sendNotification?: Maybe<Scalars['String']['output']>;
  sendNoveltyCreationNotification: EmailResponse;
  sendNoveltyUpdateNotification: EmailResponse;
  sendPendingNoveltyReminders?: Maybe<Response>;
  sendSingleHtmlEmail: EmailResponse;
  updateAdministrative?: Maybe<Response>;
  updateAdministrativeType?: Maybe<Response>;
  updateAttendance?: Maybe<Response>;
  updateChangeLog?: Maybe<StringResponse>;
  updateChecklist?: Maybe<Response>;
  updateChecklistHistory?: Maybe<Response>;
  updateClassType?: Maybe<Response>;
  updateCollaborator?: Maybe<Response>;
  updateCommittee?: Maybe<Response>;
  updateCommitteeEvent?: Maybe<Response>;
  updateCompany?: Maybe<Response>;
  updateCompetence?: Maybe<Response>;
  updateCondition?: Maybe<Response>;
  updateConditionDetails?: Maybe<Response>;
  updateContractType?: Maybe<Response>;
  updateCoordination?: Maybe<Response>;
  updateDocumentType?: Maybe<Response>;
  updateEnvironment?: Maybe<Response>;
  updateEvaluation?: Maybe<Response>;
  updateExternal?: Maybe<Response>;
  updateFinalReport?: Maybe<Response>;
  updateFollowUp?: Maybe<Response>;
  updateFollowUpFlowStatus?: Maybe<Response>;
  updateFollowUpStatus?: Maybe<Response>;
  updateFollowUpType?: Maybe<Response>;
  updateHeadquarter?: Maybe<Response>;
  updateImprovementPlan?: Maybe<Response>;
  updateImprovementPlanActivity?: Maybe<Response>;
  updateImprovementPlanDelivery?: Maybe<Response>;
  updateImprovementPlanEvidenceType?: Maybe<Response>;
  updateImprovementPlanFaultType?: Maybe<Response>;
  updateItem?: Maybe<ItemPageId>;
  updateItemStatus?: Maybe<Response>;
  updateItemType?: Maybe<Response>;
  updateIteration?: Maybe<StringResponse>;
  updateJourney?: Maybe<Response>;
  updateJury?: Maybe<Response>;
  updateJustification?: Maybe<Response>;
  updateJustificationStatus?: Maybe<Response>;
  updateJustificationType?: Maybe<Response>;
  updateLaborDepartment?: Maybe<Response>;
  updateLearningActivity?: Maybe<Response>;
  updateLearningOutcome?: Maybe<Response>;
  updateMacroRegion?: Maybe<Response>;
  updateMethodology?: Maybe<StringResponse>;
  updateMinute?: Maybe<Response>;
  updateNotification?: Maybe<Response>;
  updateNovelty?: Maybe<Response>;
  updateNoveltyStatus?: Maybe<Response>;
  updateNoveltyType?: Maybe<Response>;
  updateOffer?: Maybe<Response>;
  updatePerson?: Maybe<Response>;
  updatePhase?: Maybe<Response>;
  updateProcessFlowStatus?: Maybe<Response>;
  updateProcessMethodology?: Maybe<StringResponse>;
  updateProfile?: Maybe<StringResponse>;
  updateProfileAssignment?: Maybe<StringResponse>;
  updateProgram?: Maybe<Response>;
  updateProjectActivity?: Maybe<Response>;
  updateQuarter?: Maybe<Response>;
  updateRegion?: Maybe<Response>;
  updateRelation?: Maybe<StringResponse>;
  updateStateAttendance?: Maybe<Response>;
  updateStatusInJustification?: Maybe<Response>;
  updateStudent?: Maybe<Response>;
  updateStudentStudySheetState?: Maybe<Response>;
  updateStudySheet?: Maybe<Response>;
  updateStudySheetState?: Maybe<Response>;
  updateTeacher?: Maybe<Response>;
  updateTeacherStudySheetType?: Maybe<Response>;
  updateTeamScrum?: Maybe<Response>;
  updateTownship?: Maybe<Response>;
  updateTrainingCenter?: Maybe<Response>;
  updateTrainingLevel?: Maybe<Response>;
  updateTrainingProject?: Maybe<Response>;
  updateWorkItem?: Maybe<StringResponse>;
  updateWorkItemState?: Maybe<StringResponse>;
  updateWorkItemType?: Maybe<StringResponse>;
};


export type MutationAddFollowUpActionArgs = {
  input?: InputMaybe<FollowUpActionDto>;
};


export type MutationUpdateFollowUpActionArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<FollowUpActionDto>;
};


export type MutationAddAdministrativeArgs = {
  input?: InputMaybe<AdministrativeDto>;
};


export type MutationAddAdministrativeTypeArgs = {
  input?: InputMaybe<AdministrativeTypeDto>;
};


export type MutationAddAttendanceArgs = {
  input?: InputMaybe<AttendanceDto>;
};


export type MutationAddChangeLogArgs = {
  input?: InputMaybe<ChangeLogDto>;
};


export type MutationAddChecklistArgs = {
  input?: InputMaybe<ChecklistDto>;
};


export type MutationAddChecklistHistoryArgs = {
  input: ChecklistHistoryDto;
};


export type MutationAddClassTypeArgs = {
  input?: InputMaybe<ClassTypeDto>;
};


export type MutationAddCollaboratorArgs = {
  input?: InputMaybe<CollaboratorDto>;
};


export type MutationAddCommitteeArgs = {
  input?: InputMaybe<CommitteeDto>;
};


export type MutationAddCommitteeAndSendEmailArgs = {
  input: CommitteeInput;
};


export type MutationAddCommitteeEventArgs = {
  input?: InputMaybe<CommitteeEventDto>;
};


export type MutationAddCommitteeEventAndSendEmailArgs = {
  input: CommitteeEventInput;
};


export type MutationAddCommitteeEventsBulkArgs = {
  input?: InputMaybe<Array<CommitteeEventDto>>;
};


export type MutationAddCompanyArgs = {
  input?: InputMaybe<CompanyDto>;
};


export type MutationAddCompetenceArgs = {
  input?: InputMaybe<CompetenceDto>;
};


export type MutationAddConditionArgs = {
  input?: InputMaybe<ConditionDto>;
};


export type MutationAddConditionDetailsArgs = {
  input?: InputMaybe<DetailConditionDto>;
};


export type MutationAddContractTypeArgs = {
  input?: InputMaybe<ContractTypeDto>;
};


export type MutationAddCoordinationArgs = {
  input?: InputMaybe<CoordinationDto>;
};


export type MutationAddDocumentTypeArgs = {
  input?: InputMaybe<DocumentTypeDto>;
};


export type MutationAddEnvironmentArgs = {
  input?: InputMaybe<EnvironmentDto>;
};


export type MutationAddEvaluationArgs = {
  input: EvaluationDto;
};


export type MutationAddExternalArgs = {
  input?: InputMaybe<ExternalDto>;
};


export type MutationAddFinalReportArgs = {
  input?: InputMaybe<FinalReportDto>;
};


export type MutationAddFollowUpArgs = {
  input?: InputMaybe<FollowUpDto>;
};


export type MutationAddFollowUpFlowStatusArgs = {
  input?: InputMaybe<FollowUpFlowStatusDto>;
};


export type MutationAddFollowUpStatusArgs = {
  input?: InputMaybe<FollowUpStatusDto>;
};


export type MutationAddFollowUpTypeArgs = {
  input?: InputMaybe<FollowUpTypeDto>;
};


export type MutationAddHeadquarterArgs = {
  input: HeadquarterDto;
};


export type MutationAddImprovementPlanArgs = {
  input?: InputMaybe<ImprovementPlanDto>;
};


export type MutationAddImprovementPlanActivityArgs = {
  input?: InputMaybe<ImprovementPlanActivityDto>;
};


export type MutationAddImprovementPlanDeliveryArgs = {
  input?: InputMaybe<ImprovementPlanDeliveryDto>;
};


export type MutationAddImprovementPlanEvidenceTypeArgs = {
  input?: InputMaybe<ImprovementPlanEvidenceTypeDto>;
};


export type MutationAddImprovementPlanFaultTypeArgs = {
  input?: InputMaybe<ImprovementPlanFaultTypeDto>;
};


export type MutationAddItemArgs = {
  item: ItemDto;
};


export type MutationAddItemTypeArgs = {
  input: ItemTypeDto;
};


export type MutationAddIterationArgs = {
  input?: InputMaybe<IterationDto>;
};


export type MutationAddJourneyArgs = {
  input?: InputMaybe<JourneyDto>;
};


export type MutationAddJuryArgs = {
  input?: InputMaybe<JuriesDto>;
};


export type MutationAddJustificationArgs = {
  input?: InputMaybe<JustificationDto>;
};


export type MutationAddJustificationStatusArgs = {
  input: JustificationStatusDto;
};


export type MutationAddJustificationTypeArgs = {
  input?: InputMaybe<JustificationTypeDto>;
};


export type MutationAddLaborDepartmentArgs = {
  input?: InputMaybe<LaborDepartmentDto>;
};


export type MutationAddLearningActivityArgs = {
  input?: InputMaybe<LearningActivityDto>;
};


export type MutationAddLearningOutcomeArgs = {
  input?: InputMaybe<LearningOutcomeDto>;
};


export type MutationAddMacroRegionArgs = {
  input?: InputMaybe<MacroRegionDto>;
};


export type MutationAddMethodologyArgs = {
  input?: InputMaybe<MethodologyDto>;
};


export type MutationAddMinuteArgs = {
  input?: InputMaybe<MinuteDto>;
};


export type MutationAddNoveltyArgs = {
  input?: InputMaybe<NoveltyDto>;
};


export type MutationAddNoveltyStatusArgs = {
  input?: InputMaybe<NoveltyStatusDto>;
};


export type MutationAddNoveltyTypeArgs = {
  input?: InputMaybe<NoveltyTypeDto>;
};


export type MutationAddOfferArgs = {
  input?: InputMaybe<OfferDto>;
};


export type MutationAddPersonArgs = {
  input?: InputMaybe<PersonDto>;
};


export type MutationAddPersonToCommitteeArgs = {
  committeeId: Scalars['Long']['input'];
  personId: Scalars['Long']['input'];
  role: Scalars['String']['input'];
};


export type MutationAddPhaseArgs = {
  input?: InputMaybe<PhaseDto>;
};


export type MutationAddProcessFlowStatusArgs = {
  input?: InputMaybe<ProcessFlowStatusDto>;
};


export type MutationAddProcessMethodologyArgs = {
  input?: InputMaybe<ProcessMethodologyDto>;
};


export type MutationAddProfileArgs = {
  input?: InputMaybe<ProfileDto>;
};


export type MutationAddProfileAssignmentArgs = {
  input?: InputMaybe<ProfileAssignmentDto>;
};


export type MutationAddProfileToStudentArgs = {
  input?: InputMaybe<Array<InputMaybe<ProcessMethodologyDto>>>;
};


export type MutationAddProgramArgs = {
  input?: InputMaybe<ProgramDto>;
};


export type MutationAddProjectActivityArgs = {
  input?: InputMaybe<ProjectActivityDto>;
};


export type MutationAddQuarterArgs = {
  input?: InputMaybe<QuarterDto>;
};


export type MutationAddRegionArgs = {
  input?: InputMaybe<RegionDto>;
};


export type MutationAddRelationArgs = {
  input?: InputMaybe<RelationDto>;
};


export type MutationAddStateAttendanceArgs = {
  input: AttendanceStateDto;
};


export type MutationAddStudentArgs = {
  input?: InputMaybe<StudentDto>;
};


export type MutationAddStudentStudySheetStateArgs = {
  input?: InputMaybe<StudentStudySheetStateDto>;
};


export type MutationAddStudentsToStudySheetArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  studentIds?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  teacherIds?: InputMaybe<Array<InputMaybe<TeacherStudySheetDto>>>;
};


export type MutationAddStudySheetArgs = {
  input?: InputMaybe<StudySheetDto>;
};


export type MutationAddStudySheetStateArgs = {
  input?: InputMaybe<StudySheetStateDto>;
};


export type MutationAddTeacherArgs = {
  input?: InputMaybe<TeacherDto>;
};


export type MutationAddTeacherStudySheetTypeArgs = {
  input?: InputMaybe<TeacherStudySheetTypeDto>;
};


export type MutationAddTeamScrumArgs = {
  input: TeamsScrumDto;
};


export type MutationAddTownshipArgs = {
  input?: InputMaybe<TownshipDto>;
};


export type MutationAddTrainingCenterArgs = {
  input: TrainingCenterDto;
};


export type MutationAddTrainingLevelArgs = {
  input: TrainingLevelDto;
};


export type MutationAddTrainingProjectArgs = {
  input?: InputMaybe<TrainingProjectDto>;
};


export type MutationAddWorkItemArgs = {
  input?: InputMaybe<WorkItemDto>;
};


export type MutationAddWorkItemStateArgs = {
  input?: InputMaybe<WorkItemStateDto>;
};


export type MutationAddWorkItemTypeArgs = {
  input?: InputMaybe<WorkItemTypeDto>;
};


export type MutationAssignCommitteeToEventsArgs = {
  committeeId: Scalars['Long']['input'];
  eventIds: Array<Scalars['Long']['input']>;
};


export type MutationCreateNotificationArgs = {
  dateAttention?: InputMaybe<Scalars['String']['input']>;
  notiMessage: Scalars['String']['input'];
  notiStatus: Scalars['String']['input'];
  registrationDate?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeleteAdministrativeArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteAdministrativeTypeArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteAttendanceArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteChecklistArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteChecklistHistoryArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteClassTypeArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteCollaboratorArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteCommitteeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCommitteeEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCompanyArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteCompetenceArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteConditionArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteConditionDetailsArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteContractTypeArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteCoordinationArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteDocumentTypeArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteEnvironmentArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteEvaluationArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteExternalArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteFinalReportArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteFollowUpArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteFollowUpFlowStatusArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteFollowUpStatusArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteFollowUpTypeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteHeadquarterArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteImprovementPlanArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteImprovementPlanActivityArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteImprovementPlanDeliveryArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteImprovementPlanEvidenceTypeArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteImprovementPlanFaultTypeArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteItemArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteItemTypeArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteJourneyArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteJuryArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteJustificationArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteJustificationStatusArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteJustificationTypeArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteLaborDepartmentArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteLearningActivityArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteLearningOutcomeArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteMacroRegionArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteMinuteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNotificationArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteNoveltyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNoveltyStatusArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNoveltyTypeArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteOfferArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeletePersonArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeletePhaseArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteProcessFlowStatusArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProgramArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteProjectActivityArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteQuarterArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteRegionArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteStateAttendanceArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteStudentArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteStudentStudySheetStateArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteStudySheetArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteStudySheetStateArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteTeacherArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteTeacherStudySheetTypeArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationDeleteTeamScrumArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteTownshipArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteTrainingCenterArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteTrainingLevelArgs = {
  id: Scalars['Long']['input'];
};


export type MutationDeleteTrainingProjectArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationFinalizeCommitteeEventArgs = {
  eventId: Scalars['ID']['input'];
  responses: Array<CommitteeNoveltyObservationInput>;
};


export type MutationRefreshTrainingProjectNameArgs = {
  checklistId: Scalars['Long']['input'];
};


export type MutationRemovePersonFromCommitteeArgs = {
  committeeId: Scalars['Long']['input'];
  personId: Scalars['Long']['input'];
  role: Scalars['String']['input'];
};


export type MutationReturnNoveltyArgs = {
  id: Scalars['ID']['input'];
  observation: Scalars['String']['input'];
};


export type MutationSendCommitteeEventCreationEmailArgs = {
  committeeEventId: Scalars['Long']['input'];
};


export type MutationSendMultipleHtmlEmailArgs = {
  emailsDestinatarios: Array<Scalars['String']['input']>;
  htmlContent: Scalars['String']['input'];
  subject: Scalars['String']['input'];
};


export type MutationSendNotificationArgs = {
  emailRequest: EmailRequest;
};


export type MutationSendNoveltyCreationNotificationArgs = {
  noveltyId?: InputMaybe<Scalars['Long']['input']>;
  noveltyTypeId?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationSendNoveltyUpdateNotificationArgs = {
  noveltyId?: InputMaybe<Scalars['Long']['input']>;
  noveltyTypeId?: InputMaybe<Scalars['Long']['input']>;
};


export type MutationSendSingleHtmlEmailArgs = {
  emailDestinatario: Scalars['String']['input'];
  htmlContent: Scalars['String']['input'];
  subject: Scalars['String']['input'];
};


export type MutationUpdateAdministrativeArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<AdministrativeDto>;
};


export type MutationUpdateAdministrativeTypeArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<AdministrativeTypeDto>;
};


export type MutationUpdateAttendanceArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<AttendanceDto>;
};


export type MutationUpdateChangeLogArgs = {
  id: Scalars['String']['input'];
  input?: InputMaybe<ChangeLogDto>;
};


export type MutationUpdateChecklistArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<ChecklistDto>;
};


export type MutationUpdateChecklistHistoryArgs = {
  id: Scalars['Long']['input'];
  input: ChecklistHistoryDto;
};


export type MutationUpdateClassTypeArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<ClassTypeDto>;
};


export type MutationUpdateCollaboratorArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<CollaboratorDto>;
};


export type MutationUpdateCommitteeArgs = {
  id: Scalars['ID']['input'];
  input?: InputMaybe<CommitteeDto>;
};


export type MutationUpdateCommitteeEventArgs = {
  id: Scalars['ID']['input'];
  input?: InputMaybe<CommitteeEventDto>;
};


export type MutationUpdateCompanyArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<CompanyDto>;
};


export type MutationUpdateCompetenceArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<CompetenceDto>;
};


export type MutationUpdateConditionArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<ConditionDto>;
};


export type MutationUpdateConditionDetailsArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<DetailConditionDto>;
};


export type MutationUpdateContractTypeArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<ContractTypeDto>;
};


export type MutationUpdateCoordinationArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<CoordinationDto>;
};


export type MutationUpdateDocumentTypeArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<DocumentTypeDto>;
};


export type MutationUpdateEnvironmentArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<EnvironmentDto>;
};


export type MutationUpdateEvaluationArgs = {
  id: Scalars['Long']['input'];
  input: EvaluationDto;
};


export type MutationUpdateExternalArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<ExternalDto>;
};


export type MutationUpdateFinalReportArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<FinalReportDto>;
};


export type MutationUpdateFollowUpArgs = {
  id: Scalars['ID']['input'];
  input?: InputMaybe<FollowUpDto>;
};


export type MutationUpdateFollowUpFlowStatusArgs = {
  id: Scalars['ID']['input'];
  input?: InputMaybe<FollowUpFlowStatusDto>;
};


export type MutationUpdateFollowUpStatusArgs = {
  id: Scalars['ID']['input'];
  input?: InputMaybe<FollowUpStatusDto>;
};


export type MutationUpdateFollowUpTypeArgs = {
  id: Scalars['ID']['input'];
  input?: InputMaybe<FollowUpTypeDto>;
};


export type MutationUpdateHeadquarterArgs = {
  id: Scalars['Long']['input'];
  input: HeadquarterDto;
};


export type MutationUpdateImprovementPlanArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<ImprovementPlanDto>;
};


export type MutationUpdateImprovementPlanActivityArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<ImprovementPlanActivityDto>;
};


export type MutationUpdateImprovementPlanDeliveryArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<ImprovementPlanDeliveryDto>;
};


export type MutationUpdateImprovementPlanEvidenceTypeArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<ImprovementPlanEvidenceTypeDto>;
};


export type MutationUpdateImprovementPlanFaultTypeArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<ImprovementPlanFaultTypeDto>;
};


export type MutationUpdateItemArgs = {
  id: Scalars['Long']['input'];
  item: ItemDto;
};


export type MutationUpdateItemStatusArgs = {
  active: Scalars['Boolean']['input'];
  itemId: Scalars['Long']['input'];
};


export type MutationUpdateItemTypeArgs = {
  id: Scalars['Long']['input'];
  input: ItemTypeDto;
};


export type MutationUpdateIterationArgs = {
  id: Scalars['String']['input'];
  input?: InputMaybe<IterationDto>;
};


export type MutationUpdateJourneyArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<JourneyDto>;
};


export type MutationUpdateJuryArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<JuriesDto>;
};


export type MutationUpdateJustificationArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<JustificationDto>;
};


export type MutationUpdateJustificationStatusArgs = {
  id: Scalars['Long']['input'];
  input: JustificationStatusDto;
};


export type MutationUpdateJustificationTypeArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<JustificationTypeDto>;
};


export type MutationUpdateLaborDepartmentArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<LaborDepartmentDto>;
};


export type MutationUpdateLearningActivityArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<LearningActivityDto>;
};


export type MutationUpdateLearningOutcomeArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<LearningOutcomeDto>;
};


export type MutationUpdateMacroRegionArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<MacroRegionDto>;
};


export type MutationUpdateMethodologyArgs = {
  id: Scalars['String']['input'];
  input?: InputMaybe<MethodologyDto>;
};


export type MutationUpdateMinuteArgs = {
  id: Scalars['ID']['input'];
  input?: InputMaybe<MinuteDto>;
};


export type MutationUpdateNotificationArgs = {
  dateAttention?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Long']['input']>;
  notiMessage: Scalars['String']['input'];
  notiStatus: Scalars['String']['input'];
  registrationDate?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateNoveltyArgs = {
  id: Scalars['ID']['input'];
  input?: InputMaybe<NoveltyDto>;
};


export type MutationUpdateNoveltyStatusArgs = {
  id: Scalars['ID']['input'];
  input?: InputMaybe<NoveltyStatusDto>;
};


export type MutationUpdateNoveltyTypeArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<NoveltyTypeDto>;
};


export type MutationUpdateOfferArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<OfferDto>;
};


export type MutationUpdatePersonArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<PersonDto>;
};


export type MutationUpdatePhaseArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<PhaseDto>;
};


export type MutationUpdateProcessFlowStatusArgs = {
  id: Scalars['ID']['input'];
  input?: InputMaybe<ProcessFlowStatusDto>;
};


export type MutationUpdateProcessMethodologyArgs = {
  id: Scalars['String']['input'];
  input?: InputMaybe<ProcessMethodologyDto>;
};


export type MutationUpdateProfileArgs = {
  id: Scalars['String']['input'];
  input?: InputMaybe<ProfileDto>;
};


export type MutationUpdateProfileAssignmentArgs = {
  id: Scalars['String']['input'];
  input?: InputMaybe<ProfileAssignmentDto>;
};


export type MutationUpdateProgramArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<ProgramDto>;
};


export type MutationUpdateProjectActivityArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<ProjectActivityDto>;
};


export type MutationUpdateQuarterArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<QuarterDto>;
};


export type MutationUpdateRegionArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<RegionDto>;
};


export type MutationUpdateRelationArgs = {
  id: Scalars['String']['input'];
  input?: InputMaybe<RelationDto>;
};


export type MutationUpdateStateAttendanceArgs = {
  id: Scalars['Long']['input'];
  input: AttendanceStateDto;
};


export type MutationUpdateStatusInJustificationArgs = {
  id: Scalars['Long']['input'];
  input: Scalars['Long']['input'];
};


export type MutationUpdateStudentArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<StudentDto>;
};


export type MutationUpdateStudentStudySheetStateArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<StudentStudySheetStateDto>;
};


export type MutationUpdateStudySheetArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<StudySheetDto>;
};


export type MutationUpdateStudySheetStateArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<StudySheetStateDto>;
};


export type MutationUpdateTeacherArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<TeacherDto>;
};


export type MutationUpdateTeacherStudySheetTypeArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<TeacherStudySheetTypeDto>;
};


export type MutationUpdateTeamScrumArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<TeamsScrumDto>;
};


export type MutationUpdateTownshipArgs = {
  id: Scalars['Long']['input'];
  input?: InputMaybe<TownshipDto>;
};


export type MutationUpdateTrainingCenterArgs = {
  id: Scalars['Long']['input'];
  input: TrainingCenterDto;
};


export type MutationUpdateTrainingLevelArgs = {
  id: Scalars['Long']['input'];
  input: TrainingLevelDto;
};


export type MutationUpdateTrainingProjectArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  input?: InputMaybe<TrainingProjectDto>;
};


export type MutationUpdateWorkItemArgs = {
  id: Scalars['String']['input'];
  input?: InputMaybe<WorkItemDto>;
};


export type MutationUpdateWorkItemStateArgs = {
  id: Scalars['String']['input'];
  input?: InputMaybe<WorkItemStateDto>;
};


export type MutationUpdateWorkItemTypeArgs = {
  id: Scalars['String']['input'];
  input?: InputMaybe<WorkItemTypeDto>;
};

/** 1. crear el tipo novedad */
export type Notication = {
  dateAttentation?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Long']['output']>;
  notiMessage?: Maybe<Scalars['String']['output']>;
  notiStatus?: Maybe<Scalars['String']['output']>;
  registrationDate?: Maybe<Scalars['String']['output']>;
};

/**  3. Actualizar la notificaion */
export type NotificationDto = {
  dateAttention?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Long']['input']>;
  notiMessage?: InputMaybe<Scalars['String']['input']>;
  notiStatus?: InputMaybe<Scalars['String']['input']>;
  registrationDate?: InputMaybe<Scalars['String']['input']>;
};

export type Novelty = {
  administrative?: Maybe<Administrative>;
  date?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  justification?: Maybe<Scalars['String']['output']>;
  noveltyFiles?: Maybe<Scalars['String']['output']>;
  noveltyStatus?: Maybe<NoveltyStatus>;
  noveltyType?: Maybe<NoveltyType>;
  observation?: Maybe<Scalars['String']['output']>;
  processFlowStatus?: Maybe<ProcessFlowStatus>;
  student?: Maybe<Student>;
  studySheetId?: Maybe<Scalars['Long']['output']>;
  teacher?: Maybe<Teacher>;
};

export type NoveltyDto = {
  administrativeId?: InputMaybe<Scalars['Long']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  justification?: InputMaybe<Scalars['String']['input']>;
  noveltyFiles?: InputMaybe<Scalars['String']['input']>;
  noveltyStatus?: InputMaybe<NoveltyStatusDto>;
  noveltyType?: InputMaybe<NoveltyTypeDto>;
  observation?: InputMaybe<Scalars['String']['input']>;
  processFlowStatus?: InputMaybe<ProcessFlowStatusDto>;
  studentId?: InputMaybe<Scalars['Long']['input']>;
  studySheetId?: InputMaybe<Scalars['Long']['input']>;
  teacherId?: InputMaybe<Scalars['Long']['input']>;
};

export type NoveltyPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Novelty>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type NoveltyStatus = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type NoveltyStatusDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type NoveltyStatusPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<NoveltyStatus>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type NoveltyType = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Long']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  nameNovelty?: Maybe<Scalars['String']['output']>;
  procedureDescription?: Maybe<Scalars['String']['output']>;
};

export type NoveltyTypeCount = {
  count?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  noveltyTypeName?: Maybe<Scalars['String']['output']>;
};

export type NoveltyTypeDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Long']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  nameNovelty?: InputMaybe<Scalars['String']['input']>;
  procedureDescription?: InputMaybe<Scalars['String']['input']>;
};

export type NoveltyTypePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<NoveltyType>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type NoveltyTypecount = {
  id?: Maybe<Scalars['ID']['output']>;
  nameNovelty?: Maybe<Scalars['String']['output']>;
};

export type Offer = {
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type OfferDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type OfferPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Offer>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type PageResponseMacroRegionDto = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<MacroRegion>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type PageResponseRegion = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Region>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type PageResponseTownshipDto = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Township>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type PdfResponse = {
  code?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type Person = {
  address?: Maybe<Scalars['String']['output']>;
  bloodType?: Maybe<Scalars['String']['output']>;
  collaborator?: Maybe<Collaborator>;
  dateBirth?: Maybe<Scalars['String']['output']>;
  document?: Maybe<Scalars['String']['output']>;
  documentType?: Maybe<DocumentType>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  lastname?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  photo?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
  student?: Maybe<Student>;
  user?: Maybe<User>;
};

export type PersonById = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Person>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type PersonDto = {
  address?: InputMaybe<Scalars['String']['input']>;
  blood_type?: InputMaybe<Scalars['String']['input']>;
  date_birth?: InputMaybe<Scalars['String']['input']>;
  document?: InputMaybe<Scalars['String']['input']>;
  document_type?: InputMaybe<DocumentTypeDto>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PersonPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Person>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type Phase = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
  trainingProject?: Maybe<TrainingProject>;
};

export type PhaseDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
  trainingProject?: InputMaybe<TrainingProjectDto>;
};

export type PhasesPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Phase>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type ProcessFlowStatus = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type ProcessFlowStatusDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ProcessFlowStatusPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<ProcessFlowStatus>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type ProcessMethodology = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  methodology?: Maybe<Methodology>;
  name?: Maybe<Scalars['String']['output']>;
  profiles?: Maybe<Array<Maybe<Profile>>>;
  settings?: Maybe<ProcessSettings>;
};

export type ProcessMethodologyById = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<ProcessMethodology>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type ProcessMethodologyDto = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isUnique?: InputMaybe<Scalars['Boolean']['input']>;
  profileId?: InputMaybe<Scalars['String']['input']>;
  studentId?: InputMaybe<Scalars['Long']['input']>;
  teamScrumId?: InputMaybe<Scalars['Long']['input']>;
};

export type ProcessMethodologyPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<ProcessMethodology>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type ProcessSettings = {
  allowCustomStates?: Maybe<Scalars['Boolean']['output']>;
  autoCloseSprintOnEndDate?: Maybe<Scalars['Boolean']['output']>;
  hierarchyLevels?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  sprintDuration?: Maybe<Scalars['Int']['output']>;
};

export type ProcessSettingsDto = {
  allowCustomStates?: InputMaybe<Scalars['Boolean']['input']>;
  autoCloseSprintOnEndDate?: InputMaybe<Scalars['Boolean']['input']>;
  hierarchyLevels?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sprintDuration?: InputMaybe<Scalars['Int']['input']>;
};

export type Profile = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isUnique?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  process?: Maybe<ProcessMethodology>;
};

export type ProfileAssignment = {
  assignedAt?: Maybe<Scalars['Date']['output']>;
  assignedBy?: Maybe<Scalars['Long']['output']>;
  fichaId?: Maybe<Scalars['Long']['output']>;
  id: Scalars['ID']['output'];
  processId?: Maybe<Scalars['String']['output']>;
  profile?: Maybe<Profile>;
  studentId?: Maybe<Scalars['Long']['output']>;
  teacherId?: Maybe<Scalars['Long']['output']>;
  teamScrumId?: Maybe<Scalars['Long']['output']>;
};

export type ProfileAssignmentDto = {
  assignedAt?: InputMaybe<Scalars['Date']['input']>;
  assignedBy?: InputMaybe<Scalars['Long']['input']>;
  fichaId?: InputMaybe<Scalars['Long']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  processId?: InputMaybe<Scalars['String']['input']>;
  profile?: InputMaybe<ProfileDto>;
  studentId?: InputMaybe<Scalars['Long']['input']>;
  teacherId?: InputMaybe<Scalars['Long']['input']>;
  teamScrumId?: InputMaybe<Scalars['Long']['input']>;
};

export type ProfileAssignmentPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<ProfileAssignment>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type ProfileById = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Profile>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type ProfileDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isUnique?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  process?: InputMaybe<ProcessMethodologyDto>;
};

export type ProfilePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Profile>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type Program = {
  coordination?: Maybe<Coordination>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
  trainingLevel?: Maybe<TrainingLevel>;
};

export type ProgramDto = {
  coordination?: InputMaybe<CoordinationDto>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
  trainingLevel?: InputMaybe<TrainingLevelDto>;
};

export type ProgramPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Program>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type ProjectActivity = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  learningOutcome?: Maybe<LearningOutcome>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type ProjectActivityDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  learningOutcome?: InputMaybe<LearningOutcomeDto>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ProjectActivityPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<ProjectActivity>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type QrCodePayload = {
  qrCodeBase64?: Maybe<Scalars['String']['output']>;
  qrUrl?: Maybe<Scalars['String']['output']>;
  sessionId?: Maybe<Scalars['String']['output']>;
};

export type Quarter = {
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<QuarterName>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type QuarterDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<QuarterNameDto>;
};

export type QuarterName = {
  extension?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['Int']['output']>;
};

export type QuarterNameDto = {
  extension?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
};

export type QuarterPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Quarter>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type Query = {
  AllFollowUpsAction?: Maybe<FollowUpActionPage>;
  FollowUpActionById?: Maybe<FollowUpActionPageId>;
  ProfileById?: Maybe<ProfileById>;
  activeCommittees?: Maybe<Array<Maybe<Committee>>>;
  allAdministrative?: Maybe<AdministrativePage>;
  allAdministrativeList?: Maybe<AdministrativePage>;
  allAdministrativeTypes?: Maybe<AdministrativeTypePage>;
  allAdministrativeTypesList?: Maybe<AdministrativeTypePage>;
  allAttendanceByCompetenceQuarterIdWithJustifications?: Maybe<AttendancePage>;
  allAttendances?: Maybe<AttendancePage>;
  allAttendancesByStudentId?: Maybe<AttendancePage>;
  allChangeLogs?: Maybe<ChangeLogPage>;
  allChangeLogsList?: Maybe<ChangeLogPage>;
  allChecklistHistory?: Maybe<ChecklistHistoryPage>;
  allChecklists?: Maybe<ChecklistPage>;
  allClassType?: Maybe<ClassTypePage>;
  allClassTypeList?: Maybe<ClassTypePage>;
  allCollaborators?: Maybe<CollaboratorPage>;
  allCollaboratorsList?: Maybe<CollaboratorPage>;
  allCommitteeEvents?: Maybe<CommitteeEventPage>;
  allCommittees?: Maybe<CommitteePage>;
  allCompanies?: Maybe<CompanyPage>;
  allCompaniesList?: Maybe<CompanyPage>;
  allCompetences?: Maybe<CompetencesPage>;
  allCompetencesList?: Maybe<CompetencesPage>;
  allConditionDetails?: Maybe<ConditionDetailsPage>;
  allConditionDetailsList?: Maybe<ConditionDetailsPage>;
  allConditions?: Maybe<ConditionPage>;
  allConditionsList?: Maybe<ConditionPage>;
  allContractTypes?: Maybe<ContractTypePage>;
  allContractTypesList?: Maybe<ContractTypePage>;
  allCoordination?: Maybe<CoordinationPage>;
  allCoordinationList?: Maybe<CoordinationPage>;
  allDocumentTypes?: Maybe<ResponseDocumentType>;
  allDocumentTypesList?: Maybe<ResponseDocumentType>;
  allEnvironments?: Maybe<EnvironmentPage>;
  allEnvironmentsList?: Maybe<EnvironmentPage>;
  allEvaluations?: Maybe<EvaluationPage>;
  allExternals?: Maybe<ExternalPage>;
  allFinalReports?: Maybe<FinalReportPage>;
  allFloorsByHeadquarterId?: Maybe<FloorPage>;
  allFollowUpFlowStatuses?: Maybe<FollowUpFlowStatusPage>;
  allFollowUpStatuses?: Maybe<FollowUpStatusPage>;
  allFollowUpTypes?: Maybe<FollowUpTypePage>;
  allFollowUps?: Maybe<FollowUpPage>;
  allHeadquarters?: Maybe<HeadquarterPage>;
  allHeadquartersList?: Maybe<HeadquarterPage>;
  allImprovementPlanActivities?: Maybe<ImprovementPlanActivityPage>;
  allImprovementPlanDeliveries?: Maybe<ImprovementPlanDeliveryPage>;
  allImprovementPlanEvidenceTypes?: Maybe<ImprovementPlanEvidenceTypePage>;
  allImprovementPlanFaultTypes?: Maybe<ImprovementPlanFaultTypePage>;
  allImprovementPlans?: Maybe<ImprovementPlanPage>;
  allItemTypes?: Maybe<ItemTypePage>;
  allItems?: Maybe<ItemPageId>;
  allIterations?: Maybe<IterationPage>;
  allIterationsList?: Maybe<IterationPage>;
  allJourneys?: Maybe<JourneyPage>;
  allJourneysList?: Maybe<JourneyPage>;
  allJuries?: Maybe<JuriesPage>;
  allJustificationTypes?: Maybe<JustificationTypePage>;
  allJustifications?: Maybe<JustificationPage>;
  allJustificationsStatus?: Maybe<JustificationStatusPage>;
  allLaborDepartments?: Maybe<LaborDepartmentPage>;
  allLaborDepartmentsList?: Maybe<LaborDepartmentPage>;
  allLearningActivities?: Maybe<LearningActivityPage>;
  allLearningActivitiesList?: Maybe<LearningActivityPage>;
  allLearningOutcomes?: Maybe<LearningOutcomePage>;
  allLearningOutcomesList?: Maybe<LearningOutcomePage>;
  allMacroRegions?: Maybe<PageResponseMacroRegionDto>;
  allMacroRegionsList?: Maybe<PageResponseMacroRegionDto>;
  allMethodologies?: Maybe<MethodologyPage>;
  allMethodologiesList?: Maybe<MethodologyPage>;
  allMinutes?: Maybe<MinutePage>;
  allNotification?: Maybe<NoticationAnswer>;
  allNovelties?: Maybe<NoveltyPage>;
  allNoveltyStatuses?: Maybe<NoveltyStatusPage>;
  allNoveltyTypeList?: Maybe<NoveltyTypePage>;
  allNoveltyTypes?: Maybe<NoveltyTypePage>;
  allOffers?: Maybe<OfferPage>;
  allOffersList?: Maybe<OfferPage>;
  allPersons?: Maybe<PersonPage>;
  allPersonsList?: Maybe<PersonPage>;
  allPhases?: Maybe<PhasesPage>;
  allPhasesList?: Maybe<PhasesPage>;
  allProcessFlowStatuses?: Maybe<ProcessFlowStatusPage>;
  allProcessMethodology?: Maybe<ProcessMethodologyPage>;
  allProcessMethodologyList?: Maybe<Array<Maybe<ProcessMethodology>>>;
  allProfileAssignments?: Maybe<ProfileAssignmentPage>;
  allProfileAssignmentsList?: Maybe<ProfileAssignmentPage>;
  allProfileList?: Maybe<ProfilePage>;
  allProfiles?: Maybe<ProfilePage>;
  allPrograms?: Maybe<ProgramPage>;
  allProgramsList?: Maybe<ProgramPage>;
  allProjectActivities?: Maybe<ProjectActivityPage>;
  allProjectActivitiesList?: Maybe<ProjectActivityPage>;
  allQuarters?: Maybe<QuarterPage>;
  allQuartersList?: Maybe<QuarterPage>;
  allRegions?: Maybe<PageResponseRegion>;
  allRegionsList?: Maybe<PageResponseRegion>;
  allRelationList?: Maybe<RelationPage>;
  allRelations?: Maybe<RelationPage>;
  allStateAttendances?: Maybe<AttendanceStatePage>;
  allStudentList?: Maybe<StudentPage>;
  allStudentStudySheetState?: Maybe<StudentStudySheetStatePage>;
  allStudentStudySheetStateList?: Maybe<StudentStudySheetStatePage>;
  allStudents?: Maybe<StudentPage>;
  allStudySheetList?: Maybe<StudySheetPage>;
  allStudySheetState?: Maybe<StudySheetStatePage>;
  allStudySheetStateList?: Maybe<StudySheetStatePage>;
  allStudySheets?: Maybe<StudySheetPage>;
  allTeacherStudySheetType?: Maybe<TeacherStudySheetTypePage>;
  allTeacherStudySheetTypeList?: Maybe<TeacherStudySheetTypePage>;
  allTeachers?: Maybe<TeacherPage>;
  allTeachersList?: Maybe<TeacherPage>;
  allTeamsScrums?: Maybe<TeamsScrumPage>;
  allTownships?: Maybe<PageResponseTownshipDto>;
  allTownshipsList?: Maybe<PageResponseTownshipDto>;
  allTrainingCenters?: Maybe<TrainingCenterPage>;
  allTrainingCentersList?: Maybe<TrainingCenterPage>;
  allTrainingLevelList?: Maybe<TrainingLevelPage>;
  allTrainingLevels?: Maybe<TrainingLevelPage>;
  allTrainingProjects?: Maybe<TrainingProjectPage>;
  allTrainingProjectsList?: Maybe<TrainingProjectPage>;
  allWorkItemStates?: Maybe<WorkItemStatePage>;
  allWorkItemTypeStates?: Maybe<Array<Maybe<WorkItemState>>>;
  allWorkItemTypes?: Maybe<WorkItemTypePage>;
  allWorkItemTypesList?: Maybe<WorkItemTypePage>;
  allWorkItems?: Maybe<WorkItemPage>;
  allWorkItemsList?: Maybe<WorkItemPage>;
  attendanceById?: Maybe<AttendancePageId>;
  checklistById?: Maybe<ChecklistPageId>;
  checklistHistoryById?: Maybe<ChecklistHistoryPageId>;
  checklistHistoryId?: Maybe<Array<Maybe<ChecklistHistory>>>;
  committeeById?: Maybe<Committee>;
  committeeEventById?: Maybe<CommitteeEvent>;
  committeesByStudentId?: Maybe<Array<Maybe<Committee>>>;
  evaluationByChecklist?: Maybe<EvaluationPageId>;
  evaluationById?: Maybe<EvaluationPageId>;
  evaluationExistsForChecklist?: Maybe<EvaluationPageId>;
  evaluationsByChecklist?: Maybe<EvaluationPage>;
  exportChecklistToExcel?: Maybe<Scalars['String']['output']>;
  exportChecklistToPdf?: Maybe<Scalars['String']['output']>;
  finalReportById?: Maybe<FinalReportPageId>;
  followUpById?: Maybe<FollowUp>;
  followUpFlowStatusById?: Maybe<FollowUpFlowStatus>;
  followUpStatusById?: Maybe<FollowUpStatus>;
  followUpTypeById?: Maybe<FollowUpType>;
  generateMinuteDocx?: Maybe<Scalars['String']['output']>;
  generateMinuteDocxUrl?: Maybe<Scalars['String']['output']>;
  getNotificationById?: Maybe<NoticationAnswer>;
  improvementPlanActivityById?: Maybe<ImprovementPlanActivityPageId>;
  improvementPlanById?: Maybe<ImprovementPlanPageId>;
  improvementPlanDeliveryById?: Maybe<ImprovementPlanDeliveryPageId>;
  improvementPlanEvidenceTypeById?: Maybe<ImprovementPlanEvidenceTypePageId>;
  improvementPlanFaultTypeById?: Maybe<ImprovementPlanFaultTypePageId>;
  itemById?: Maybe<ItemPageId>;
  itemTypeById?: Maybe<ItemTypePageId>;
  juryById?: Maybe<JuriesPageId>;
  justificationById?: Maybe<JustificationPageId>;
  justificationByStudentId?: Maybe<JustificationPage>;
  justificationStatusById?: Maybe<JustificationStatusPageId>;
  justificationTypeById?: Maybe<JustificationTypePageId>;
  minuteById?: Maybe<Minute>;
  minuteFileBase64?: Maybe<Scalars['String']['output']>;
  noveltyById?: Maybe<Novelty>;
  noveltyStatusById?: Maybe<NoveltyStatus>;
  personById?: Maybe<PersonById>;
  processById?: Maybe<ProcessMethodologyById>;
  processFlowStatusById?: Maybe<ProcessFlowStatus>;
  stateAttendanceById?: Maybe<AttendanceStatePageId>;
  studySheetById?: Maybe<StudySheetById>;
  teamScrumById?: Maybe<TeamsScrumPageId>;
  workItemStateById?: Maybe<WorkItemState>;
};


export type QueryAllFollowUpsActionArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFollowUpActionByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryProfileByIdArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAllAdministrativeArgs = {
  administrativeTypeId?: InputMaybe<Scalars['Long']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  personName?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllAdministrativeTypesArgs = {
  administrativeTypeName?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllAttendanceByCompetenceQuarterIdWithJustificationsArgs = {
  competenceQuarterId?: InputMaybe<Scalars['Long']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllAttendancesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllAttendancesByStudentIdArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  stateId?: InputMaybe<Scalars['Long']['input']>;
};


export type QueryAllChangeLogsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllChecklistHistoryArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllChecklistsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllClassTypeArgs = {
  classTypeName?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllCollaboratorsArgs = {
  idLaborDepartment?: InputMaybe<Scalars['Long']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllCommitteeEventsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllCommitteesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllCompaniesArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllCompetencesArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllConditionDetailsArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllConditionsArgs = {
  conditionName?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllContractTypesArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllCoordinationArgs = {
  collaboratorId?: InputMaybe<Scalars['Long']['input']>;
  coordinationName?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
  trainingCenterId?: InputMaybe<Scalars['Long']['input']>;
};


export type QueryAllDocumentTypesArgs = {
  DocumentTypeName?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllEnvironmentsArgs = {
  coordinationId?: InputMaybe<Scalars['Long']['input']>;
  environmentName?: InputMaybe<Scalars['String']['input']>;
  headquarterId?: InputMaybe<Scalars['Long']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllEvaluationsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllExternalsArgs = {
  idCompany?: InputMaybe<Scalars['Long']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllFinalReportsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllFloorsByHeadquarterIdArgs = {
  headquarterId?: InputMaybe<Scalars['Long']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllFollowUpFlowStatusesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllFollowUpStatusesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllFollowUpTypesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllFollowUpsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllHeadquartersArgs = {
  headquarterName?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
  trainingCenterId?: InputMaybe<Scalars['Long']['input']>;
};


export type QueryAllImprovementPlanActivitiesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllImprovementPlanDeliveriesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllImprovementPlanEvidenceTypesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllImprovementPlanFaultTypesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllImprovementPlansArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  teacherCompetence?: InputMaybe<Scalars['Long']['input']>;
};


export type QueryAllItemTypesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllItemsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllIterationsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllJourneysArgs = {
  journeyName?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllJuriesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllJustificationTypesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllJustificationsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllJustificationsStatusArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllLaborDepartmentsArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllLearningActivitiesArgs = {
  idProjectActivity?: InputMaybe<Scalars['Long']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllLearningOutcomesArgs = {
  idCompetence?: InputMaybe<Scalars['Long']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllMacroRegionsArgs = {
  macroRegionName?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllMethodologiesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllMinutesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllNotificationArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllNoveltiesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllNoveltyStatusesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllNoveltyTypesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllOffersArgs = {
  offerName?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllPersonsArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllPhasesArgs = {
  idTrainingProject?: InputMaybe<Scalars['Long']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllProcessFlowStatusesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllProcessMethodologyArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllProfileAssignmentsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllProfilesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllProgramsArgs = {
  idCoordination?: InputMaybe<Scalars['Long']['input']>;
  idTrainingLevel?: InputMaybe<Scalars['Long']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllProjectActivitiesArgs = {
  idLearningOutcome?: InputMaybe<Scalars['Long']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllQuartersArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  quarterName?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllRegionsArgs = {
  macroRegionId?: InputMaybe<Scalars['Long']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  regionName?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllRelationsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllStateAttendancesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllStudentStudySheetStateArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllStudentsArgs = {
  idStudySheet?: InputMaybe<Scalars['Long']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllStudySheetStateArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllStudySheetsArgs = {
  idJourney?: InputMaybe<Scalars['Long']['input']>;
  idStudent?: InputMaybe<Scalars['Long']['input']>;
  idTeacher?: InputMaybe<Scalars['Long']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  onlyInstructor?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllTeacherStudySheetTypeArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllTeachersArgs = {
  coordinationId?: InputMaybe<Scalars['Long']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  personName?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllTeamsScrumsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllTownshipsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  regionId?: InputMaybe<Scalars['Long']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
  townshipName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAllTrainingCentersArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
  townshipId?: InputMaybe<Scalars['Long']['input']>;
  trainingCenterName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAllTrainingLevelsArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllTrainingProjectsArgs = {
  idProgram?: InputMaybe<Scalars['Long']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryAllWorkItemStatesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllWorkItemTypeStatesArgs = {
  hierarchyLevel?: InputMaybe<Scalars['Long']['input']>;
  processId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAllWorkItemTypesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllWorkItemsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAttendanceByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryChecklistByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryChecklistHistoryByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryChecklistHistoryIdArgs = {
  checklistId: Scalars['ID']['input'];
};


export type QueryCommitteeByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCommitteeEventByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCommitteesByStudentIdArgs = {
  studentId: Scalars['Long']['input'];
};


export type QueryEvaluationByChecklistArgs = {
  checklistId: Scalars['Long']['input'];
};


export type QueryEvaluationByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryEvaluationExistsForChecklistArgs = {
  checklistId: Scalars['Long']['input'];
};


export type QueryEvaluationsByChecklistArgs = {
  checklistId: Scalars['Long']['input'];
};


export type QueryExportChecklistToExcelArgs = {
  id: Scalars['Long']['input'];
};


export type QueryExportChecklistToPdfArgs = {
  id: Scalars['Long']['input'];
};


export type QueryFinalReportByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryFollowUpByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFollowUpFlowStatusByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFollowUpStatusByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFollowUpTypeByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGenerateMinuteDocxArgs = {
  committeeEventId: Scalars['ID']['input'];
};


export type QueryGenerateMinuteDocxUrlArgs = {
  committeeEventId: Scalars['ID']['input'];
};


export type QueryGetNotificationByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryImprovementPlanActivityByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryImprovementPlanByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryImprovementPlanDeliveryByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryImprovementPlanEvidenceTypeByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryImprovementPlanFaultTypeByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryItemByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryItemTypeByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryJuryByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryJustificationByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryJustificationByStudentIdArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  studentId: Scalars['Long']['input'];
};


export type QueryJustificationStatusByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryJustificationTypeByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryMinuteByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMinuteFileBase64Args = {
  filename: Scalars['String']['input'];
};


export type QueryNoveltyByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNoveltyStatusByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPersonByIdArgs = {
  document?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Long']['input']>;
};


export type QueryProcessByIdArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProcessFlowStatusByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStateAttendanceByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryStudySheetByIdArgs = {
  id?: InputMaybe<Scalars['Long']['input']>;
  teacherId?: InputMaybe<Scalars['Long']['input']>;
};


export type QueryTeamScrumByIdArgs = {
  id: Scalars['Long']['input'];
};


export type QueryWorkItemStateByIdArgs = {
  id: Scalars['String']['input'];
};

export type Region = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  latitude?: Maybe<Scalars['Int']['output']>;
  longitude?: Maybe<Scalars['Int']['output']>;
  macroRegion?: Maybe<MacroRegion>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type RegionDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  latitude?: InputMaybe<Scalars['Int']['input']>;
  longitude?: InputMaybe<Scalars['Int']['input']>;
  macroRegion?: InputMaybe<MacroRegionDto>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Relation = {
  targetId?: Maybe<Scalars['ID']['output']>;
  targetType?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type RelationDto = {
  targetId?: InputMaybe<Scalars['ID']['input']>;
  targetType?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type RelationPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Relation>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type Response = {
  code?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Long']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type ResponseDocumentType = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<DocumentType>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type ResponseMassive = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Array<Maybe<Person>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type StringResponse = {
  code?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type Student = {
  attendances?: Maybe<Array<Maybe<Attendance>>>;
  committees?: Maybe<Array<Maybe<Committee>>>;
  id?: Maybe<Scalars['ID']['output']>;
  improvementPlans?: Maybe<Array<Maybe<ImprovementPlan>>>;
  novelties?: Maybe<Array<Maybe<Novelty>>>;
  person?: Maybe<Person>;
  profiles?: Maybe<Array<Maybe<Profile>>>;
  state?: Maybe<Scalars['Boolean']['output']>;
  studentStudySheets?: Maybe<Array<Maybe<StudentStudySheet>>>;
  teamScrums?: Maybe<Array<Maybe<TeamsScrum>>>;
};


export type StudentAttendancesArgs = {
  competenceQuarterId?: InputMaybe<Scalars['Long']['input']>;
};

export type StudentDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  person?: InputMaybe<PersonDto>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
  studentStudySheets?: InputMaybe<Array<InputMaybe<StudentStudySheetDto>>>;
};

export type StudentPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Student>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type StudentStudySheet = {
  id?: Maybe<Scalars['ID']['output']>;
  student?: Maybe<Student>;
  studentStudySheetState?: Maybe<StudentStudySheetState>;
  studySheet?: Maybe<StudySheet>;
};

export type StudentStudySheetDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  student?: InputMaybe<StudentDto>;
  studentStudySheetState?: InputMaybe<StudentStudySheetStateDto>;
  studySheet?: InputMaybe<StudySheetDto>;
};

export type StudentStudySheetState = {
  createdAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type StudentStudySheetStateDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type StudentStudySheetStatePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<StudentStudySheetState>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type StudySheet = {
  endLective?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  journey?: Maybe<Journey>;
  number?: Maybe<Scalars['Int']['output']>;
  numberStudents?: Maybe<Scalars['Int']['output']>;
  offer?: Maybe<Offer>;
  quarter?: Maybe<Array<Maybe<Quarter>>>;
  startLective?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
  studentStudySheets?: Maybe<Array<Maybe<StudentStudySheet>>>;
  studySheetState?: Maybe<StudySheetState>;
  teacherStudySheets?: Maybe<Array<Maybe<TeacherStudySheet>>>;
  teamsScrum?: Maybe<Array<Maybe<TeamsScrum>>>;
  trainingProject?: Maybe<TrainingProject>;
};

export type StudySheetById = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<StudySheet>;
  message?: Maybe<Scalars['String']['output']>;
};

export type StudySheetDto = {
  endLective?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  journey?: InputMaybe<JourneyDto>;
  number?: InputMaybe<Scalars['Int']['input']>;
  numberStudents?: InputMaybe<Scalars['Int']['input']>;
  offer?: InputMaybe<OfferDto>;
  quarter?: InputMaybe<Array<InputMaybe<QuarterDto>>>;
  startLective?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
  studentStudySheets?: InputMaybe<Array<InputMaybe<StudentStudySheetDto>>>;
  studySheetState?: InputMaybe<StudySheetStateDto>;
  teacherStudySheets?: InputMaybe<Array<InputMaybe<TeacherStudySheetDto>>>;
  trainingProject?: InputMaybe<TrainingProjectDto>;
};

export type StudySheetPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<StudySheet>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type StudySheetState = {
  createdAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type StudySheetStateDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type StudySheetStatePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<StudySheetState>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type Teacher = {
  classTypes?: Maybe<Array<Maybe<ClassType>>>;
  collaborator?: Maybe<Collaborator>;
  committees?: Maybe<Array<Maybe<Committee>>>;
  coordinations?: Maybe<Array<Maybe<Coordination>>>;
  id?: Maybe<Scalars['ID']['output']>;
  novelties?: Maybe<Array<Maybe<Novelty>>>;
  state?: Maybe<Scalars['Boolean']['output']>;
  totalHours?: Maybe<Scalars['Int']['output']>;
};

export type TeacherDto = {
  classTypes?: InputMaybe<Array<InputMaybe<ClassTypeDto>>>;
  collaborator?: InputMaybe<CollaboratorDto>;
  coordinations?: InputMaybe<Array<InputMaybe<CoordinationDto>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
  totalHours?: InputMaybe<Scalars['Int']['input']>;
};

export type TeacherPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Teacher>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type TeacherStudySheet = {
  attendances?: Maybe<Array<Maybe<Attendance>>>;
  competence?: Maybe<Competences>;
  id?: Maybe<Scalars['ID']['output']>;
  improvementPlans?: Maybe<Array<Maybe<ImprovementPlan>>>;
  quarter?: Maybe<Quarter>;
  studySheet?: Maybe<StudySheet>;
  teacher?: Maybe<Teacher>;
  teacherStudySheetType?: Maybe<TeacherStudySheetType>;
};

export type TeacherStudySheetDto = {
  competence?: InputMaybe<CompetenceDto>;
  id?: InputMaybe<Scalars['ID']['input']>;
  studySheet?: InputMaybe<StudySheetDto>;
  teacher?: InputMaybe<TeacherDto>;
  teacherStudySheetType?: InputMaybe<TeacherStudySheetTypeDto>;
};

export type TeacherStudySheetType = {
  createdAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type TeacherStudySheetTypeDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type TeacherStudySheetTypePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<TeacherStudySheetType>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type TeamScrumMemberId = {
  id?: InputMaybe<Scalars['Long']['input']>;
  profileId?: InputMaybe<Scalars['String']['input']>;
  studentId?: InputMaybe<Scalars['Long']['input']>;
};

export type TeamScrumMemberIdResponse = {
  id?: Maybe<Scalars['Long']['output']>;
  profileId?: Maybe<Scalars['String']['output']>;
  studentId?: Maybe<Scalars['Long']['output']>;
};

export type TeamsScrum = {
  checklist?: Maybe<Checklist>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  iterations?: Maybe<Array<Maybe<Iteration>>>;
  objectives?: Maybe<Scalars['String']['output']>;
  problem?: Maybe<Scalars['String']['output']>;
  processMethodology?: Maybe<ProcessMethodology>;
  projectJustification?: Maybe<Scalars['String']['output']>;
  projectName?: Maybe<Scalars['String']['output']>;
  students?: Maybe<Array<Maybe<Student>>>;
  studySheet?: Maybe<StudySheet>;
  teamName?: Maybe<Scalars['String']['output']>;
  workItems?: Maybe<Array<Maybe<WorkItem>>>;
};

export type TeamsScrumDto = {
  checklist?: InputMaybe<ChecklistDto>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  memberIds?: InputMaybe<Array<InputMaybe<TeamScrumMemberId>>>;
  objectives?: InputMaybe<Scalars['String']['input']>;
  problem?: InputMaybe<Scalars['String']['input']>;
  processMethodologyId?: InputMaybe<Scalars['String']['input']>;
  projectJustification?: InputMaybe<Scalars['String']['input']>;
  projectName?: InputMaybe<Scalars['String']['input']>;
  studySheetId?: InputMaybe<Scalars['Long']['input']>;
  teamName?: InputMaybe<Scalars['String']['input']>;
};

export type TeamsScrumPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<TeamsScrum>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type TeamsScrumPageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<TeamsScrum>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type Township = {
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Region>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type TownshipDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<RegionDto>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TrainingCenter = {
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
  township?: Maybe<Township>;
};

export type TrainingCenterDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
  township?: InputMaybe<TownshipDto>;
};

export type TrainingCenterPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<TrainingCenter>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type TrainingLevel = {
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type TrainingLevelDto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TrainingLevelPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<TrainingLevel>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type TrainingProject = {
  description?: Maybe<Scalars['String']['output']>;
  duration?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  program?: Maybe<Program>;
  state?: Maybe<Scalars['Boolean']['output']>;
};

export type TrainingProjectDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  program?: InputMaybe<ProgramDto>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TrainingProjectPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<TrainingProject>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type User = {
  idPerson?: Maybe<Scalars['ID']['output']>;
};

export type WorkItem = {
  children?: Maybe<Array<Maybe<WorkItem>>>;
  description?: Maybe<Scalars['String']['output']>;
  fichaId?: Maybe<Scalars['Long']['output']>;
  fichaNumber?: Maybe<Scalars['Long']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  iteration?: Maybe<Iteration>;
  parent?: Maybe<WorkItem>;
  state?: Maybe<WorkItemState>;
  systemId?: Maybe<Scalars['String']['output']>;
  teamsScrum?: Maybe<TeamsScrum>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<WorkItemType>;
};

export type WorkItemDto = {
  children?: InputMaybe<Array<InputMaybe<WorkItemDto>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  fichaId?: InputMaybe<Scalars['Long']['input']>;
  fichaNumber?: InputMaybe<Scalars['Long']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  iteration?: InputMaybe<IterationDto>;
  parent?: InputMaybe<WorkItemDto>;
  state?: InputMaybe<WorkItemStateDto>;
  teamsScrumId?: InputMaybe<Scalars['Long']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<WorkItemTypeDto>;
};

export type WorkItemPage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<WorkItem>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type WorkItemState = {
  color?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type WorkItemStateDto = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type WorkItemStatePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<WorkItemState>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type WorkItemType = {
  color?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  hierarchyLevel?: Maybe<Scalars['Long']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<WorkItemType>;
  process?: Maybe<ProcessMethodology>;
  /**  Allowed states for this WorkItemType */
  states?: Maybe<Array<Maybe<WorkItemState>>>;
};

export type WorkItemTypeDto = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  hierarchyLevel?: InputMaybe<Scalars['Long']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parent?: InputMaybe<WorkItemTypeDto>;
  process?: InputMaybe<ProcessMethodologyDto>;
  states?: InputMaybe<Array<InputMaybe<WorkItemStateDto>>>;
};

export type WorkItemTypePage = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<WorkItemType>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type AddProfileToStudentResponse = {
  code?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Array<Maybe<TeamScrumMemberIdResponse>>>;
  message?: Maybe<Scalars['String']['output']>;
};

export type ChecklistHistoryPageId = {
  code?: Maybe<Scalars['String']['output']>;
  data?: Maybe<ChecklistHistory>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

/** 2. respuesta */
export type NoticationAnswer = {
  code?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  data?: Maybe<Array<Maybe<Notication>>>;
  date?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type GetAllProcessMethodologiesAndProfilesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllProcessMethodologiesAndProfilesQuery = { allProcessMethodology?: { currentPage?: number | null, totalItems?: number | null, totalPages?: number | null, message?: string | null, code?: string | null, date?: string | null, data?: Array<{ id?: string | null, name?: string | null, description?: string | null, methodology?: { id?: string | null, name?: string | null } | null, profiles?: Array<{ id?: string | null, name?: string | null, description?: string | null, isActive?: boolean | null, isUnique?: boolean | null } | null> | null } | null> | null } | null };

export type GetAllProfilesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllProfilesQuery = { allProfiles?: { totalItems?: number | null, totalPages?: number | null, currentPage?: number | null, data?: Array<{ id?: string | null, name?: string | null, description?: string | null, isActive?: boolean | null, isUnique?: boolean | null } | null> | null } | null };

export type GetProfileByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetProfileByIdQuery = { ProfileById?: { data?: { id?: string | null, name?: string | null, description?: string | null, isActive?: boolean | null, isUnique?: boolean | null } | null } | null };

export type GetStateAttendanceQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetStateAttendanceQuery = { allStateAttendances?: { code?: string | null, date?: string | null, message?: string | null, totalPages?: number | null, totalItems?: number | null, currentPage?: number | null, data?: Array<{ id?: string | null, status?: string | null } | null> | null } | null };

export type AddStateAttendanceMutationVariables = Exact<{
  input: AttendanceStateDto;
}>;


export type AddStateAttendanceMutation = { addStateAttendance?: { code?: string | null, message?: string | null, id?: any | null } | null };

export type UpdateStateAttendanceMutationVariables = Exact<{
  id: Scalars['Long']['input'];
  input: AttendanceStateDto;
}>;


export type UpdateStateAttendanceMutation = { updateStateAttendance?: { code?: string | null, message?: string | null, id?: any | null } | null };

export type DeleteStateAttendanceMutationVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type DeleteStateAttendanceMutation = { deleteStateAttendance?: { code?: string | null, message?: string | null, id?: any | null } | null };

export type GetAttendancesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAttendancesQuery = { allAttendances?: { date?: string | null, code?: string | null, message?: string | null, currentPage?: number | null, totalPages?: number | null, totalItems?: number | null, data?: Array<{ id: string, attendanceDate?: string | null, attendanceState?: { id?: string | null, status?: string | null } | null, student?: { id?: string | null, person?: { name?: string | null, lastname?: string | null, document?: string | null } | null } | null } | null> | null } | null };

export type AllAttendancesByStudentIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Long']['input']>;
  stateId?: InputMaybe<Scalars['Long']['input']>;
}>;


export type AllAttendancesByStudentIdQuery = { allAttendancesByStudentId?: { data?: Array<{ id: string, attendanceDate?: string | null, student?: { id?: string | null, person?: { name?: string | null, lastname?: string | null, document?: string | null } | null } | null, attendanceState?: { id?: string | null, status?: string | null } | null } | null> | null } | null };

export type AllAttendancesWithJustificationsByStudentIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Long']['input']>;
  stateId?: InputMaybe<Scalars['Long']['input']>;
}>;


export type AllAttendancesWithJustificationsByStudentIdQuery = { allAttendancesByStudentId?: { data?: Array<{ id: string, attendanceDate?: string | null, student?: { id?: string | null, person?: { name?: string | null, lastname?: string | null, document?: string | null } | null } | null, attendanceState?: { id?: string | null, status?: string | null } | null, justification?: { justificationStatus?: { id?: string | null, name?: string | null } | null } | null } | null> | null } | null };

export type GetAttendancesAndCompetenceByStudentIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Long']['input']>;
}>;


export type GetAttendancesAndCompetenceByStudentIdQuery = { allAttendancesByStudentId?: { data?: Array<{ id: string, attendanceDate?: string | null, attendanceState?: { status?: string | null } | null, competenceQuarter?: { id?: string | null, competence?: { name?: string | null } | null } | null } | null> | null } | null };

export type GetAttendancesAndJustificationsByStudentQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type GetAttendancesAndJustificationsByStudentQuery = { allAttendancesByStudentId?: { data?: Array<{ id: string, justification?: { id: string, description?: string | null, justificationFile?: string | null, absenceDate?: string | null, justificationType?: { id: string, name?: string | null } | null } | null } | null> | null } | null };

export type GetAttendancesByCompetenceQuarterAndJustificationsQueryVariables = Exact<{
  competenceQuarterId: Scalars['Long']['input'];
}>;


export type GetAttendancesByCompetenceQuarterAndJustificationsQuery = { allAttendanceByCompetenceQuarterIdWithJustifications?: { data?: Array<{ id: string, justification?: { id: string, absenceDate?: string | null, justificationDate?: string | null, justificationFile?: string | null, justificationStatus?: { id?: string | null, name?: string | null } | null } | null, student?: { person?: { name?: string | null, lastname?: string | null, document?: string | null } | null, studentStudySheets?: Array<{ studySheet?: { number?: number | null, teacherStudySheets?: Array<{ competence?: { learningOutcome?: Array<{ code?: number | null, id?: string | null, name?: string | null } | null> | null } | null } | null> | null } | null } | null> | null } | null } | null> | null } | null };

export type AddAttendanceMutationVariables = Exact<{
  input: AttendanceDto;
}>;


export type AddAttendanceMutation = { addAttendance?: { code?: string | null, message?: string | null, id?: any | null } | null };

export type UpdateAttendanceMutationVariables = Exact<{
  id: Scalars['Long']['input'];
  input: AttendanceDto;
}>;


export type UpdateAttendanceMutation = { updateAttendance?: { code?: string | null, message?: string | null, id?: any | null } | null };

export type DeleteAttendanceMutationVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type DeleteAttendanceMutation = { deleteAttendance?: { code?: string | null, message?: string | null, id?: any | null } | null };

export type GetAllChecklistsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllChecklistsQuery = { allChecklists?: { date?: string | null, code?: string | null, message?: string | null, currentPage?: number | null, totalPages?: number | null, totalItems?: number | null, data?: Array<{ id: string, state?: boolean | null, remarks?: string | null, instructorSignature?: string | null, evaluationCriteria?: boolean | null, trimester?: string | null, component?: string | null, studySheets?: string | null, items?: Array<{ id: string, code: string, indicator: string, active: boolean } | null> | null } | null> | null } | null };

export type GetChecklistByIdQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type GetChecklistByIdQuery = { checklistById?: { code?: string | null, date?: string | null, message?: string | null, data?: { id: string, state?: boolean | null, remarks?: string | null, instructorSignature?: string | null, evaluationCriteria?: boolean | null, trimester?: string | null, component?: string | null, studySheets?: string | null, items?: Array<{ id: string, code: string, indicator: string, active: boolean } | null> | null, evaluations?: { id?: string | null, observations?: string | null, recommendations?: string | null, valueJudgment?: string | null, checklistId?: any | null } | null, associatedJuries?: Array<{ id: string } | null> | null } | null } | null };

export type GetAllChecklistsCoordinatorQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllChecklistsCoordinatorQuery = { allChecklists?: { date?: string | null, code?: string | null, message?: string | null, currentPage?: number | null, totalPages?: number | null, totalItems?: number | null, data?: Array<{ id: string, state?: boolean | null, remarks?: string | null, instructorSignature?: string | null, evaluationCriteria?: boolean | null, trimester?: string | null, component?: string | null, studySheets?: string | null, trainingProjectId?: any | null, trainingProjectName?: string | null, items?: Array<{ id: string, code: string, indicator: string, active: boolean } | null> | null } | null> | null } | null };

export type GetChecklistByIdCoordinatorQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type GetChecklistByIdCoordinatorQuery = { checklistById?: { code?: string | null, date?: string | null, message?: string | null, data?: { id: string, state?: boolean | null, remarks?: string | null, instructorSignature?: string | null, evaluationCriteria?: boolean | null, trimester?: string | null, component?: string | null, studySheets?: string | null, trainingProjectId?: any | null, trainingProjectName?: string | null, items?: Array<{ id: string, code: string, indicator: string, active: boolean } | null> | null, evaluations?: { id?: string | null, observations?: string | null, recommendations?: string | null, valueJudgment?: string | null, checklistId?: any | null } | null, associatedJuries?: Array<{ id: string } | null> | null } | null } | null };

export type GetAllChecklistsInstructorQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllChecklistsInstructorQuery = { allChecklists?: { date?: string | null, code?: string | null, message?: string | null, currentPage?: number | null, totalPages?: number | null, totalItems?: number | null, data?: Array<{ id: string, state?: boolean | null, remarks?: string | null, instructorSignature?: string | null, evaluationCriteria?: boolean | null, trimester?: string | null, component?: string | null, studySheets?: string | null, items?: Array<{ id: string, code: string, indicator: string, active: boolean } | null> | null } | null> | null } | null };

export type GetChecklistByIdInstructorQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type GetChecklistByIdInstructorQuery = { checklistById?: { code?: string | null, date?: string | null, message?: string | null, data?: { id: string, state?: boolean | null, remarks?: string | null, instructorSignature?: string | null, evaluationCriteria?: boolean | null, trimester?: string | null, component?: string | null, studySheets?: string | null, items?: Array<{ id: string, code: string, indicator: string, active: boolean } | null> | null, evaluations?: { id?: string | null, observations?: string | null, recommendations?: string | null, valueJudgment?: string | null, checklistId?: any | null } | null, associatedJuries?: Array<{ id: string } | null> | null } | null } | null };

export type AddChecklistMutationVariables = Exact<{
  input: ChecklistDto;
}>;


export type AddChecklistMutation = { addChecklist?: { code?: string | null, message?: string | null, id?: any | null } | null };

export type UpdateChecklistMutationVariables = Exact<{
  id: Scalars['Long']['input'];
  input: ChecklistDto;
}>;


export type UpdateChecklistMutation = { updateChecklist?: { code?: string | null, message?: string | null, id?: any | null } | null };

export type DeleteChecklistMutationVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type DeleteChecklistMutation = { deleteChecklist?: { code?: string | null, message?: string | null, id?: any | null } | null };

export type UpdateItemStatusMutationVariables = Exact<{
  itemId: Scalars['Long']['input'];
  active: Scalars['Boolean']['input'];
}>;


export type UpdateItemStatusMutation = { updateItemStatus?: { code?: string | null, message?: string | null, id?: any | null } | null };

export type ExportChecklistToPdfQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type ExportChecklistToPdfQuery = { exportChecklistToPdf?: string | null };

export type ExportChecklistToExcelQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type ExportChecklistToExcelQuery = { exportChecklistToExcel?: string | null };

export type SendNotificationMutationVariables = Exact<{
  emailRequest: EmailRequest;
}>;


export type SendNotificationMutation = { sendNotification?: string | null };

export type GetAllEvaluationsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllEvaluationsQuery = { allEvaluations?: { code?: string | null, message?: string | null, date?: string | null, currentPage?: number | null, totalPages?: number | null, totalItems?: number | null, data?: Array<{ id?: string | null, observations?: string | null, recommendations?: string | null, valueJudgment?: string | null, checklistId?: any | null } | null> | null } | null };

export type GetEvaluationByIdQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type GetEvaluationByIdQuery = { evaluationById?: { code?: string | null, message?: string | null, date?: string | null, data?: { id?: string | null, observations?: string | null, recommendations?: string | null, valueJudgment?: string | null, checklistId?: any | null } | null } | null };

export type AddEvaluationMutationVariables = Exact<{
  input: EvaluationDto;
}>;


export type AddEvaluationMutation = { addEvaluation?: { code?: string | null, message?: string | null, id?: any | null } | null };

export type UpdateEvaluationMutationVariables = Exact<{
  id: Scalars['Long']['input'];
  input: EvaluationDto;
}>;


export type UpdateEvaluationMutation = { updateEvaluation?: { code?: string | null, message?: string | null, id?: any | null } | null };

export type DeleteEvaluationMutationVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type DeleteEvaluationMutation = { deleteEvaluation?: { code?: string | null, message?: string | null, id?: any | null } | null };

export type GetEvaluationsByChecklistQueryVariables = Exact<{
  checklistId: Scalars['Long']['input'];
}>;


export type GetEvaluationsByChecklistQuery = { evaluationsByChecklist?: { code?: string | null, message?: string | null, date?: string | null, currentPage?: number | null, totalPages?: number | null, totalItems?: number | null, data?: Array<{ id?: string | null, observations?: string | null, recommendations?: string | null, valueJudgment?: string | null, checklistId?: any | null } | null> | null } | null };

export type GenerateQrCodeMutationVariables = Exact<{ [key: string]: never; }>;


export type GenerateQrCodeMutation = { generateQRCode?: { sessionId?: string | null, qrCodeBase64?: string | null, qrUrl?: string | null } | null };

export type GetAllImprovementPlanFaultTypesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllImprovementPlanFaultTypesQuery = { allImprovementPlanFaultTypes?: { code?: string | null, message?: string | null, totalItems?: number | null, totalPages?: number | null, currentPage?: number | null, data?: Array<{ id?: string | null, name?: string | null } | null> | null } | null };

export type GetImprovementPlanFaultTypeByIdQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type GetImprovementPlanFaultTypeByIdQuery = { improvementPlanFaultTypeById?: { code?: string | null, message?: string | null, data?: { id?: string | null, name?: string | null } | null } | null };

export type GetAllImprovementPlansQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  teacherCompetence?: InputMaybe<Scalars['Long']['input']>;
}>;


export type GetAllImprovementPlansQuery = { allImprovementPlans?: { code?: string | null, message?: string | null, date?: string | null, totalPages?: number | null, totalItems?: number | null, currentPage?: number | null, data?: Array<{ id?: string | null, city?: string | null, date?: string | null, reason?: string | null, state?: boolean | null, qualification?: boolean | null, student?: { id?: string | null, person?: { name?: string | null, lastname?: string | null, document?: string | null } | null } | null, teacherCompetence?: { id?: string | null, competence?: { id?: string | null, name?: string | null } | null } | null, faultType?: { id?: string | null, name?: string | null } | null } | null> | null } | null };

export type GetImprovementPlanByIdQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type GetImprovementPlanByIdQuery = { improvementPlanById?: { code?: string | null, message?: string | null, date?: string | null, data?: { id?: string | null, city?: string | null, date?: string | null, reason?: string | null, state?: boolean | null, qualification?: boolean | null, student?: { id?: string | null, person?: { name?: string | null, lastname?: string | null, document?: string | null } | null } | null, teacherCompetence?: { id?: string | null, competence?: { id?: string | null, name?: string | null } | null } | null, faultType?: { id?: string | null, name?: string | null } | null } | null } | null };

export type AddImprovementPlanMutationVariables = Exact<{
  input: ImprovementPlanDto;
}>;


export type AddImprovementPlanMutation = { addImprovementPlan?: { code?: string | null, message?: string | null } | null };

export type UpdateImprovementPlanMutationVariables = Exact<{
  id: Scalars['Long']['input'];
  input: ImprovementPlanDto;
}>;


export type UpdateImprovementPlanMutation = { updateImprovementPlan?: { code?: string | null, message?: string | null } | null };

export type DeleteImprovementPlanMutationVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type DeleteImprovementPlanMutation = { deleteImprovementPlan?: { code?: string | null, message?: string | null } | null };

export type GetAllJustificationStatusQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllJustificationStatusQuery = { allJustificationsStatus?: { date?: string | null, code?: string | null, message?: string | null, totalPages?: number | null, totalItems?: number | null, currentPage?: number | null, data?: Array<{ id?: string | null, name?: string | null, state?: boolean | null } | null> | null } | null };

export type GetJustificationStatusByIdQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type GetJustificationStatusByIdQuery = { justificationStatusById?: { date?: string | null, code?: string | null, message?: string | null, data?: { id?: string | null, name?: string | null, state?: boolean | null } | null } | null };

export type AddJustificationStatusMutationVariables = Exact<{
  input: JustificationStatusDto;
}>;


export type AddJustificationStatusMutation = { addJustificationStatus?: { id?: any | null, code?: string | null, message?: string | null } | null };

export type UpdateJustificationStatusMutationVariables = Exact<{
  id: Scalars['Long']['input'];
  input: JustificationStatusDto;
}>;


export type UpdateJustificationStatusMutation = { updateJustificationStatus?: { id?: any | null, code?: string | null, message?: string | null } | null };

export type DeleteJustificationStatusMutationVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type DeleteJustificationStatusMutation = { deleteJustificationStatus?: { id?: any | null, code?: string | null, message?: string | null } | null };

export type GetAllJustificationTypesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllJustificationTypesQuery = { allJustificationTypes?: { code?: string | null, date?: string | null, totalPages?: number | null, totalItems?: number | null, currentPage?: number | null, message?: string | null, data?: Array<{ id: string, name?: string | null, description?: string | null } | null> | null } | null };

export type GetJustificationTypeByIdQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type GetJustificationTypeByIdQuery = { justificationTypeById?: { code?: string | null, date?: string | null, message?: string | null, data?: { id: string, name?: string | null, description?: string | null } | null } | null };

export type AddJustificationTypeMutationVariables = Exact<{
  input: JustificationTypeDto;
}>;


export type AddJustificationTypeMutation = { addJustificationType?: { code?: string | null, message?: string | null } | null };

export type UpdateJustificationTypeMutationVariables = Exact<{
  id: Scalars['Long']['input'];
  input: JustificationTypeDto;
}>;


export type UpdateJustificationTypeMutation = { updateJustificationType?: { code?: string | null, message?: string | null } | null };

export type DeleteJustificationTypeMutationVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type DeleteJustificationTypeMutation = { deleteJustificationType?: { code?: string | null, message?: string | null } | null };

export type GetAllJustificationsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllJustificationsQuery = { allJustifications?: { code?: string | null, message?: string | null, date?: string | null, totalPages?: number | null, totalItems?: number | null, currentPage?: number | null, data?: Array<{ id: string, description?: string | null, justificationFile?: string | null, absenceDate?: string | null, justificationDate?: string | null, state?: boolean | null, justificationType?: { id: string, name?: string | null } | null, justificationStatus?: { id?: string | null, name?: string | null, state?: boolean | null } | null, attendance?: { student?: { id?: string | null, person?: { name?: string | null, lastname?: string | null, document?: string | null } | null } | null } | null } | null> | null } | null };

export type GetJustificationByIdQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type GetJustificationByIdQuery = { justificationById?: { code?: string | null, message?: string | null, data?: { id: string, description?: string | null, justificationFile?: string | null, absenceDate?: string | null, justificationDate?: string | null, state?: boolean | null, justificationType?: { id: string, name?: string | null } | null, justificationStatus?: { id?: string | null, name?: string | null, state?: boolean | null } | null, attendance?: { id: string } | null } | null } | null };

export type GetJustificationByStudentIdQueryVariables = Exact<{
  studentId: Scalars['Long']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetJustificationByStudentIdQuery = { justificationByStudentId?: { code?: string | null, message?: string | null, data?: Array<{ id: string, description?: string | null, justificationFile?: string | null, absenceDate?: string | null, justificationDate?: string | null, state?: boolean | null, justificationType?: { id: string, name?: string | null } | null, justificationStatus?: { id?: string | null, name?: string | null, state?: boolean | null } | null, attendance?: { student?: { id?: string | null, person?: { name?: string | null, lastname?: string | null, document?: string | null } | null } | null } | null } | null> | null } | null };

export type AddJustificationMutationVariables = Exact<{
  input: JustificationDto;
}>;


export type AddJustificationMutation = { addJustification?: { code?: string | null, message?: string | null } | null };

export type UpdateStatusInJustificationMutationVariables = Exact<{
  id: Scalars['Long']['input'];
  input: Scalars['Long']['input'];
}>;


export type UpdateStatusInJustificationMutation = { updateStatusInJustification?: { code?: string | null, message?: string | null } | null };

export type UpdateJustificationMutationVariables = Exact<{
  id: Scalars['Long']['input'];
  input: JustificationDto;
}>;


export type UpdateJustificationMutation = { updateJustification?: { code?: string | null, message?: string | null } | null };

export type DeleteJustificationMutationVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type DeleteJustificationMutation = { deleteJustification?: { code?: string | null, message?: string | null } | null };

export type GetCoordinationByCollaboratorQueryVariables = Exact<{
  collaboratorId: Scalars['Long']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetCoordinationByCollaboratorQuery = { allCoordination?: { totalItems?: number | null, totalPages?: number | null, currentPage?: number | null, data?: Array<{ id?: string | null, name?: string | null, state?: boolean | null, teachers?: Array<{ id?: string | null, state?: boolean | null, collaborator?: { person?: { name?: string | null, lastname?: string | null, document?: string | null } | null } | null } | null> | null, trainingCenter?: { id?: string | null, name?: string | null } | null } | null> | null } | null };

export type GetProgramsQueryVariables = Exact<{
  idCoordination?: InputMaybe<Scalars['Long']['input']>;
  idTrainingLevel?: InputMaybe<Scalars['Long']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetProgramsQuery = { allPrograms?: { date?: string | null, code?: string | null, message?: string | null, currentPage?: number | null, totalPages?: number | null, totalItems?: number | null, data?: Array<{ id?: string | null, name?: string | null, description?: string | null, state?: boolean | null, coordination?: { id?: string | null, name?: string | null } | null, trainingLevel?: { id?: string | null, name?: string | null } | null } | null> | null } | null };

export type GetStudentsQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  idStudySheet?: InputMaybe<Scalars['Long']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetStudentsQuery = { allStudents?: { date?: string | null, code?: string | null, message?: string | null, currentPage?: number | null, totalPages?: number | null, totalItems?: number | null, data?: Array<{ id?: string | null, state?: boolean | null, person?: { id?: string | null, document?: string | null, name?: string | null, lastname?: string | null, phone?: string | null, email?: string | null, address?: string | null } | null } | null> | null } | null };

export type GetStudentListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStudentListQuery = { allStudentList?: { code?: string | null, message?: string | null, totalItems?: number | null, data?: Array<{ id?: string | null, state?: boolean | null, person?: { id?: string | null, name?: string | null, lastname?: string | null, document?: string | null } | null } | null> | null } | null };

export type GetStudySheetsQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  idJourney?: InputMaybe<Scalars['Long']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetStudySheetsQuery = { allStudySheets?: { date?: string | null, code?: string | null, message?: string | null, currentPage?: number | null, totalPages?: number | null, totalItems?: number | null, data?: Array<{ id?: string | null, number?: number | null, numberStudents?: number | null, startLective?: string | null, endLective?: string | null, state?: boolean | null, offer?: { name?: string | null } | null, journey?: { name?: string | null } | null, quarter?: Array<{ name?: { extension?: string | null, number?: number | null } | null } | null> | null, trainingProject?: { name?: string | null, program?: { id?: string | null, name?: string | null } | null } | null } | null> | null } | null };

export type GetStudySheetsByTrainingProjectQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetStudySheetsByTrainingProjectQuery = { allStudySheets?: { date?: string | null, code?: string | null, message?: string | null, currentPage?: number | null, totalPages?: number | null, totalItems?: number | null, data?: Array<{ id?: string | null, number?: number | null, numberStudents?: number | null, startLective?: string | null, endLective?: string | null, state?: boolean | null, offer?: { name?: string | null } | null, journey?: { name?: string | null } | null, quarter?: Array<{ name?: { extension?: string | null, number?: number | null } | null } | null> | null, trainingProject?: { id?: string | null, name?: string | null, program?: { id?: string | null, name?: string | null } | null } | null } | null> | null } | null };

export type GetStudySheetWithTeamScrumByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Long']['input']>;
}>;


export type GetStudySheetWithTeamScrumByIdQuery = { studySheetById?: { data?: { id?: string | null, number?: number | null, teamsScrum?: Array<{ id?: string | null, teamName?: string | null, projectName?: string | null, processMethodology?: { id?: string | null, name?: string | null } | null, students?: Array<{ id?: string | null, person?: { name?: string | null, lastname?: string | null, document?: string | null, email?: string | null } | null, profiles?: Array<{ name?: string | null, description?: string | null, isActive?: boolean | null, isUnique?: boolean | null } | null> | null } | null> | null } | null> | null } | null } | null };

export type GetStudySheetByIdQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type GetStudySheetByIdQuery = { studySheetById?: { code?: string | null, message?: string | null, data?: { id?: string | null, number?: number | null, numberStudents?: number | null, quarter?: Array<{ id?: string | null, name?: { number?: number | null, extension?: string | null } | null } | null> | null, trainingProject?: { id?: string | null, name?: string | null, program?: { id?: string | null, name?: string | null } | null } | null, studentStudySheets?: Array<{ id?: string | null, student?: { id?: string | null, person?: { id?: string | null, document?: string | null, name?: string | null, lastname?: string | null, email?: string | null, phone?: string | null } | null } | null, studentStudySheetState?: { id?: string | null, name?: string | null } | null } | null> | null, teacherStudySheets?: Array<{ id?: string | null, competence?: { name?: string | null } | null } | null> | null } | null } | null };

export type StudySheetByTeacherQueryVariables = Exact<{
  idTeacher?: InputMaybe<Scalars['Long']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type StudySheetByTeacherQuery = { allStudySheets?: { date?: string | null, code?: string | null, message?: string | null, currentPage?: number | null, totalPages?: number | null, totalItems?: number | null, data?: Array<{ id?: string | null, number?: number | null, startLective?: string | null, endLective?: string | null, state?: boolean | null, journey?: { name?: string | null } | null, trainingProject?: { name?: string | null, program?: { name?: string | null } | null } | null, teacherStudySheets?: Array<{ id?: string | null, competence?: { id?: string | null, name?: string | null } | null } | null> | null, studentStudySheets?: Array<{ student?: { id?: string | null, person?: { document?: string | null, name?: string | null, lastname?: string | null, phone?: string | null, email?: string | null, bloodType?: string | null, dateBirth?: string | null } | null } | null, studentStudySheetState?: { name?: string | null } | null } | null> | null } | null> | null } | null };

export type GetStudySheetWithStudentsQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type GetStudySheetWithStudentsQuery = { studySheetById?: { code?: string | null, message?: string | null, data?: { id?: string | null, number?: number | null, journey?: { name?: string | null } | null, trainingProject?: { program?: { name?: string | null } | null } | null, studentStudySheets?: Array<{ student?: { id?: string | null, person?: { name?: string | null, lastname?: string | null, email?: string | null } | null } | null, studentStudySheetState?: { id?: string | null, name?: string | null } | null } | null> | null } | null } | null };

export type GetCStudySheetsQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Long']['input']>;
  teacherId?: InputMaybe<Scalars['Long']['input']>;
}>;


export type GetCStudySheetsQuery = { studySheetById?: { code?: string | null, message?: string | null, data?: { id?: string | null, teacherStudySheets?: Array<{ id?: string | null, competence?: { id?: string | null, name?: string | null } | null } | null> | null } | null } | null };

export type StudySheetByTeacherIdWithTeamScrumQueryVariables = Exact<{
  idTeacher?: InputMaybe<Scalars['Long']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type StudySheetByTeacherIdWithTeamScrumQuery = { allStudySheets?: { date?: string | null, code?: string | null, message?: string | null, currentPage?: number | null, totalPages?: number | null, totalItems?: number | null, data?: Array<{ id?: string | null, number?: number | null, startLective?: string | null, endLective?: string | null, state?: boolean | null, journey?: { name?: string | null } | null, quarter?: Array<{ id?: string | null, name?: { extension?: string | null, number?: number | null } | null } | null> | null, trainingProject?: { name?: string | null, program?: { name?: string | null } | null } | null, teamsScrum?: Array<{ id?: string | null, teamName?: string | null, students?: Array<{ id?: string | null, person?: { lastname?: string | null, name?: string | null, document?: string | null } | null } | null> | null } | null> | null } | null> | null } | null };

export type GetStudySheetByIdWithAttendancesQueryVariables = Exact<{
  id: Scalars['Long']['input'];
  competenceId?: InputMaybe<Scalars['Long']['input']>;
  teacherId?: InputMaybe<Scalars['Long']['input']>;
}>;


export type GetStudySheetByIdWithAttendancesQuery = { studySheetById?: { code?: string | null, message?: string | null, data?: { id?: string | null, number?: number | null, numberStudents?: number | null, quarter?: Array<{ id?: string | null, name?: { number?: number | null, extension?: string | null } | null } | null> | null, trainingProject?: { id?: string | null, name?: string | null, program?: { id?: string | null, name?: string | null } | null } | null, studentStudySheets?: Array<{ id?: string | null, student?: { id?: string | null, attendances?: Array<{ attendanceDate?: string | null, attendanceState?: { status?: string | null } | null } | null> | null, person?: { id?: string | null, document?: string | null, name?: string | null, lastname?: string | null, email?: string | null, phone?: string | null } | null } | null, studentStudySheetState?: { id?: string | null, name?: string | null } | null } | null> | null, teacherStudySheets?: Array<{ id?: string | null, competence?: { name?: string | null, description?: string | null, learningOutcome?: Array<{ name?: string | null, description?: string | null, state?: boolean | null } | null> | null } | null } | null> | null } | null } | null };

export type GetAllTrainingProjectsQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  idProgram?: InputMaybe<Scalars['Long']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllTrainingProjectsQuery = { allTrainingProjects?: { date?: string | null, code?: string | null, message?: string | null, currentPage?: number | null, totalPages?: number | null, totalItems?: number | null, data?: Array<{ id?: string | null, name?: string | null, description?: string | null, state?: boolean | null, program?: { id?: string | null, name?: string | null, description?: string | null, coordination?: { id?: string | null, name?: string | null } | null, trainingLevel?: { id?: string | null, name?: string | null } | null } | null } | null> | null } | null };

export type GetTrainingProjectsByProgramQueryVariables = Exact<{
  idProgram: Scalars['Long']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetTrainingProjectsByProgramQuery = { allTrainingProjects?: { date?: string | null, code?: string | null, message?: string | null, currentPage?: number | null, totalPages?: number | null, totalItems?: number | null, data?: Array<{ id?: string | null, name?: string | null, description?: string | null, state?: boolean | null, program?: { id?: string | null, name?: string | null } | null } | null> | null } | null };

export type GetTrainingProjectByIdQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetTrainingProjectByIdQuery = { allTrainingProjects?: { date?: string | null, code?: string | null, message?: string | null, currentPage?: number | null, totalPages?: number | null, totalItems?: number | null, data?: Array<{ id?: string | null, name?: string | null, description?: string | null, state?: boolean | null, program?: { id?: string | null, name?: string | null, description?: string | null, coordination?: { id?: string | null, name?: string | null } | null, trainingLevel?: { id?: string | null, name?: string | null } | null } | null } | null> | null } | null };

export type GetTeamsScrumsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetTeamsScrumsQuery = { allTeamsScrums?: { date?: string | null, code?: string | null, message?: string | null, currentPage?: number | null, totalPages?: number | null, totalItems?: number | null, data?: Array<{ id?: string | null, teamName?: string | null, projectName?: string | null, problem?: string | null, objectives?: string | null, description?: string | null, projectJustification?: string | null, students?: Array<{ id?: string | null, person?: { name?: string | null, lastname?: string | null } | null } | null> | null } | null> | null } | null };

export type GetTeamScrumByIdQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type GetTeamScrumByIdQuery = { teamScrumById?: { code?: string | null, message?: string | null, date?: string | null, data?: { id?: string | null, teamName?: string | null, projectName?: string | null, problem?: string | null, objectives?: string | null, description?: string | null, projectJustification?: string | null } | null } | null };

export type GetTeamScrumByIdWithStudentsQueryVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type GetTeamScrumByIdWithStudentsQuery = { teamScrumById?: { code?: string | null, message?: string | null, date?: string | null, data?: { id?: string | null, teamName?: string | null, projectName?: string | null, problem?: string | null, objectives?: string | null, description?: string | null, projectJustification?: string | null, studySheet?: { number?: number | null, quarter?: Array<{ name?: { extension?: string | null, number?: number | null } | null } | null> | null } | null, students?: Array<{ person?: { name?: string | null, lastname?: string | null } | null, profiles?: Array<{ name?: string | null } | null> | null } | null> | null } | null } | null };

export type AddTeamScrumMutationVariables = Exact<{
  input: TeamsScrumDto;
}>;


export type AddTeamScrumMutation = { addTeamScrum?: { code?: string | null, message?: string | null, id?: any | null } | null };

export type AddProfileToStudentMutationVariables = Exact<{
  input: Array<InputMaybe<ProcessMethodologyDto>> | InputMaybe<ProcessMethodologyDto>;
}>;


export type AddProfileToStudentMutation = { addProfileToStudent?: { code?: string | null, message?: string | null, id?: Array<{ id?: any | null, studentId?: any | null, profileId?: string | null } | null> | null } | null };

export type UpdateTeamScrumMutationVariables = Exact<{
  id: Scalars['Long']['input'];
  input?: InputMaybe<TeamsScrumDto>;
}>;


export type UpdateTeamScrumMutation = { updateTeamScrum?: { code?: string | null, message?: string | null, id?: any | null } | null };

export type DeleteTeamScrumMutationVariables = Exact<{
  id: Scalars['Long']['input'];
}>;


export type DeleteTeamScrumMutation = { deleteTeamScrum?: { code?: string | null, message?: string | null, id?: any | null } | null };

export type AddNoveltyMutationVariables = Exact<{
  input?: InputMaybe<NoveltyDto>;
}>;


export type AddNoveltyMutation = { addNovelty?: { id?: any | null, code?: string | null, message?: string | null } | null };

export type GetNoveltyTypesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetNoveltyTypesQuery = { allNoveltyTypes?: { code?: string | null, message?: string | null, date?: string | null, currentPage?: number | null, totalItems?: number | null, totalPages?: number | null, data?: Array<{ id?: any | null, nameNovelty?: string | null, isActive?: boolean | null, description?: string | null, procedureDescription?: string | null } | null> | null } | null };


export const GetAllProcessMethodologiesAndProfilesDocument = gql`
    query GetAllProcessMethodologiesAndProfiles($page: Int, $size: Int, $search: String) {
  allProcessMethodology(page: $page, size: $size, search: $search) {
    data {
      id
      name
      description
      methodology {
        id
        name
      }
      profiles {
        id
        name
        description
        isActive
        isUnique
      }
    }
    currentPage
    totalItems
    totalPages
    message
    code
    date
  }
}
    `;

/**
 * __useGetAllProcessMethodologiesAndProfilesQuery__
 *
 * To run a query within a React component, call `useGetAllProcessMethodologiesAndProfilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllProcessMethodologiesAndProfilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllProcessMethodologiesAndProfilesQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useGetAllProcessMethodologiesAndProfilesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllProcessMethodologiesAndProfilesQuery, GetAllProcessMethodologiesAndProfilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllProcessMethodologiesAndProfilesQuery, GetAllProcessMethodologiesAndProfilesQueryVariables>(GetAllProcessMethodologiesAndProfilesDocument, options);
      }
export function useGetAllProcessMethodologiesAndProfilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllProcessMethodologiesAndProfilesQuery, GetAllProcessMethodologiesAndProfilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllProcessMethodologiesAndProfilesQuery, GetAllProcessMethodologiesAndProfilesQueryVariables>(GetAllProcessMethodologiesAndProfilesDocument, options);
        }
export function useGetAllProcessMethodologiesAndProfilesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllProcessMethodologiesAndProfilesQuery, GetAllProcessMethodologiesAndProfilesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllProcessMethodologiesAndProfilesQuery, GetAllProcessMethodologiesAndProfilesQueryVariables>(GetAllProcessMethodologiesAndProfilesDocument, options);
        }
export type GetAllProcessMethodologiesAndProfilesQueryHookResult = ReturnType<typeof useGetAllProcessMethodologiesAndProfilesQuery>;
export type GetAllProcessMethodologiesAndProfilesLazyQueryHookResult = ReturnType<typeof useGetAllProcessMethodologiesAndProfilesLazyQuery>;
export type GetAllProcessMethodologiesAndProfilesSuspenseQueryHookResult = ReturnType<typeof useGetAllProcessMethodologiesAndProfilesSuspenseQuery>;
export type GetAllProcessMethodologiesAndProfilesQueryResult = Apollo.QueryResult<GetAllProcessMethodologiesAndProfilesQuery, GetAllProcessMethodologiesAndProfilesQueryVariables>;
export const GetAllProfilesDocument = gql`
    query GetAllProfiles($page: Int, $size: Int) {
  allProfiles(page: $page, size: $size) {
    data {
      id
      name
      description
      isActive
      isUnique
    }
    totalItems
    totalPages
    currentPage
  }
}
    `;

/**
 * __useGetAllProfilesQuery__
 *
 * To run a query within a React component, call `useGetAllProfilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllProfilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllProfilesQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetAllProfilesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllProfilesQuery, GetAllProfilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllProfilesQuery, GetAllProfilesQueryVariables>(GetAllProfilesDocument, options);
      }
export function useGetAllProfilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllProfilesQuery, GetAllProfilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllProfilesQuery, GetAllProfilesQueryVariables>(GetAllProfilesDocument, options);
        }
export function useGetAllProfilesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllProfilesQuery, GetAllProfilesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllProfilesQuery, GetAllProfilesQueryVariables>(GetAllProfilesDocument, options);
        }
export type GetAllProfilesQueryHookResult = ReturnType<typeof useGetAllProfilesQuery>;
export type GetAllProfilesLazyQueryHookResult = ReturnType<typeof useGetAllProfilesLazyQuery>;
export type GetAllProfilesSuspenseQueryHookResult = ReturnType<typeof useGetAllProfilesSuspenseQuery>;
export type GetAllProfilesQueryResult = Apollo.QueryResult<GetAllProfilesQuery, GetAllProfilesQueryVariables>;
export const GetProfileByIdDocument = gql`
    query GetProfileById($id: String!) {
  ProfileById(id: $id) {
    data {
      id
      name
      description
      isActive
      isUnique
    }
  }
}
    `;

/**
 * __useGetProfileByIdQuery__
 *
 * To run a query within a React component, call `useGetProfileByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProfileByIdQuery(baseOptions: Apollo.QueryHookOptions<GetProfileByIdQuery, GetProfileByIdQueryVariables> & ({ variables: GetProfileByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProfileByIdQuery, GetProfileByIdQueryVariables>(GetProfileByIdDocument, options);
      }
export function useGetProfileByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileByIdQuery, GetProfileByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProfileByIdQuery, GetProfileByIdQueryVariables>(GetProfileByIdDocument, options);
        }
export function useGetProfileByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProfileByIdQuery, GetProfileByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProfileByIdQuery, GetProfileByIdQueryVariables>(GetProfileByIdDocument, options);
        }
export type GetProfileByIdQueryHookResult = ReturnType<typeof useGetProfileByIdQuery>;
export type GetProfileByIdLazyQueryHookResult = ReturnType<typeof useGetProfileByIdLazyQuery>;
export type GetProfileByIdSuspenseQueryHookResult = ReturnType<typeof useGetProfileByIdSuspenseQuery>;
export type GetProfileByIdQueryResult = Apollo.QueryResult<GetProfileByIdQuery, GetProfileByIdQueryVariables>;
export const GetStateAttendanceDocument = gql`
    query GetStateAttendance($page: Int, $size: Int) {
  allStateAttendances(page: $page, size: $size) {
    code
    date
    message
    totalPages
    totalItems
    currentPage
    data {
      id
      status
    }
  }
}
    `;

/**
 * __useGetStateAttendanceQuery__
 *
 * To run a query within a React component, call `useGetStateAttendanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStateAttendanceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStateAttendanceQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetStateAttendanceQuery(baseOptions?: Apollo.QueryHookOptions<GetStateAttendanceQuery, GetStateAttendanceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStateAttendanceQuery, GetStateAttendanceQueryVariables>(GetStateAttendanceDocument, options);
      }
export function useGetStateAttendanceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStateAttendanceQuery, GetStateAttendanceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStateAttendanceQuery, GetStateAttendanceQueryVariables>(GetStateAttendanceDocument, options);
        }
export function useGetStateAttendanceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStateAttendanceQuery, GetStateAttendanceQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStateAttendanceQuery, GetStateAttendanceQueryVariables>(GetStateAttendanceDocument, options);
        }
export type GetStateAttendanceQueryHookResult = ReturnType<typeof useGetStateAttendanceQuery>;
export type GetStateAttendanceLazyQueryHookResult = ReturnType<typeof useGetStateAttendanceLazyQuery>;
export type GetStateAttendanceSuspenseQueryHookResult = ReturnType<typeof useGetStateAttendanceSuspenseQuery>;
export type GetStateAttendanceQueryResult = Apollo.QueryResult<GetStateAttendanceQuery, GetStateAttendanceQueryVariables>;
export const AddStateAttendanceDocument = gql`
    mutation AddStateAttendance($input: AttendanceStateDto!) {
  addStateAttendance(input: $input) {
    code
    message
    id
  }
}
    `;
export type AddStateAttendanceMutationFn = Apollo.MutationFunction<AddStateAttendanceMutation, AddStateAttendanceMutationVariables>;

/**
 * __useAddStateAttendanceMutation__
 *
 * To run a mutation, you first call `useAddStateAttendanceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddStateAttendanceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addStateAttendanceMutation, { data, loading, error }] = useAddStateAttendanceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddStateAttendanceMutation(baseOptions?: Apollo.MutationHookOptions<AddStateAttendanceMutation, AddStateAttendanceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddStateAttendanceMutation, AddStateAttendanceMutationVariables>(AddStateAttendanceDocument, options);
      }
export type AddStateAttendanceMutationHookResult = ReturnType<typeof useAddStateAttendanceMutation>;
export type AddStateAttendanceMutationResult = Apollo.MutationResult<AddStateAttendanceMutation>;
export type AddStateAttendanceMutationOptions = Apollo.BaseMutationOptions<AddStateAttendanceMutation, AddStateAttendanceMutationVariables>;
export const UpdateStateAttendanceDocument = gql`
    mutation UpdateStateAttendance($id: Long!, $input: AttendanceStateDto!) {
  updateStateAttendance(id: $id, input: $input) {
    code
    message
    id
  }
}
    `;
export type UpdateStateAttendanceMutationFn = Apollo.MutationFunction<UpdateStateAttendanceMutation, UpdateStateAttendanceMutationVariables>;

/**
 * __useUpdateStateAttendanceMutation__
 *
 * To run a mutation, you first call `useUpdateStateAttendanceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStateAttendanceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStateAttendanceMutation, { data, loading, error }] = useUpdateStateAttendanceMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateStateAttendanceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStateAttendanceMutation, UpdateStateAttendanceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStateAttendanceMutation, UpdateStateAttendanceMutationVariables>(UpdateStateAttendanceDocument, options);
      }
export type UpdateStateAttendanceMutationHookResult = ReturnType<typeof useUpdateStateAttendanceMutation>;
export type UpdateStateAttendanceMutationResult = Apollo.MutationResult<UpdateStateAttendanceMutation>;
export type UpdateStateAttendanceMutationOptions = Apollo.BaseMutationOptions<UpdateStateAttendanceMutation, UpdateStateAttendanceMutationVariables>;
export const DeleteStateAttendanceDocument = gql`
    mutation DeleteStateAttendance($id: Long!) {
  deleteStateAttendance(id: $id) {
    code
    message
    id
  }
}
    `;
export type DeleteStateAttendanceMutationFn = Apollo.MutationFunction<DeleteStateAttendanceMutation, DeleteStateAttendanceMutationVariables>;

/**
 * __useDeleteStateAttendanceMutation__
 *
 * To run a mutation, you first call `useDeleteStateAttendanceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteStateAttendanceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteStateAttendanceMutation, { data, loading, error }] = useDeleteStateAttendanceMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteStateAttendanceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteStateAttendanceMutation, DeleteStateAttendanceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteStateAttendanceMutation, DeleteStateAttendanceMutationVariables>(DeleteStateAttendanceDocument, options);
      }
export type DeleteStateAttendanceMutationHookResult = ReturnType<typeof useDeleteStateAttendanceMutation>;
export type DeleteStateAttendanceMutationResult = Apollo.MutationResult<DeleteStateAttendanceMutation>;
export type DeleteStateAttendanceMutationOptions = Apollo.BaseMutationOptions<DeleteStateAttendanceMutation, DeleteStateAttendanceMutationVariables>;
export const GetAttendancesDocument = gql`
    query GetAttendances($page: Int, $size: Int) {
  allAttendances(page: $page, size: $size) {
    date
    code
    message
    data {
      id
      attendanceDate
      attendanceState {
        id
        status
      }
      student {
        id
        person {
          name
          lastname
          document
        }
      }
    }
    currentPage
    totalPages
    totalItems
  }
}
    `;

/**
 * __useGetAttendancesQuery__
 *
 * To run a query within a React component, call `useGetAttendancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttendancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttendancesQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetAttendancesQuery(baseOptions?: Apollo.QueryHookOptions<GetAttendancesQuery, GetAttendancesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAttendancesQuery, GetAttendancesQueryVariables>(GetAttendancesDocument, options);
      }
export function useGetAttendancesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttendancesQuery, GetAttendancesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAttendancesQuery, GetAttendancesQueryVariables>(GetAttendancesDocument, options);
        }
export function useGetAttendancesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAttendancesQuery, GetAttendancesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAttendancesQuery, GetAttendancesQueryVariables>(GetAttendancesDocument, options);
        }
export type GetAttendancesQueryHookResult = ReturnType<typeof useGetAttendancesQuery>;
export type GetAttendancesLazyQueryHookResult = ReturnType<typeof useGetAttendancesLazyQuery>;
export type GetAttendancesSuspenseQueryHookResult = ReturnType<typeof useGetAttendancesSuspenseQuery>;
export type GetAttendancesQueryResult = Apollo.QueryResult<GetAttendancesQuery, GetAttendancesQueryVariables>;
export const AllAttendancesByStudentIdDocument = gql`
    query allAttendancesByStudentId($id: Long, $stateId: Long) {
  allAttendancesByStudentId(id: $id, stateId: $stateId) {
    data {
      id
      attendanceDate
      student {
        id
        person {
          name
          lastname
          document
        }
      }
      attendanceState {
        id
        status
      }
    }
  }
}
    `;

/**
 * __useAllAttendancesByStudentIdQuery__
 *
 * To run a query within a React component, call `useAllAttendancesByStudentIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllAttendancesByStudentIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllAttendancesByStudentIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *      stateId: // value for 'stateId'
 *   },
 * });
 */
export function useAllAttendancesByStudentIdQuery(baseOptions?: Apollo.QueryHookOptions<AllAttendancesByStudentIdQuery, AllAttendancesByStudentIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllAttendancesByStudentIdQuery, AllAttendancesByStudentIdQueryVariables>(AllAttendancesByStudentIdDocument, options);
      }
export function useAllAttendancesByStudentIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllAttendancesByStudentIdQuery, AllAttendancesByStudentIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllAttendancesByStudentIdQuery, AllAttendancesByStudentIdQueryVariables>(AllAttendancesByStudentIdDocument, options);
        }
export function useAllAttendancesByStudentIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AllAttendancesByStudentIdQuery, AllAttendancesByStudentIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AllAttendancesByStudentIdQuery, AllAttendancesByStudentIdQueryVariables>(AllAttendancesByStudentIdDocument, options);
        }
export type AllAttendancesByStudentIdQueryHookResult = ReturnType<typeof useAllAttendancesByStudentIdQuery>;
export type AllAttendancesByStudentIdLazyQueryHookResult = ReturnType<typeof useAllAttendancesByStudentIdLazyQuery>;
export type AllAttendancesByStudentIdSuspenseQueryHookResult = ReturnType<typeof useAllAttendancesByStudentIdSuspenseQuery>;
export type AllAttendancesByStudentIdQueryResult = Apollo.QueryResult<AllAttendancesByStudentIdQuery, AllAttendancesByStudentIdQueryVariables>;
export const AllAttendancesWithJustificationsByStudentIdDocument = gql`
    query allAttendancesWithJustificationsByStudentId($id: Long, $stateId: Long) {
  allAttendancesByStudentId(id: $id, stateId: $stateId) {
    data {
      id
      attendanceDate
      student {
        id
        person {
          name
          lastname
          document
        }
      }
      attendanceState {
        id
        status
      }
      justification {
        justificationStatus {
          id
          name
        }
      }
    }
  }
}
    `;

/**
 * __useAllAttendancesWithJustificationsByStudentIdQuery__
 *
 * To run a query within a React component, call `useAllAttendancesWithJustificationsByStudentIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllAttendancesWithJustificationsByStudentIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllAttendancesWithJustificationsByStudentIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *      stateId: // value for 'stateId'
 *   },
 * });
 */
export function useAllAttendancesWithJustificationsByStudentIdQuery(baseOptions?: Apollo.QueryHookOptions<AllAttendancesWithJustificationsByStudentIdQuery, AllAttendancesWithJustificationsByStudentIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllAttendancesWithJustificationsByStudentIdQuery, AllAttendancesWithJustificationsByStudentIdQueryVariables>(AllAttendancesWithJustificationsByStudentIdDocument, options);
      }
export function useAllAttendancesWithJustificationsByStudentIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllAttendancesWithJustificationsByStudentIdQuery, AllAttendancesWithJustificationsByStudentIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllAttendancesWithJustificationsByStudentIdQuery, AllAttendancesWithJustificationsByStudentIdQueryVariables>(AllAttendancesWithJustificationsByStudentIdDocument, options);
        }
export function useAllAttendancesWithJustificationsByStudentIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AllAttendancesWithJustificationsByStudentIdQuery, AllAttendancesWithJustificationsByStudentIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AllAttendancesWithJustificationsByStudentIdQuery, AllAttendancesWithJustificationsByStudentIdQueryVariables>(AllAttendancesWithJustificationsByStudentIdDocument, options);
        }
export type AllAttendancesWithJustificationsByStudentIdQueryHookResult = ReturnType<typeof useAllAttendancesWithJustificationsByStudentIdQuery>;
export type AllAttendancesWithJustificationsByStudentIdLazyQueryHookResult = ReturnType<typeof useAllAttendancesWithJustificationsByStudentIdLazyQuery>;
export type AllAttendancesWithJustificationsByStudentIdSuspenseQueryHookResult = ReturnType<typeof useAllAttendancesWithJustificationsByStudentIdSuspenseQuery>;
export type AllAttendancesWithJustificationsByStudentIdQueryResult = Apollo.QueryResult<AllAttendancesWithJustificationsByStudentIdQuery, AllAttendancesWithJustificationsByStudentIdQueryVariables>;
export const GetAttendancesAndCompetenceByStudentIdDocument = gql`
    query GetAttendancesAndCompetenceByStudentId($id: Long) {
  allAttendancesByStudentId(id: $id) {
    data {
      id
      attendanceDate
      attendanceState {
        status
      }
      competenceQuarter {
        id
        competence {
          name
        }
      }
    }
  }
}
    `;

/**
 * __useGetAttendancesAndCompetenceByStudentIdQuery__
 *
 * To run a query within a React component, call `useGetAttendancesAndCompetenceByStudentIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttendancesAndCompetenceByStudentIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttendancesAndCompetenceByStudentIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAttendancesAndCompetenceByStudentIdQuery(baseOptions?: Apollo.QueryHookOptions<GetAttendancesAndCompetenceByStudentIdQuery, GetAttendancesAndCompetenceByStudentIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAttendancesAndCompetenceByStudentIdQuery, GetAttendancesAndCompetenceByStudentIdQueryVariables>(GetAttendancesAndCompetenceByStudentIdDocument, options);
      }
export function useGetAttendancesAndCompetenceByStudentIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttendancesAndCompetenceByStudentIdQuery, GetAttendancesAndCompetenceByStudentIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAttendancesAndCompetenceByStudentIdQuery, GetAttendancesAndCompetenceByStudentIdQueryVariables>(GetAttendancesAndCompetenceByStudentIdDocument, options);
        }
export function useGetAttendancesAndCompetenceByStudentIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAttendancesAndCompetenceByStudentIdQuery, GetAttendancesAndCompetenceByStudentIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAttendancesAndCompetenceByStudentIdQuery, GetAttendancesAndCompetenceByStudentIdQueryVariables>(GetAttendancesAndCompetenceByStudentIdDocument, options);
        }
export type GetAttendancesAndCompetenceByStudentIdQueryHookResult = ReturnType<typeof useGetAttendancesAndCompetenceByStudentIdQuery>;
export type GetAttendancesAndCompetenceByStudentIdLazyQueryHookResult = ReturnType<typeof useGetAttendancesAndCompetenceByStudentIdLazyQuery>;
export type GetAttendancesAndCompetenceByStudentIdSuspenseQueryHookResult = ReturnType<typeof useGetAttendancesAndCompetenceByStudentIdSuspenseQuery>;
export type GetAttendancesAndCompetenceByStudentIdQueryResult = Apollo.QueryResult<GetAttendancesAndCompetenceByStudentIdQuery, GetAttendancesAndCompetenceByStudentIdQueryVariables>;
export const GetAttendancesAndJustificationsByStudentDocument = gql`
    query GetAttendancesAndJustificationsByStudent($id: Long!) {
  allAttendancesByStudentId(id: $id) {
    data {
      id
      justification {
        id
        description
        justificationFile
        absenceDate
        justificationType {
          id
          name
        }
      }
    }
  }
}
    `;

/**
 * __useGetAttendancesAndJustificationsByStudentQuery__
 *
 * To run a query within a React component, call `useGetAttendancesAndJustificationsByStudentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttendancesAndJustificationsByStudentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttendancesAndJustificationsByStudentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAttendancesAndJustificationsByStudentQuery(baseOptions: Apollo.QueryHookOptions<GetAttendancesAndJustificationsByStudentQuery, GetAttendancesAndJustificationsByStudentQueryVariables> & ({ variables: GetAttendancesAndJustificationsByStudentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAttendancesAndJustificationsByStudentQuery, GetAttendancesAndJustificationsByStudentQueryVariables>(GetAttendancesAndJustificationsByStudentDocument, options);
      }
export function useGetAttendancesAndJustificationsByStudentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttendancesAndJustificationsByStudentQuery, GetAttendancesAndJustificationsByStudentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAttendancesAndJustificationsByStudentQuery, GetAttendancesAndJustificationsByStudentQueryVariables>(GetAttendancesAndJustificationsByStudentDocument, options);
        }
export function useGetAttendancesAndJustificationsByStudentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAttendancesAndJustificationsByStudentQuery, GetAttendancesAndJustificationsByStudentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAttendancesAndJustificationsByStudentQuery, GetAttendancesAndJustificationsByStudentQueryVariables>(GetAttendancesAndJustificationsByStudentDocument, options);
        }
export type GetAttendancesAndJustificationsByStudentQueryHookResult = ReturnType<typeof useGetAttendancesAndJustificationsByStudentQuery>;
export type GetAttendancesAndJustificationsByStudentLazyQueryHookResult = ReturnType<typeof useGetAttendancesAndJustificationsByStudentLazyQuery>;
export type GetAttendancesAndJustificationsByStudentSuspenseQueryHookResult = ReturnType<typeof useGetAttendancesAndJustificationsByStudentSuspenseQuery>;
export type GetAttendancesAndJustificationsByStudentQueryResult = Apollo.QueryResult<GetAttendancesAndJustificationsByStudentQuery, GetAttendancesAndJustificationsByStudentQueryVariables>;
export const GetAttendancesByCompetenceQuarterAndJustificationsDocument = gql`
    query GetAttendancesByCompetenceQuarterAndJustifications($competenceQuarterId: Long!) {
  allAttendanceByCompetenceQuarterIdWithJustifications(
    competenceQuarterId: $competenceQuarterId
  ) {
    data {
      id
      justification {
        id
        absenceDate
        justificationDate
        justificationFile
        justificationStatus {
          id
          name
        }
      }
      student {
        person {
          name
          lastname
          document
        }
        studentStudySheets {
          studySheet {
            number
            teacherStudySheets {
              competence {
                learningOutcome {
                  code
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetAttendancesByCompetenceQuarterAndJustificationsQuery__
 *
 * To run a query within a React component, call `useGetAttendancesByCompetenceQuarterAndJustificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttendancesByCompetenceQuarterAndJustificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttendancesByCompetenceQuarterAndJustificationsQuery({
 *   variables: {
 *      competenceQuarterId: // value for 'competenceQuarterId'
 *   },
 * });
 */
export function useGetAttendancesByCompetenceQuarterAndJustificationsQuery(baseOptions: Apollo.QueryHookOptions<GetAttendancesByCompetenceQuarterAndJustificationsQuery, GetAttendancesByCompetenceQuarterAndJustificationsQueryVariables> & ({ variables: GetAttendancesByCompetenceQuarterAndJustificationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAttendancesByCompetenceQuarterAndJustificationsQuery, GetAttendancesByCompetenceQuarterAndJustificationsQueryVariables>(GetAttendancesByCompetenceQuarterAndJustificationsDocument, options);
      }
export function useGetAttendancesByCompetenceQuarterAndJustificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttendancesByCompetenceQuarterAndJustificationsQuery, GetAttendancesByCompetenceQuarterAndJustificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAttendancesByCompetenceQuarterAndJustificationsQuery, GetAttendancesByCompetenceQuarterAndJustificationsQueryVariables>(GetAttendancesByCompetenceQuarterAndJustificationsDocument, options);
        }
export function useGetAttendancesByCompetenceQuarterAndJustificationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAttendancesByCompetenceQuarterAndJustificationsQuery, GetAttendancesByCompetenceQuarterAndJustificationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAttendancesByCompetenceQuarterAndJustificationsQuery, GetAttendancesByCompetenceQuarterAndJustificationsQueryVariables>(GetAttendancesByCompetenceQuarterAndJustificationsDocument, options);
        }
export type GetAttendancesByCompetenceQuarterAndJustificationsQueryHookResult = ReturnType<typeof useGetAttendancesByCompetenceQuarterAndJustificationsQuery>;
export type GetAttendancesByCompetenceQuarterAndJustificationsLazyQueryHookResult = ReturnType<typeof useGetAttendancesByCompetenceQuarterAndJustificationsLazyQuery>;
export type GetAttendancesByCompetenceQuarterAndJustificationsSuspenseQueryHookResult = ReturnType<typeof useGetAttendancesByCompetenceQuarterAndJustificationsSuspenseQuery>;
export type GetAttendancesByCompetenceQuarterAndJustificationsQueryResult = Apollo.QueryResult<GetAttendancesByCompetenceQuarterAndJustificationsQuery, GetAttendancesByCompetenceQuarterAndJustificationsQueryVariables>;
export const AddAttendanceDocument = gql`
    mutation AddAttendance($input: AttendanceDto!) {
  addAttendance(input: $input) {
    code
    message
    id
  }
}
    `;
export type AddAttendanceMutationFn = Apollo.MutationFunction<AddAttendanceMutation, AddAttendanceMutationVariables>;

/**
 * __useAddAttendanceMutation__
 *
 * To run a mutation, you first call `useAddAttendanceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddAttendanceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addAttendanceMutation, { data, loading, error }] = useAddAttendanceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddAttendanceMutation(baseOptions?: Apollo.MutationHookOptions<AddAttendanceMutation, AddAttendanceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddAttendanceMutation, AddAttendanceMutationVariables>(AddAttendanceDocument, options);
      }
export type AddAttendanceMutationHookResult = ReturnType<typeof useAddAttendanceMutation>;
export type AddAttendanceMutationResult = Apollo.MutationResult<AddAttendanceMutation>;
export type AddAttendanceMutationOptions = Apollo.BaseMutationOptions<AddAttendanceMutation, AddAttendanceMutationVariables>;
export const UpdateAttendanceDocument = gql`
    mutation UpdateAttendance($id: Long!, $input: AttendanceDto!) {
  updateAttendance(id: $id, input: $input) {
    code
    message
    id
  }
}
    `;
export type UpdateAttendanceMutationFn = Apollo.MutationFunction<UpdateAttendanceMutation, UpdateAttendanceMutationVariables>;

/**
 * __useUpdateAttendanceMutation__
 *
 * To run a mutation, you first call `useUpdateAttendanceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAttendanceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAttendanceMutation, { data, loading, error }] = useUpdateAttendanceMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAttendanceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAttendanceMutation, UpdateAttendanceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAttendanceMutation, UpdateAttendanceMutationVariables>(UpdateAttendanceDocument, options);
      }
export type UpdateAttendanceMutationHookResult = ReturnType<typeof useUpdateAttendanceMutation>;
export type UpdateAttendanceMutationResult = Apollo.MutationResult<UpdateAttendanceMutation>;
export type UpdateAttendanceMutationOptions = Apollo.BaseMutationOptions<UpdateAttendanceMutation, UpdateAttendanceMutationVariables>;
export const DeleteAttendanceDocument = gql`
    mutation DeleteAttendance($id: Long!) {
  deleteAttendance(id: $id) {
    code
    message
    id
  }
}
    `;
export type DeleteAttendanceMutationFn = Apollo.MutationFunction<DeleteAttendanceMutation, DeleteAttendanceMutationVariables>;

/**
 * __useDeleteAttendanceMutation__
 *
 * To run a mutation, you first call `useDeleteAttendanceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAttendanceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAttendanceMutation, { data, loading, error }] = useDeleteAttendanceMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAttendanceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAttendanceMutation, DeleteAttendanceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAttendanceMutation, DeleteAttendanceMutationVariables>(DeleteAttendanceDocument, options);
      }
export type DeleteAttendanceMutationHookResult = ReturnType<typeof useDeleteAttendanceMutation>;
export type DeleteAttendanceMutationResult = Apollo.MutationResult<DeleteAttendanceMutation>;
export type DeleteAttendanceMutationOptions = Apollo.BaseMutationOptions<DeleteAttendanceMutation, DeleteAttendanceMutationVariables>;
export const GetAllChecklistsDocument = gql`
    query GetAllChecklists($page: Int, $size: Int) {
  allChecklists(page: $page, size: $size) {
    date
    code
    message
    currentPage
    totalPages
    totalItems
    data {
      id
      state
      remarks
      instructorSignature
      evaluationCriteria
      trimester
      component
      studySheets
      items {
        id
        code
        indicator
        active
      }
    }
  }
}
    `;

/**
 * __useGetAllChecklistsQuery__
 *
 * To run a query within a React component, call `useGetAllChecklistsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllChecklistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllChecklistsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetAllChecklistsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllChecklistsQuery, GetAllChecklistsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllChecklistsQuery, GetAllChecklistsQueryVariables>(GetAllChecklistsDocument, options);
      }
export function useGetAllChecklistsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllChecklistsQuery, GetAllChecklistsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllChecklistsQuery, GetAllChecklistsQueryVariables>(GetAllChecklistsDocument, options);
        }
export function useGetAllChecklistsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllChecklistsQuery, GetAllChecklistsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllChecklistsQuery, GetAllChecklistsQueryVariables>(GetAllChecklistsDocument, options);
        }
export type GetAllChecklistsQueryHookResult = ReturnType<typeof useGetAllChecklistsQuery>;
export type GetAllChecklistsLazyQueryHookResult = ReturnType<typeof useGetAllChecklistsLazyQuery>;
export type GetAllChecklistsSuspenseQueryHookResult = ReturnType<typeof useGetAllChecklistsSuspenseQuery>;
export type GetAllChecklistsQueryResult = Apollo.QueryResult<GetAllChecklistsQuery, GetAllChecklistsQueryVariables>;
export const GetChecklistByIdDocument = gql`
    query GetChecklistById($id: Long!) {
  checklistById(id: $id) {
    code
    date
    message
    data {
      id
      state
      remarks
      instructorSignature
      evaluationCriteria
      trimester
      component
      studySheets
      items {
        id
        code
        indicator
        active
      }
      evaluations {
        id
        observations
        recommendations
        valueJudgment
        checklistId
      }
      associatedJuries {
        id
      }
    }
  }
}
    `;

/**
 * __useGetChecklistByIdQuery__
 *
 * To run a query within a React component, call `useGetChecklistByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChecklistByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChecklistByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetChecklistByIdQuery(baseOptions: Apollo.QueryHookOptions<GetChecklistByIdQuery, GetChecklistByIdQueryVariables> & ({ variables: GetChecklistByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChecklistByIdQuery, GetChecklistByIdQueryVariables>(GetChecklistByIdDocument, options);
      }
export function useGetChecklistByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChecklistByIdQuery, GetChecklistByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChecklistByIdQuery, GetChecklistByIdQueryVariables>(GetChecklistByIdDocument, options);
        }
export function useGetChecklistByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetChecklistByIdQuery, GetChecklistByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetChecklistByIdQuery, GetChecklistByIdQueryVariables>(GetChecklistByIdDocument, options);
        }
export type GetChecklistByIdQueryHookResult = ReturnType<typeof useGetChecklistByIdQuery>;
export type GetChecklistByIdLazyQueryHookResult = ReturnType<typeof useGetChecklistByIdLazyQuery>;
export type GetChecklistByIdSuspenseQueryHookResult = ReturnType<typeof useGetChecklistByIdSuspenseQuery>;
export type GetChecklistByIdQueryResult = Apollo.QueryResult<GetChecklistByIdQuery, GetChecklistByIdQueryVariables>;
export const GetAllChecklistsCoordinatorDocument = gql`
    query GetAllChecklistsCoordinator($page: Int, $size: Int) {
  allChecklists(page: $page, size: $size) {
    date
    code
    message
    currentPage
    totalPages
    totalItems
    data {
      id
      state
      remarks
      instructorSignature
      evaluationCriteria
      trimester
      component
      studySheets
      trainingProjectId
      trainingProjectName
      items {
        id
        code
        indicator
        active
      }
    }
  }
}
    `;

/**
 * __useGetAllChecklistsCoordinatorQuery__
 *
 * To run a query within a React component, call `useGetAllChecklistsCoordinatorQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllChecklistsCoordinatorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllChecklistsCoordinatorQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetAllChecklistsCoordinatorQuery(baseOptions?: Apollo.QueryHookOptions<GetAllChecklistsCoordinatorQuery, GetAllChecklistsCoordinatorQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllChecklistsCoordinatorQuery, GetAllChecklistsCoordinatorQueryVariables>(GetAllChecklistsCoordinatorDocument, options);
      }
export function useGetAllChecklistsCoordinatorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllChecklistsCoordinatorQuery, GetAllChecklistsCoordinatorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllChecklistsCoordinatorQuery, GetAllChecklistsCoordinatorQueryVariables>(GetAllChecklistsCoordinatorDocument, options);
        }
export function useGetAllChecklistsCoordinatorSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllChecklistsCoordinatorQuery, GetAllChecklistsCoordinatorQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllChecklistsCoordinatorQuery, GetAllChecklistsCoordinatorQueryVariables>(GetAllChecklistsCoordinatorDocument, options);
        }
export type GetAllChecklistsCoordinatorQueryHookResult = ReturnType<typeof useGetAllChecklistsCoordinatorQuery>;
export type GetAllChecklistsCoordinatorLazyQueryHookResult = ReturnType<typeof useGetAllChecklistsCoordinatorLazyQuery>;
export type GetAllChecklistsCoordinatorSuspenseQueryHookResult = ReturnType<typeof useGetAllChecklistsCoordinatorSuspenseQuery>;
export type GetAllChecklistsCoordinatorQueryResult = Apollo.QueryResult<GetAllChecklistsCoordinatorQuery, GetAllChecklistsCoordinatorQueryVariables>;
export const GetChecklistByIdCoordinatorDocument = gql`
    query GetChecklistByIdCoordinator($id: Long!) {
  checklistById(id: $id) {
    code
    date
    message
    data {
      id
      state
      remarks
      instructorSignature
      evaluationCriteria
      trimester
      component
      studySheets
      trainingProjectId
      trainingProjectName
      items {
        id
        code
        indicator
        active
      }
      evaluations {
        id
        observations
        recommendations
        valueJudgment
        checklistId
      }
      associatedJuries {
        id
      }
    }
  }
}
    `;

/**
 * __useGetChecklistByIdCoordinatorQuery__
 *
 * To run a query within a React component, call `useGetChecklistByIdCoordinatorQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChecklistByIdCoordinatorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChecklistByIdCoordinatorQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetChecklistByIdCoordinatorQuery(baseOptions: Apollo.QueryHookOptions<GetChecklistByIdCoordinatorQuery, GetChecklistByIdCoordinatorQueryVariables> & ({ variables: GetChecklistByIdCoordinatorQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChecklistByIdCoordinatorQuery, GetChecklistByIdCoordinatorQueryVariables>(GetChecklistByIdCoordinatorDocument, options);
      }
export function useGetChecklistByIdCoordinatorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChecklistByIdCoordinatorQuery, GetChecklistByIdCoordinatorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChecklistByIdCoordinatorQuery, GetChecklistByIdCoordinatorQueryVariables>(GetChecklistByIdCoordinatorDocument, options);
        }
export function useGetChecklistByIdCoordinatorSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetChecklistByIdCoordinatorQuery, GetChecklistByIdCoordinatorQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetChecklistByIdCoordinatorQuery, GetChecklistByIdCoordinatorQueryVariables>(GetChecklistByIdCoordinatorDocument, options);
        }
export type GetChecklistByIdCoordinatorQueryHookResult = ReturnType<typeof useGetChecklistByIdCoordinatorQuery>;
export type GetChecklistByIdCoordinatorLazyQueryHookResult = ReturnType<typeof useGetChecklistByIdCoordinatorLazyQuery>;
export type GetChecklistByIdCoordinatorSuspenseQueryHookResult = ReturnType<typeof useGetChecklistByIdCoordinatorSuspenseQuery>;
export type GetChecklistByIdCoordinatorQueryResult = Apollo.QueryResult<GetChecklistByIdCoordinatorQuery, GetChecklistByIdCoordinatorQueryVariables>;
export const GetAllChecklistsInstructorDocument = gql`
    query GetAllChecklistsInstructor($page: Int, $size: Int) {
  allChecklists(page: $page, size: $size) {
    date
    code
    message
    currentPage
    totalPages
    totalItems
    data {
      id
      state
      remarks
      instructorSignature
      evaluationCriteria
      trimester
      component
      studySheets
      items {
        id
        code
        indicator
        active
      }
    }
  }
}
    `;

/**
 * __useGetAllChecklistsInstructorQuery__
 *
 * To run a query within a React component, call `useGetAllChecklistsInstructorQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllChecklistsInstructorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllChecklistsInstructorQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetAllChecklistsInstructorQuery(baseOptions?: Apollo.QueryHookOptions<GetAllChecklistsInstructorQuery, GetAllChecklistsInstructorQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllChecklistsInstructorQuery, GetAllChecklistsInstructorQueryVariables>(GetAllChecklistsInstructorDocument, options);
      }
export function useGetAllChecklistsInstructorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllChecklistsInstructorQuery, GetAllChecklistsInstructorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllChecklistsInstructorQuery, GetAllChecklistsInstructorQueryVariables>(GetAllChecklistsInstructorDocument, options);
        }
export function useGetAllChecklistsInstructorSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllChecklistsInstructorQuery, GetAllChecklistsInstructorQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllChecklistsInstructorQuery, GetAllChecklistsInstructorQueryVariables>(GetAllChecklistsInstructorDocument, options);
        }
export type GetAllChecklistsInstructorQueryHookResult = ReturnType<typeof useGetAllChecklistsInstructorQuery>;
export type GetAllChecklistsInstructorLazyQueryHookResult = ReturnType<typeof useGetAllChecklistsInstructorLazyQuery>;
export type GetAllChecklistsInstructorSuspenseQueryHookResult = ReturnType<typeof useGetAllChecklistsInstructorSuspenseQuery>;
export type GetAllChecklistsInstructorQueryResult = Apollo.QueryResult<GetAllChecklistsInstructorQuery, GetAllChecklistsInstructorQueryVariables>;
export const GetChecklistByIdInstructorDocument = gql`
    query GetChecklistByIdInstructor($id: Long!) {
  checklistById(id: $id) {
    code
    date
    message
    data {
      id
      state
      remarks
      instructorSignature
      evaluationCriteria
      trimester
      component
      studySheets
      items {
        id
        code
        indicator
        active
      }
      evaluations {
        id
        observations
        recommendations
        valueJudgment
        checklistId
      }
      associatedJuries {
        id
      }
    }
  }
}
    `;

/**
 * __useGetChecklistByIdInstructorQuery__
 *
 * To run a query within a React component, call `useGetChecklistByIdInstructorQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChecklistByIdInstructorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChecklistByIdInstructorQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetChecklistByIdInstructorQuery(baseOptions: Apollo.QueryHookOptions<GetChecklistByIdInstructorQuery, GetChecklistByIdInstructorQueryVariables> & ({ variables: GetChecklistByIdInstructorQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChecklistByIdInstructorQuery, GetChecklistByIdInstructorQueryVariables>(GetChecklistByIdInstructorDocument, options);
      }
export function useGetChecklistByIdInstructorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChecklistByIdInstructorQuery, GetChecklistByIdInstructorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChecklistByIdInstructorQuery, GetChecklistByIdInstructorQueryVariables>(GetChecklistByIdInstructorDocument, options);
        }
export function useGetChecklistByIdInstructorSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetChecklistByIdInstructorQuery, GetChecklistByIdInstructorQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetChecklistByIdInstructorQuery, GetChecklistByIdInstructorQueryVariables>(GetChecklistByIdInstructorDocument, options);
        }
export type GetChecklistByIdInstructorQueryHookResult = ReturnType<typeof useGetChecklistByIdInstructorQuery>;
export type GetChecklistByIdInstructorLazyQueryHookResult = ReturnType<typeof useGetChecklistByIdInstructorLazyQuery>;
export type GetChecklistByIdInstructorSuspenseQueryHookResult = ReturnType<typeof useGetChecklistByIdInstructorSuspenseQuery>;
export type GetChecklistByIdInstructorQueryResult = Apollo.QueryResult<GetChecklistByIdInstructorQuery, GetChecklistByIdInstructorQueryVariables>;
export const AddChecklistDocument = gql`
    mutation AddChecklist($input: ChecklistDto!) {
  addChecklist(input: $input) {
    code
    message
    id
  }
}
    `;
export type AddChecklistMutationFn = Apollo.MutationFunction<AddChecklistMutation, AddChecklistMutationVariables>;

/**
 * __useAddChecklistMutation__
 *
 * To run a mutation, you first call `useAddChecklistMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddChecklistMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addChecklistMutation, { data, loading, error }] = useAddChecklistMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddChecklistMutation(baseOptions?: Apollo.MutationHookOptions<AddChecklistMutation, AddChecklistMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddChecklistMutation, AddChecklistMutationVariables>(AddChecklistDocument, options);
      }
export type AddChecklistMutationHookResult = ReturnType<typeof useAddChecklistMutation>;
export type AddChecklistMutationResult = Apollo.MutationResult<AddChecklistMutation>;
export type AddChecklistMutationOptions = Apollo.BaseMutationOptions<AddChecklistMutation, AddChecklistMutationVariables>;
export const UpdateChecklistDocument = gql`
    mutation UpdateChecklist($id: Long!, $input: ChecklistDto!) {
  updateChecklist(id: $id, input: $input) {
    code
    message
    id
  }
}
    `;
export type UpdateChecklistMutationFn = Apollo.MutationFunction<UpdateChecklistMutation, UpdateChecklistMutationVariables>;

/**
 * __useUpdateChecklistMutation__
 *
 * To run a mutation, you first call `useUpdateChecklistMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateChecklistMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateChecklistMutation, { data, loading, error }] = useUpdateChecklistMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateChecklistMutation(baseOptions?: Apollo.MutationHookOptions<UpdateChecklistMutation, UpdateChecklistMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateChecklistMutation, UpdateChecklistMutationVariables>(UpdateChecklistDocument, options);
      }
export type UpdateChecklistMutationHookResult = ReturnType<typeof useUpdateChecklistMutation>;
export type UpdateChecklistMutationResult = Apollo.MutationResult<UpdateChecklistMutation>;
export type UpdateChecklistMutationOptions = Apollo.BaseMutationOptions<UpdateChecklistMutation, UpdateChecklistMutationVariables>;
export const DeleteChecklistDocument = gql`
    mutation DeleteChecklist($id: Long!) {
  deleteChecklist(id: $id) {
    code
    message
    id
  }
}
    `;
export type DeleteChecklistMutationFn = Apollo.MutationFunction<DeleteChecklistMutation, DeleteChecklistMutationVariables>;

/**
 * __useDeleteChecklistMutation__
 *
 * To run a mutation, you first call `useDeleteChecklistMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteChecklistMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteChecklistMutation, { data, loading, error }] = useDeleteChecklistMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteChecklistMutation(baseOptions?: Apollo.MutationHookOptions<DeleteChecklistMutation, DeleteChecklistMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteChecklistMutation, DeleteChecklistMutationVariables>(DeleteChecklistDocument, options);
      }
export type DeleteChecklistMutationHookResult = ReturnType<typeof useDeleteChecklistMutation>;
export type DeleteChecklistMutationResult = Apollo.MutationResult<DeleteChecklistMutation>;
export type DeleteChecklistMutationOptions = Apollo.BaseMutationOptions<DeleteChecklistMutation, DeleteChecklistMutationVariables>;
export const UpdateItemStatusDocument = gql`
    mutation UpdateItemStatus($itemId: Long!, $active: Boolean!) {
  updateItemStatus(itemId: $itemId, active: $active) {
    code
    message
    id
  }
}
    `;
export type UpdateItemStatusMutationFn = Apollo.MutationFunction<UpdateItemStatusMutation, UpdateItemStatusMutationVariables>;

/**
 * __useUpdateItemStatusMutation__
 *
 * To run a mutation, you first call `useUpdateItemStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateItemStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateItemStatusMutation, { data, loading, error }] = useUpdateItemStatusMutation({
 *   variables: {
 *      itemId: // value for 'itemId'
 *      active: // value for 'active'
 *   },
 * });
 */
export function useUpdateItemStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateItemStatusMutation, UpdateItemStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateItemStatusMutation, UpdateItemStatusMutationVariables>(UpdateItemStatusDocument, options);
      }
export type UpdateItemStatusMutationHookResult = ReturnType<typeof useUpdateItemStatusMutation>;
export type UpdateItemStatusMutationResult = Apollo.MutationResult<UpdateItemStatusMutation>;
export type UpdateItemStatusMutationOptions = Apollo.BaseMutationOptions<UpdateItemStatusMutation, UpdateItemStatusMutationVariables>;
export const ExportChecklistToPdfDocument = gql`
    query ExportChecklistToPdf($id: Long!) {
  exportChecklistToPdf(id: $id)
}
    `;

/**
 * __useExportChecklistToPdfQuery__
 *
 * To run a query within a React component, call `useExportChecklistToPdfQuery` and pass it any options that fit your needs.
 * When your component renders, `useExportChecklistToPdfQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExportChecklistToPdfQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useExportChecklistToPdfQuery(baseOptions: Apollo.QueryHookOptions<ExportChecklistToPdfQuery, ExportChecklistToPdfQueryVariables> & ({ variables: ExportChecklistToPdfQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ExportChecklistToPdfQuery, ExportChecklistToPdfQueryVariables>(ExportChecklistToPdfDocument, options);
      }
export function useExportChecklistToPdfLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExportChecklistToPdfQuery, ExportChecklistToPdfQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ExportChecklistToPdfQuery, ExportChecklistToPdfQueryVariables>(ExportChecklistToPdfDocument, options);
        }
export function useExportChecklistToPdfSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ExportChecklistToPdfQuery, ExportChecklistToPdfQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ExportChecklistToPdfQuery, ExportChecklistToPdfQueryVariables>(ExportChecklistToPdfDocument, options);
        }
export type ExportChecklistToPdfQueryHookResult = ReturnType<typeof useExportChecklistToPdfQuery>;
export type ExportChecklistToPdfLazyQueryHookResult = ReturnType<typeof useExportChecklistToPdfLazyQuery>;
export type ExportChecklistToPdfSuspenseQueryHookResult = ReturnType<typeof useExportChecklistToPdfSuspenseQuery>;
export type ExportChecklistToPdfQueryResult = Apollo.QueryResult<ExportChecklistToPdfQuery, ExportChecklistToPdfQueryVariables>;
export const ExportChecklistToExcelDocument = gql`
    query ExportChecklistToExcel($id: Long!) {
  exportChecklistToExcel(id: $id)
}
    `;

/**
 * __useExportChecklistToExcelQuery__
 *
 * To run a query within a React component, call `useExportChecklistToExcelQuery` and pass it any options that fit your needs.
 * When your component renders, `useExportChecklistToExcelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExportChecklistToExcelQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useExportChecklistToExcelQuery(baseOptions: Apollo.QueryHookOptions<ExportChecklistToExcelQuery, ExportChecklistToExcelQueryVariables> & ({ variables: ExportChecklistToExcelQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ExportChecklistToExcelQuery, ExportChecklistToExcelQueryVariables>(ExportChecklistToExcelDocument, options);
      }
export function useExportChecklistToExcelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExportChecklistToExcelQuery, ExportChecklistToExcelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ExportChecklistToExcelQuery, ExportChecklistToExcelQueryVariables>(ExportChecklistToExcelDocument, options);
        }
export function useExportChecklistToExcelSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ExportChecklistToExcelQuery, ExportChecklistToExcelQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ExportChecklistToExcelQuery, ExportChecklistToExcelQueryVariables>(ExportChecklistToExcelDocument, options);
        }
export type ExportChecklistToExcelQueryHookResult = ReturnType<typeof useExportChecklistToExcelQuery>;
export type ExportChecklistToExcelLazyQueryHookResult = ReturnType<typeof useExportChecklistToExcelLazyQuery>;
export type ExportChecklistToExcelSuspenseQueryHookResult = ReturnType<typeof useExportChecklistToExcelSuspenseQuery>;
export type ExportChecklistToExcelQueryResult = Apollo.QueryResult<ExportChecklistToExcelQuery, ExportChecklistToExcelQueryVariables>;
export const SendNotificationDocument = gql`
    mutation SendNotification($emailRequest: EmailRequest!) {
  sendNotification(emailRequest: $emailRequest)
}
    `;
export type SendNotificationMutationFn = Apollo.MutationFunction<SendNotificationMutation, SendNotificationMutationVariables>;

/**
 * __useSendNotificationMutation__
 *
 * To run a mutation, you first call `useSendNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendNotificationMutation, { data, loading, error }] = useSendNotificationMutation({
 *   variables: {
 *      emailRequest: // value for 'emailRequest'
 *   },
 * });
 */
export function useSendNotificationMutation(baseOptions?: Apollo.MutationHookOptions<SendNotificationMutation, SendNotificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendNotificationMutation, SendNotificationMutationVariables>(SendNotificationDocument, options);
      }
export type SendNotificationMutationHookResult = ReturnType<typeof useSendNotificationMutation>;
export type SendNotificationMutationResult = Apollo.MutationResult<SendNotificationMutation>;
export type SendNotificationMutationOptions = Apollo.BaseMutationOptions<SendNotificationMutation, SendNotificationMutationVariables>;
export const GetAllEvaluationsDocument = gql`
    query GetAllEvaluations($page: Int, $size: Int) {
  allEvaluations(page: $page, size: $size) {
    code
    message
    date
    currentPage
    totalPages
    totalItems
    data {
      id
      observations
      recommendations
      valueJudgment
      checklistId
    }
  }
}
    `;

/**
 * __useGetAllEvaluationsQuery__
 *
 * To run a query within a React component, call `useGetAllEvaluationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllEvaluationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllEvaluationsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetAllEvaluationsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllEvaluationsQuery, GetAllEvaluationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllEvaluationsQuery, GetAllEvaluationsQueryVariables>(GetAllEvaluationsDocument, options);
      }
export function useGetAllEvaluationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllEvaluationsQuery, GetAllEvaluationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllEvaluationsQuery, GetAllEvaluationsQueryVariables>(GetAllEvaluationsDocument, options);
        }
export function useGetAllEvaluationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllEvaluationsQuery, GetAllEvaluationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllEvaluationsQuery, GetAllEvaluationsQueryVariables>(GetAllEvaluationsDocument, options);
        }
export type GetAllEvaluationsQueryHookResult = ReturnType<typeof useGetAllEvaluationsQuery>;
export type GetAllEvaluationsLazyQueryHookResult = ReturnType<typeof useGetAllEvaluationsLazyQuery>;
export type GetAllEvaluationsSuspenseQueryHookResult = ReturnType<typeof useGetAllEvaluationsSuspenseQuery>;
export type GetAllEvaluationsQueryResult = Apollo.QueryResult<GetAllEvaluationsQuery, GetAllEvaluationsQueryVariables>;
export const GetEvaluationByIdDocument = gql`
    query GetEvaluationById($id: Long!) {
  evaluationById(id: $id) {
    code
    message
    date
    data {
      id
      observations
      recommendations
      valueJudgment
      checklistId
    }
  }
}
    `;

/**
 * __useGetEvaluationByIdQuery__
 *
 * To run a query within a React component, call `useGetEvaluationByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEvaluationByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEvaluationByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEvaluationByIdQuery(baseOptions: Apollo.QueryHookOptions<GetEvaluationByIdQuery, GetEvaluationByIdQueryVariables> & ({ variables: GetEvaluationByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEvaluationByIdQuery, GetEvaluationByIdQueryVariables>(GetEvaluationByIdDocument, options);
      }
export function useGetEvaluationByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEvaluationByIdQuery, GetEvaluationByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEvaluationByIdQuery, GetEvaluationByIdQueryVariables>(GetEvaluationByIdDocument, options);
        }
export function useGetEvaluationByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEvaluationByIdQuery, GetEvaluationByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEvaluationByIdQuery, GetEvaluationByIdQueryVariables>(GetEvaluationByIdDocument, options);
        }
export type GetEvaluationByIdQueryHookResult = ReturnType<typeof useGetEvaluationByIdQuery>;
export type GetEvaluationByIdLazyQueryHookResult = ReturnType<typeof useGetEvaluationByIdLazyQuery>;
export type GetEvaluationByIdSuspenseQueryHookResult = ReturnType<typeof useGetEvaluationByIdSuspenseQuery>;
export type GetEvaluationByIdQueryResult = Apollo.QueryResult<GetEvaluationByIdQuery, GetEvaluationByIdQueryVariables>;
export const AddEvaluationDocument = gql`
    mutation AddEvaluation($input: EvaluationDto!) {
  addEvaluation(input: $input) {
    code
    message
    id
  }
}
    `;
export type AddEvaluationMutationFn = Apollo.MutationFunction<AddEvaluationMutation, AddEvaluationMutationVariables>;

/**
 * __useAddEvaluationMutation__
 *
 * To run a mutation, you first call `useAddEvaluationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddEvaluationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addEvaluationMutation, { data, loading, error }] = useAddEvaluationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddEvaluationMutation(baseOptions?: Apollo.MutationHookOptions<AddEvaluationMutation, AddEvaluationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddEvaluationMutation, AddEvaluationMutationVariables>(AddEvaluationDocument, options);
      }
export type AddEvaluationMutationHookResult = ReturnType<typeof useAddEvaluationMutation>;
export type AddEvaluationMutationResult = Apollo.MutationResult<AddEvaluationMutation>;
export type AddEvaluationMutationOptions = Apollo.BaseMutationOptions<AddEvaluationMutation, AddEvaluationMutationVariables>;
export const UpdateEvaluationDocument = gql`
    mutation UpdateEvaluation($id: Long!, $input: EvaluationDto!) {
  updateEvaluation(id: $id, input: $input) {
    code
    message
    id
  }
}
    `;
export type UpdateEvaluationMutationFn = Apollo.MutationFunction<UpdateEvaluationMutation, UpdateEvaluationMutationVariables>;

/**
 * __useUpdateEvaluationMutation__
 *
 * To run a mutation, you first call `useUpdateEvaluationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEvaluationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEvaluationMutation, { data, loading, error }] = useUpdateEvaluationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEvaluationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEvaluationMutation, UpdateEvaluationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEvaluationMutation, UpdateEvaluationMutationVariables>(UpdateEvaluationDocument, options);
      }
export type UpdateEvaluationMutationHookResult = ReturnType<typeof useUpdateEvaluationMutation>;
export type UpdateEvaluationMutationResult = Apollo.MutationResult<UpdateEvaluationMutation>;
export type UpdateEvaluationMutationOptions = Apollo.BaseMutationOptions<UpdateEvaluationMutation, UpdateEvaluationMutationVariables>;
export const DeleteEvaluationDocument = gql`
    mutation DeleteEvaluation($id: Long!) {
  deleteEvaluation(id: $id) {
    code
    message
    id
  }
}
    `;
export type DeleteEvaluationMutationFn = Apollo.MutationFunction<DeleteEvaluationMutation, DeleteEvaluationMutationVariables>;

/**
 * __useDeleteEvaluationMutation__
 *
 * To run a mutation, you first call `useDeleteEvaluationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEvaluationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEvaluationMutation, { data, loading, error }] = useDeleteEvaluationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEvaluationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEvaluationMutation, DeleteEvaluationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEvaluationMutation, DeleteEvaluationMutationVariables>(DeleteEvaluationDocument, options);
      }
export type DeleteEvaluationMutationHookResult = ReturnType<typeof useDeleteEvaluationMutation>;
export type DeleteEvaluationMutationResult = Apollo.MutationResult<DeleteEvaluationMutation>;
export type DeleteEvaluationMutationOptions = Apollo.BaseMutationOptions<DeleteEvaluationMutation, DeleteEvaluationMutationVariables>;
export const GetEvaluationsByChecklistDocument = gql`
    query GetEvaluationsByChecklist($checklistId: Long!) {
  evaluationsByChecklist(checklistId: $checklistId) {
    code
    message
    date
    currentPage
    totalPages
    totalItems
    data {
      id
      observations
      recommendations
      valueJudgment
      checklistId
    }
  }
}
    `;

/**
 * __useGetEvaluationsByChecklistQuery__
 *
 * To run a query within a React component, call `useGetEvaluationsByChecklistQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEvaluationsByChecklistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEvaluationsByChecklistQuery({
 *   variables: {
 *      checklistId: // value for 'checklistId'
 *   },
 * });
 */
export function useGetEvaluationsByChecklistQuery(baseOptions: Apollo.QueryHookOptions<GetEvaluationsByChecklistQuery, GetEvaluationsByChecklistQueryVariables> & ({ variables: GetEvaluationsByChecklistQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEvaluationsByChecklistQuery, GetEvaluationsByChecklistQueryVariables>(GetEvaluationsByChecklistDocument, options);
      }
export function useGetEvaluationsByChecklistLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEvaluationsByChecklistQuery, GetEvaluationsByChecklistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEvaluationsByChecklistQuery, GetEvaluationsByChecklistQueryVariables>(GetEvaluationsByChecklistDocument, options);
        }
export function useGetEvaluationsByChecklistSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEvaluationsByChecklistQuery, GetEvaluationsByChecklistQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEvaluationsByChecklistQuery, GetEvaluationsByChecklistQueryVariables>(GetEvaluationsByChecklistDocument, options);
        }
export type GetEvaluationsByChecklistQueryHookResult = ReturnType<typeof useGetEvaluationsByChecklistQuery>;
export type GetEvaluationsByChecklistLazyQueryHookResult = ReturnType<typeof useGetEvaluationsByChecklistLazyQuery>;
export type GetEvaluationsByChecklistSuspenseQueryHookResult = ReturnType<typeof useGetEvaluationsByChecklistSuspenseQuery>;
export type GetEvaluationsByChecklistQueryResult = Apollo.QueryResult<GetEvaluationsByChecklistQuery, GetEvaluationsByChecklistQueryVariables>;
export const GenerateQrCodeDocument = gql`
    mutation GenerateQRCode {
  generateQRCode {
    sessionId
    qrCodeBase64
    qrUrl
  }
}
    `;
export type GenerateQrCodeMutationFn = Apollo.MutationFunction<GenerateQrCodeMutation, GenerateQrCodeMutationVariables>;

/**
 * __useGenerateQrCodeMutation__
 *
 * To run a mutation, you first call `useGenerateQrCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateQrCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateQrCodeMutation, { data, loading, error }] = useGenerateQrCodeMutation({
 *   variables: {
 *   },
 * });
 */
export function useGenerateQrCodeMutation(baseOptions?: Apollo.MutationHookOptions<GenerateQrCodeMutation, GenerateQrCodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateQrCodeMutation, GenerateQrCodeMutationVariables>(GenerateQrCodeDocument, options);
      }
export type GenerateQrCodeMutationHookResult = ReturnType<typeof useGenerateQrCodeMutation>;
export type GenerateQrCodeMutationResult = Apollo.MutationResult<GenerateQrCodeMutation>;
export type GenerateQrCodeMutationOptions = Apollo.BaseMutationOptions<GenerateQrCodeMutation, GenerateQrCodeMutationVariables>;
export const GetAllImprovementPlanFaultTypesDocument = gql`
    query GetAllImprovementPlanFaultTypes($page: Int, $size: Int) {
  allImprovementPlanFaultTypes(page: $page, size: $size) {
    code
    message
    data {
      id
      name
    }
    totalItems
    totalPages
    currentPage
  }
}
    `;

/**
 * __useGetAllImprovementPlanFaultTypesQuery__
 *
 * To run a query within a React component, call `useGetAllImprovementPlanFaultTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllImprovementPlanFaultTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllImprovementPlanFaultTypesQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetAllImprovementPlanFaultTypesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllImprovementPlanFaultTypesQuery, GetAllImprovementPlanFaultTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllImprovementPlanFaultTypesQuery, GetAllImprovementPlanFaultTypesQueryVariables>(GetAllImprovementPlanFaultTypesDocument, options);
      }
export function useGetAllImprovementPlanFaultTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllImprovementPlanFaultTypesQuery, GetAllImprovementPlanFaultTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllImprovementPlanFaultTypesQuery, GetAllImprovementPlanFaultTypesQueryVariables>(GetAllImprovementPlanFaultTypesDocument, options);
        }
export function useGetAllImprovementPlanFaultTypesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllImprovementPlanFaultTypesQuery, GetAllImprovementPlanFaultTypesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllImprovementPlanFaultTypesQuery, GetAllImprovementPlanFaultTypesQueryVariables>(GetAllImprovementPlanFaultTypesDocument, options);
        }
export type GetAllImprovementPlanFaultTypesQueryHookResult = ReturnType<typeof useGetAllImprovementPlanFaultTypesQuery>;
export type GetAllImprovementPlanFaultTypesLazyQueryHookResult = ReturnType<typeof useGetAllImprovementPlanFaultTypesLazyQuery>;
export type GetAllImprovementPlanFaultTypesSuspenseQueryHookResult = ReturnType<typeof useGetAllImprovementPlanFaultTypesSuspenseQuery>;
export type GetAllImprovementPlanFaultTypesQueryResult = Apollo.QueryResult<GetAllImprovementPlanFaultTypesQuery, GetAllImprovementPlanFaultTypesQueryVariables>;
export const GetImprovementPlanFaultTypeByIdDocument = gql`
    query GetImprovementPlanFaultTypeById($id: Long!) {
  improvementPlanFaultTypeById(id: $id) {
    code
    message
    data {
      id
      name
    }
  }
}
    `;

/**
 * __useGetImprovementPlanFaultTypeByIdQuery__
 *
 * To run a query within a React component, call `useGetImprovementPlanFaultTypeByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetImprovementPlanFaultTypeByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetImprovementPlanFaultTypeByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetImprovementPlanFaultTypeByIdQuery(baseOptions: Apollo.QueryHookOptions<GetImprovementPlanFaultTypeByIdQuery, GetImprovementPlanFaultTypeByIdQueryVariables> & ({ variables: GetImprovementPlanFaultTypeByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetImprovementPlanFaultTypeByIdQuery, GetImprovementPlanFaultTypeByIdQueryVariables>(GetImprovementPlanFaultTypeByIdDocument, options);
      }
export function useGetImprovementPlanFaultTypeByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetImprovementPlanFaultTypeByIdQuery, GetImprovementPlanFaultTypeByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetImprovementPlanFaultTypeByIdQuery, GetImprovementPlanFaultTypeByIdQueryVariables>(GetImprovementPlanFaultTypeByIdDocument, options);
        }
export function useGetImprovementPlanFaultTypeByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetImprovementPlanFaultTypeByIdQuery, GetImprovementPlanFaultTypeByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetImprovementPlanFaultTypeByIdQuery, GetImprovementPlanFaultTypeByIdQueryVariables>(GetImprovementPlanFaultTypeByIdDocument, options);
        }
export type GetImprovementPlanFaultTypeByIdQueryHookResult = ReturnType<typeof useGetImprovementPlanFaultTypeByIdQuery>;
export type GetImprovementPlanFaultTypeByIdLazyQueryHookResult = ReturnType<typeof useGetImprovementPlanFaultTypeByIdLazyQuery>;
export type GetImprovementPlanFaultTypeByIdSuspenseQueryHookResult = ReturnType<typeof useGetImprovementPlanFaultTypeByIdSuspenseQuery>;
export type GetImprovementPlanFaultTypeByIdQueryResult = Apollo.QueryResult<GetImprovementPlanFaultTypeByIdQuery, GetImprovementPlanFaultTypeByIdQueryVariables>;
export const GetAllImprovementPlansDocument = gql`
    query GetAllImprovementPlans($page: Int, $size: Int, $teacherCompetence: Long) {
  allImprovementPlans(
    page: $page
    size: $size
    teacherCompetence: $teacherCompetence
  ) {
    code
    message
    date
    totalPages
    totalItems
    currentPage
    data {
      id
      city
      date
      reason
      state
      qualification
      student {
        id
        person {
          name
          lastname
          document
        }
      }
      teacherCompetence {
        id
        competence {
          id
          name
        }
      }
      faultType {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetAllImprovementPlansQuery__
 *
 * To run a query within a React component, call `useGetAllImprovementPlansQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllImprovementPlansQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllImprovementPlansQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *      teacherCompetence: // value for 'teacherCompetence'
 *   },
 * });
 */
export function useGetAllImprovementPlansQuery(baseOptions?: Apollo.QueryHookOptions<GetAllImprovementPlansQuery, GetAllImprovementPlansQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllImprovementPlansQuery, GetAllImprovementPlansQueryVariables>(GetAllImprovementPlansDocument, options);
      }
export function useGetAllImprovementPlansLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllImprovementPlansQuery, GetAllImprovementPlansQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllImprovementPlansQuery, GetAllImprovementPlansQueryVariables>(GetAllImprovementPlansDocument, options);
        }
export function useGetAllImprovementPlansSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllImprovementPlansQuery, GetAllImprovementPlansQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllImprovementPlansQuery, GetAllImprovementPlansQueryVariables>(GetAllImprovementPlansDocument, options);
        }
export type GetAllImprovementPlansQueryHookResult = ReturnType<typeof useGetAllImprovementPlansQuery>;
export type GetAllImprovementPlansLazyQueryHookResult = ReturnType<typeof useGetAllImprovementPlansLazyQuery>;
export type GetAllImprovementPlansSuspenseQueryHookResult = ReturnType<typeof useGetAllImprovementPlansSuspenseQuery>;
export type GetAllImprovementPlansQueryResult = Apollo.QueryResult<GetAllImprovementPlansQuery, GetAllImprovementPlansQueryVariables>;
export const GetImprovementPlanByIdDocument = gql`
    query GetImprovementPlanById($id: Long!) {
  improvementPlanById(id: $id) {
    code
    message
    date
    data {
      id
      city
      date
      reason
      state
      qualification
      student {
        id
        person {
          name
          lastname
          document
        }
      }
      teacherCompetence {
        id
        competence {
          id
          name
        }
      }
      faultType {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetImprovementPlanByIdQuery__
 *
 * To run a query within a React component, call `useGetImprovementPlanByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetImprovementPlanByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetImprovementPlanByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetImprovementPlanByIdQuery(baseOptions: Apollo.QueryHookOptions<GetImprovementPlanByIdQuery, GetImprovementPlanByIdQueryVariables> & ({ variables: GetImprovementPlanByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetImprovementPlanByIdQuery, GetImprovementPlanByIdQueryVariables>(GetImprovementPlanByIdDocument, options);
      }
export function useGetImprovementPlanByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetImprovementPlanByIdQuery, GetImprovementPlanByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetImprovementPlanByIdQuery, GetImprovementPlanByIdQueryVariables>(GetImprovementPlanByIdDocument, options);
        }
export function useGetImprovementPlanByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetImprovementPlanByIdQuery, GetImprovementPlanByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetImprovementPlanByIdQuery, GetImprovementPlanByIdQueryVariables>(GetImprovementPlanByIdDocument, options);
        }
export type GetImprovementPlanByIdQueryHookResult = ReturnType<typeof useGetImprovementPlanByIdQuery>;
export type GetImprovementPlanByIdLazyQueryHookResult = ReturnType<typeof useGetImprovementPlanByIdLazyQuery>;
export type GetImprovementPlanByIdSuspenseQueryHookResult = ReturnType<typeof useGetImprovementPlanByIdSuspenseQuery>;
export type GetImprovementPlanByIdQueryResult = Apollo.QueryResult<GetImprovementPlanByIdQuery, GetImprovementPlanByIdQueryVariables>;
export const AddImprovementPlanDocument = gql`
    mutation AddImprovementPlan($input: ImprovementPlanDto!) {
  addImprovementPlan(input: $input) {
    code
    message
  }
}
    `;
export type AddImprovementPlanMutationFn = Apollo.MutationFunction<AddImprovementPlanMutation, AddImprovementPlanMutationVariables>;

/**
 * __useAddImprovementPlanMutation__
 *
 * To run a mutation, you first call `useAddImprovementPlanMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddImprovementPlanMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addImprovementPlanMutation, { data, loading, error }] = useAddImprovementPlanMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddImprovementPlanMutation(baseOptions?: Apollo.MutationHookOptions<AddImprovementPlanMutation, AddImprovementPlanMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddImprovementPlanMutation, AddImprovementPlanMutationVariables>(AddImprovementPlanDocument, options);
      }
export type AddImprovementPlanMutationHookResult = ReturnType<typeof useAddImprovementPlanMutation>;
export type AddImprovementPlanMutationResult = Apollo.MutationResult<AddImprovementPlanMutation>;
export type AddImprovementPlanMutationOptions = Apollo.BaseMutationOptions<AddImprovementPlanMutation, AddImprovementPlanMutationVariables>;
export const UpdateImprovementPlanDocument = gql`
    mutation UpdateImprovementPlan($id: Long!, $input: ImprovementPlanDto!) {
  updateImprovementPlan(id: $id, input: $input) {
    code
    message
  }
}
    `;
export type UpdateImprovementPlanMutationFn = Apollo.MutationFunction<UpdateImprovementPlanMutation, UpdateImprovementPlanMutationVariables>;

/**
 * __useUpdateImprovementPlanMutation__
 *
 * To run a mutation, you first call `useUpdateImprovementPlanMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateImprovementPlanMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateImprovementPlanMutation, { data, loading, error }] = useUpdateImprovementPlanMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateImprovementPlanMutation(baseOptions?: Apollo.MutationHookOptions<UpdateImprovementPlanMutation, UpdateImprovementPlanMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateImprovementPlanMutation, UpdateImprovementPlanMutationVariables>(UpdateImprovementPlanDocument, options);
      }
export type UpdateImprovementPlanMutationHookResult = ReturnType<typeof useUpdateImprovementPlanMutation>;
export type UpdateImprovementPlanMutationResult = Apollo.MutationResult<UpdateImprovementPlanMutation>;
export type UpdateImprovementPlanMutationOptions = Apollo.BaseMutationOptions<UpdateImprovementPlanMutation, UpdateImprovementPlanMutationVariables>;
export const DeleteImprovementPlanDocument = gql`
    mutation DeleteImprovementPlan($id: Long!) {
  deleteImprovementPlan(id: $id) {
    code
    message
  }
}
    `;
export type DeleteImprovementPlanMutationFn = Apollo.MutationFunction<DeleteImprovementPlanMutation, DeleteImprovementPlanMutationVariables>;

/**
 * __useDeleteImprovementPlanMutation__
 *
 * To run a mutation, you first call `useDeleteImprovementPlanMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteImprovementPlanMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteImprovementPlanMutation, { data, loading, error }] = useDeleteImprovementPlanMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteImprovementPlanMutation(baseOptions?: Apollo.MutationHookOptions<DeleteImprovementPlanMutation, DeleteImprovementPlanMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteImprovementPlanMutation, DeleteImprovementPlanMutationVariables>(DeleteImprovementPlanDocument, options);
      }
export type DeleteImprovementPlanMutationHookResult = ReturnType<typeof useDeleteImprovementPlanMutation>;
export type DeleteImprovementPlanMutationResult = Apollo.MutationResult<DeleteImprovementPlanMutation>;
export type DeleteImprovementPlanMutationOptions = Apollo.BaseMutationOptions<DeleteImprovementPlanMutation, DeleteImprovementPlanMutationVariables>;
export const GetAllJustificationStatusDocument = gql`
    query GetAllJustificationStatus($page: Int, $size: Int) {
  allJustificationsStatus(page: $page, size: $size) {
    date
    code
    message
    data {
      id
      name
      state
    }
    totalPages
    totalItems
    currentPage
  }
}
    `;

/**
 * __useGetAllJustificationStatusQuery__
 *
 * To run a query within a React component, call `useGetAllJustificationStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllJustificationStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllJustificationStatusQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetAllJustificationStatusQuery(baseOptions?: Apollo.QueryHookOptions<GetAllJustificationStatusQuery, GetAllJustificationStatusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllJustificationStatusQuery, GetAllJustificationStatusQueryVariables>(GetAllJustificationStatusDocument, options);
      }
export function useGetAllJustificationStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllJustificationStatusQuery, GetAllJustificationStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllJustificationStatusQuery, GetAllJustificationStatusQueryVariables>(GetAllJustificationStatusDocument, options);
        }
export function useGetAllJustificationStatusSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllJustificationStatusQuery, GetAllJustificationStatusQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllJustificationStatusQuery, GetAllJustificationStatusQueryVariables>(GetAllJustificationStatusDocument, options);
        }
export type GetAllJustificationStatusQueryHookResult = ReturnType<typeof useGetAllJustificationStatusQuery>;
export type GetAllJustificationStatusLazyQueryHookResult = ReturnType<typeof useGetAllJustificationStatusLazyQuery>;
export type GetAllJustificationStatusSuspenseQueryHookResult = ReturnType<typeof useGetAllJustificationStatusSuspenseQuery>;
export type GetAllJustificationStatusQueryResult = Apollo.QueryResult<GetAllJustificationStatusQuery, GetAllJustificationStatusQueryVariables>;
export const GetJustificationStatusByIdDocument = gql`
    query GetJustificationStatusById($id: Long!) {
  justificationStatusById(id: $id) {
    date
    code
    message
    data {
      id
      name
      state
    }
  }
}
    `;

/**
 * __useGetJustificationStatusByIdQuery__
 *
 * To run a query within a React component, call `useGetJustificationStatusByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetJustificationStatusByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetJustificationStatusByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetJustificationStatusByIdQuery(baseOptions: Apollo.QueryHookOptions<GetJustificationStatusByIdQuery, GetJustificationStatusByIdQueryVariables> & ({ variables: GetJustificationStatusByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetJustificationStatusByIdQuery, GetJustificationStatusByIdQueryVariables>(GetJustificationStatusByIdDocument, options);
      }
export function useGetJustificationStatusByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetJustificationStatusByIdQuery, GetJustificationStatusByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetJustificationStatusByIdQuery, GetJustificationStatusByIdQueryVariables>(GetJustificationStatusByIdDocument, options);
        }
export function useGetJustificationStatusByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetJustificationStatusByIdQuery, GetJustificationStatusByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetJustificationStatusByIdQuery, GetJustificationStatusByIdQueryVariables>(GetJustificationStatusByIdDocument, options);
        }
export type GetJustificationStatusByIdQueryHookResult = ReturnType<typeof useGetJustificationStatusByIdQuery>;
export type GetJustificationStatusByIdLazyQueryHookResult = ReturnType<typeof useGetJustificationStatusByIdLazyQuery>;
export type GetJustificationStatusByIdSuspenseQueryHookResult = ReturnType<typeof useGetJustificationStatusByIdSuspenseQuery>;
export type GetJustificationStatusByIdQueryResult = Apollo.QueryResult<GetJustificationStatusByIdQuery, GetJustificationStatusByIdQueryVariables>;
export const AddJustificationStatusDocument = gql`
    mutation AddJustificationStatus($input: JustificationStatusDto!) {
  addJustificationStatus(input: $input) {
    id
    code
    message
  }
}
    `;
export type AddJustificationStatusMutationFn = Apollo.MutationFunction<AddJustificationStatusMutation, AddJustificationStatusMutationVariables>;

/**
 * __useAddJustificationStatusMutation__
 *
 * To run a mutation, you first call `useAddJustificationStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddJustificationStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addJustificationStatusMutation, { data, loading, error }] = useAddJustificationStatusMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddJustificationStatusMutation(baseOptions?: Apollo.MutationHookOptions<AddJustificationStatusMutation, AddJustificationStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddJustificationStatusMutation, AddJustificationStatusMutationVariables>(AddJustificationStatusDocument, options);
      }
export type AddJustificationStatusMutationHookResult = ReturnType<typeof useAddJustificationStatusMutation>;
export type AddJustificationStatusMutationResult = Apollo.MutationResult<AddJustificationStatusMutation>;
export type AddJustificationStatusMutationOptions = Apollo.BaseMutationOptions<AddJustificationStatusMutation, AddJustificationStatusMutationVariables>;
export const UpdateJustificationStatusDocument = gql`
    mutation UpdateJustificationStatus($id: Long!, $input: JustificationStatusDto!) {
  updateJustificationStatus(id: $id, input: $input) {
    id
    code
    message
  }
}
    `;
export type UpdateJustificationStatusMutationFn = Apollo.MutationFunction<UpdateJustificationStatusMutation, UpdateJustificationStatusMutationVariables>;

/**
 * __useUpdateJustificationStatusMutation__
 *
 * To run a mutation, you first call `useUpdateJustificationStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateJustificationStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateJustificationStatusMutation, { data, loading, error }] = useUpdateJustificationStatusMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateJustificationStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateJustificationStatusMutation, UpdateJustificationStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateJustificationStatusMutation, UpdateJustificationStatusMutationVariables>(UpdateJustificationStatusDocument, options);
      }
export type UpdateJustificationStatusMutationHookResult = ReturnType<typeof useUpdateJustificationStatusMutation>;
export type UpdateJustificationStatusMutationResult = Apollo.MutationResult<UpdateJustificationStatusMutation>;
export type UpdateJustificationStatusMutationOptions = Apollo.BaseMutationOptions<UpdateJustificationStatusMutation, UpdateJustificationStatusMutationVariables>;
export const DeleteJustificationStatusDocument = gql`
    mutation DeleteJustificationStatus($id: Long!) {
  deleteJustificationStatus(id: $id) {
    id
    code
    message
  }
}
    `;
export type DeleteJustificationStatusMutationFn = Apollo.MutationFunction<DeleteJustificationStatusMutation, DeleteJustificationStatusMutationVariables>;

/**
 * __useDeleteJustificationStatusMutation__
 *
 * To run a mutation, you first call `useDeleteJustificationStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteJustificationStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteJustificationStatusMutation, { data, loading, error }] = useDeleteJustificationStatusMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteJustificationStatusMutation(baseOptions?: Apollo.MutationHookOptions<DeleteJustificationStatusMutation, DeleteJustificationStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteJustificationStatusMutation, DeleteJustificationStatusMutationVariables>(DeleteJustificationStatusDocument, options);
      }
export type DeleteJustificationStatusMutationHookResult = ReturnType<typeof useDeleteJustificationStatusMutation>;
export type DeleteJustificationStatusMutationResult = Apollo.MutationResult<DeleteJustificationStatusMutation>;
export type DeleteJustificationStatusMutationOptions = Apollo.BaseMutationOptions<DeleteJustificationStatusMutation, DeleteJustificationStatusMutationVariables>;
export const GetAllJustificationTypesDocument = gql`
    query GetAllJustificationTypes($page: Int, $size: Int) {
  allJustificationTypes(page: $page, size: $size) {
    code
    data {
      id
      name
      description
    }
    date
    totalPages
    totalItems
    currentPage
    message
  }
}
    `;

/**
 * __useGetAllJustificationTypesQuery__
 *
 * To run a query within a React component, call `useGetAllJustificationTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllJustificationTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllJustificationTypesQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetAllJustificationTypesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllJustificationTypesQuery, GetAllJustificationTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllJustificationTypesQuery, GetAllJustificationTypesQueryVariables>(GetAllJustificationTypesDocument, options);
      }
export function useGetAllJustificationTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllJustificationTypesQuery, GetAllJustificationTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllJustificationTypesQuery, GetAllJustificationTypesQueryVariables>(GetAllJustificationTypesDocument, options);
        }
export function useGetAllJustificationTypesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllJustificationTypesQuery, GetAllJustificationTypesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllJustificationTypesQuery, GetAllJustificationTypesQueryVariables>(GetAllJustificationTypesDocument, options);
        }
export type GetAllJustificationTypesQueryHookResult = ReturnType<typeof useGetAllJustificationTypesQuery>;
export type GetAllJustificationTypesLazyQueryHookResult = ReturnType<typeof useGetAllJustificationTypesLazyQuery>;
export type GetAllJustificationTypesSuspenseQueryHookResult = ReturnType<typeof useGetAllJustificationTypesSuspenseQuery>;
export type GetAllJustificationTypesQueryResult = Apollo.QueryResult<GetAllJustificationTypesQuery, GetAllJustificationTypesQueryVariables>;
export const GetJustificationTypeByIdDocument = gql`
    query GetJustificationTypeById($id: Long!) {
  justificationTypeById(id: $id) {
    code
    data {
      id
      name
      description
    }
    date
    message
  }
}
    `;

/**
 * __useGetJustificationTypeByIdQuery__
 *
 * To run a query within a React component, call `useGetJustificationTypeByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetJustificationTypeByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetJustificationTypeByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetJustificationTypeByIdQuery(baseOptions: Apollo.QueryHookOptions<GetJustificationTypeByIdQuery, GetJustificationTypeByIdQueryVariables> & ({ variables: GetJustificationTypeByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetJustificationTypeByIdQuery, GetJustificationTypeByIdQueryVariables>(GetJustificationTypeByIdDocument, options);
      }
export function useGetJustificationTypeByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetJustificationTypeByIdQuery, GetJustificationTypeByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetJustificationTypeByIdQuery, GetJustificationTypeByIdQueryVariables>(GetJustificationTypeByIdDocument, options);
        }
export function useGetJustificationTypeByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetJustificationTypeByIdQuery, GetJustificationTypeByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetJustificationTypeByIdQuery, GetJustificationTypeByIdQueryVariables>(GetJustificationTypeByIdDocument, options);
        }
export type GetJustificationTypeByIdQueryHookResult = ReturnType<typeof useGetJustificationTypeByIdQuery>;
export type GetJustificationTypeByIdLazyQueryHookResult = ReturnType<typeof useGetJustificationTypeByIdLazyQuery>;
export type GetJustificationTypeByIdSuspenseQueryHookResult = ReturnType<typeof useGetJustificationTypeByIdSuspenseQuery>;
export type GetJustificationTypeByIdQueryResult = Apollo.QueryResult<GetJustificationTypeByIdQuery, GetJustificationTypeByIdQueryVariables>;
export const AddJustificationTypeDocument = gql`
    mutation AddJustificationType($input: JustificationTypeDto!) {
  addJustificationType(input: $input) {
    code
    message
  }
}
    `;
export type AddJustificationTypeMutationFn = Apollo.MutationFunction<AddJustificationTypeMutation, AddJustificationTypeMutationVariables>;

/**
 * __useAddJustificationTypeMutation__
 *
 * To run a mutation, you first call `useAddJustificationTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddJustificationTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addJustificationTypeMutation, { data, loading, error }] = useAddJustificationTypeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddJustificationTypeMutation(baseOptions?: Apollo.MutationHookOptions<AddJustificationTypeMutation, AddJustificationTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddJustificationTypeMutation, AddJustificationTypeMutationVariables>(AddJustificationTypeDocument, options);
      }
export type AddJustificationTypeMutationHookResult = ReturnType<typeof useAddJustificationTypeMutation>;
export type AddJustificationTypeMutationResult = Apollo.MutationResult<AddJustificationTypeMutation>;
export type AddJustificationTypeMutationOptions = Apollo.BaseMutationOptions<AddJustificationTypeMutation, AddJustificationTypeMutationVariables>;
export const UpdateJustificationTypeDocument = gql`
    mutation UpdateJustificationType($id: Long!, $input: JustificationTypeDto!) {
  updateJustificationType(id: $id, input: $input) {
    code
    message
  }
}
    `;
export type UpdateJustificationTypeMutationFn = Apollo.MutationFunction<UpdateJustificationTypeMutation, UpdateJustificationTypeMutationVariables>;

/**
 * __useUpdateJustificationTypeMutation__
 *
 * To run a mutation, you first call `useUpdateJustificationTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateJustificationTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateJustificationTypeMutation, { data, loading, error }] = useUpdateJustificationTypeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateJustificationTypeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateJustificationTypeMutation, UpdateJustificationTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateJustificationTypeMutation, UpdateJustificationTypeMutationVariables>(UpdateJustificationTypeDocument, options);
      }
export type UpdateJustificationTypeMutationHookResult = ReturnType<typeof useUpdateJustificationTypeMutation>;
export type UpdateJustificationTypeMutationResult = Apollo.MutationResult<UpdateJustificationTypeMutation>;
export type UpdateJustificationTypeMutationOptions = Apollo.BaseMutationOptions<UpdateJustificationTypeMutation, UpdateJustificationTypeMutationVariables>;
export const DeleteJustificationTypeDocument = gql`
    mutation DeleteJustificationType($id: Long!) {
  deleteJustificationType(id: $id) {
    code
    message
  }
}
    `;
export type DeleteJustificationTypeMutationFn = Apollo.MutationFunction<DeleteJustificationTypeMutation, DeleteJustificationTypeMutationVariables>;

/**
 * __useDeleteJustificationTypeMutation__
 *
 * To run a mutation, you first call `useDeleteJustificationTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteJustificationTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteJustificationTypeMutation, { data, loading, error }] = useDeleteJustificationTypeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteJustificationTypeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteJustificationTypeMutation, DeleteJustificationTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteJustificationTypeMutation, DeleteJustificationTypeMutationVariables>(DeleteJustificationTypeDocument, options);
      }
export type DeleteJustificationTypeMutationHookResult = ReturnType<typeof useDeleteJustificationTypeMutation>;
export type DeleteJustificationTypeMutationResult = Apollo.MutationResult<DeleteJustificationTypeMutation>;
export type DeleteJustificationTypeMutationOptions = Apollo.BaseMutationOptions<DeleteJustificationTypeMutation, DeleteJustificationTypeMutationVariables>;
export const GetAllJustificationsDocument = gql`
    query GetAllJustifications($page: Int, $size: Int) {
  allJustifications(page: $page, size: $size) {
    code
    message
    date
    totalPages
    totalItems
    currentPage
    data {
      id
      description
      justificationFile
      absenceDate
      justificationDate
      state
      justificationType {
        id
        name
      }
      justificationStatus {
        id
        name
        state
      }
      attendance {
        student {
          id
          person {
            name
            lastname
            document
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetAllJustificationsQuery__
 *
 * To run a query within a React component, call `useGetAllJustificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllJustificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllJustificationsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetAllJustificationsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllJustificationsQuery, GetAllJustificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllJustificationsQuery, GetAllJustificationsQueryVariables>(GetAllJustificationsDocument, options);
      }
export function useGetAllJustificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllJustificationsQuery, GetAllJustificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllJustificationsQuery, GetAllJustificationsQueryVariables>(GetAllJustificationsDocument, options);
        }
export function useGetAllJustificationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllJustificationsQuery, GetAllJustificationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllJustificationsQuery, GetAllJustificationsQueryVariables>(GetAllJustificationsDocument, options);
        }
export type GetAllJustificationsQueryHookResult = ReturnType<typeof useGetAllJustificationsQuery>;
export type GetAllJustificationsLazyQueryHookResult = ReturnType<typeof useGetAllJustificationsLazyQuery>;
export type GetAllJustificationsSuspenseQueryHookResult = ReturnType<typeof useGetAllJustificationsSuspenseQuery>;
export type GetAllJustificationsQueryResult = Apollo.QueryResult<GetAllJustificationsQuery, GetAllJustificationsQueryVariables>;
export const GetJustificationByIdDocument = gql`
    query GetJustificationById($id: Long!) {
  justificationById(id: $id) {
    code
    message
    data {
      id
      description
      justificationFile
      absenceDate
      justificationDate
      state
      justificationType {
        id
        name
      }
      justificationStatus {
        id
        name
        state
      }
      attendance {
        id
      }
    }
  }
}
    `;

/**
 * __useGetJustificationByIdQuery__
 *
 * To run a query within a React component, call `useGetJustificationByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetJustificationByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetJustificationByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetJustificationByIdQuery(baseOptions: Apollo.QueryHookOptions<GetJustificationByIdQuery, GetJustificationByIdQueryVariables> & ({ variables: GetJustificationByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetJustificationByIdQuery, GetJustificationByIdQueryVariables>(GetJustificationByIdDocument, options);
      }
export function useGetJustificationByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetJustificationByIdQuery, GetJustificationByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetJustificationByIdQuery, GetJustificationByIdQueryVariables>(GetJustificationByIdDocument, options);
        }
export function useGetJustificationByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetJustificationByIdQuery, GetJustificationByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetJustificationByIdQuery, GetJustificationByIdQueryVariables>(GetJustificationByIdDocument, options);
        }
export type GetJustificationByIdQueryHookResult = ReturnType<typeof useGetJustificationByIdQuery>;
export type GetJustificationByIdLazyQueryHookResult = ReturnType<typeof useGetJustificationByIdLazyQuery>;
export type GetJustificationByIdSuspenseQueryHookResult = ReturnType<typeof useGetJustificationByIdSuspenseQuery>;
export type GetJustificationByIdQueryResult = Apollo.QueryResult<GetJustificationByIdQuery, GetJustificationByIdQueryVariables>;
export const GetJustificationByStudentIdDocument = gql`
    query GetJustificationByStudentId($studentId: Long!, $page: Int, $size: Int) {
  justificationByStudentId(studentId: $studentId, page: $page, size: $size) {
    code
    message
    data {
      id
      description
      justificationFile
      absenceDate
      justificationDate
      state
      justificationType {
        id
        name
      }
      justificationStatus {
        id
        name
        state
      }
      attendance {
        student {
          id
          person {
            name
            lastname
            document
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetJustificationByStudentIdQuery__
 *
 * To run a query within a React component, call `useGetJustificationByStudentIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetJustificationByStudentIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetJustificationByStudentIdQuery({
 *   variables: {
 *      studentId: // value for 'studentId'
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetJustificationByStudentIdQuery(baseOptions: Apollo.QueryHookOptions<GetJustificationByStudentIdQuery, GetJustificationByStudentIdQueryVariables> & ({ variables: GetJustificationByStudentIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetJustificationByStudentIdQuery, GetJustificationByStudentIdQueryVariables>(GetJustificationByStudentIdDocument, options);
      }
export function useGetJustificationByStudentIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetJustificationByStudentIdQuery, GetJustificationByStudentIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetJustificationByStudentIdQuery, GetJustificationByStudentIdQueryVariables>(GetJustificationByStudentIdDocument, options);
        }
export function useGetJustificationByStudentIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetJustificationByStudentIdQuery, GetJustificationByStudentIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetJustificationByStudentIdQuery, GetJustificationByStudentIdQueryVariables>(GetJustificationByStudentIdDocument, options);
        }
export type GetJustificationByStudentIdQueryHookResult = ReturnType<typeof useGetJustificationByStudentIdQuery>;
export type GetJustificationByStudentIdLazyQueryHookResult = ReturnType<typeof useGetJustificationByStudentIdLazyQuery>;
export type GetJustificationByStudentIdSuspenseQueryHookResult = ReturnType<typeof useGetJustificationByStudentIdSuspenseQuery>;
export type GetJustificationByStudentIdQueryResult = Apollo.QueryResult<GetJustificationByStudentIdQuery, GetJustificationByStudentIdQueryVariables>;
export const AddJustificationDocument = gql`
    mutation AddJustification($input: JustificationDto!) {
  addJustification(input: $input) {
    code
    message
  }
}
    `;
export type AddJustificationMutationFn = Apollo.MutationFunction<AddJustificationMutation, AddJustificationMutationVariables>;

/**
 * __useAddJustificationMutation__
 *
 * To run a mutation, you first call `useAddJustificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddJustificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addJustificationMutation, { data, loading, error }] = useAddJustificationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddJustificationMutation(baseOptions?: Apollo.MutationHookOptions<AddJustificationMutation, AddJustificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddJustificationMutation, AddJustificationMutationVariables>(AddJustificationDocument, options);
      }
export type AddJustificationMutationHookResult = ReturnType<typeof useAddJustificationMutation>;
export type AddJustificationMutationResult = Apollo.MutationResult<AddJustificationMutation>;
export type AddJustificationMutationOptions = Apollo.BaseMutationOptions<AddJustificationMutation, AddJustificationMutationVariables>;
export const UpdateStatusInJustificationDocument = gql`
    mutation UpdateStatusInJustification($id: Long!, $input: Long!) {
  updateStatusInJustification(id: $id, input: $input) {
    code
    message
  }
}
    `;
export type UpdateStatusInJustificationMutationFn = Apollo.MutationFunction<UpdateStatusInJustificationMutation, UpdateStatusInJustificationMutationVariables>;

/**
 * __useUpdateStatusInJustificationMutation__
 *
 * To run a mutation, you first call `useUpdateStatusInJustificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStatusInJustificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStatusInJustificationMutation, { data, loading, error }] = useUpdateStatusInJustificationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateStatusInJustificationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStatusInJustificationMutation, UpdateStatusInJustificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStatusInJustificationMutation, UpdateStatusInJustificationMutationVariables>(UpdateStatusInJustificationDocument, options);
      }
export type UpdateStatusInJustificationMutationHookResult = ReturnType<typeof useUpdateStatusInJustificationMutation>;
export type UpdateStatusInJustificationMutationResult = Apollo.MutationResult<UpdateStatusInJustificationMutation>;
export type UpdateStatusInJustificationMutationOptions = Apollo.BaseMutationOptions<UpdateStatusInJustificationMutation, UpdateStatusInJustificationMutationVariables>;
export const UpdateJustificationDocument = gql`
    mutation UpdateJustification($id: Long!, $input: JustificationDto!) {
  updateJustification(id: $id, input: $input) {
    code
    message
  }
}
    `;
export type UpdateJustificationMutationFn = Apollo.MutationFunction<UpdateJustificationMutation, UpdateJustificationMutationVariables>;

/**
 * __useUpdateJustificationMutation__
 *
 * To run a mutation, you first call `useUpdateJustificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateJustificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateJustificationMutation, { data, loading, error }] = useUpdateJustificationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateJustificationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateJustificationMutation, UpdateJustificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateJustificationMutation, UpdateJustificationMutationVariables>(UpdateJustificationDocument, options);
      }
export type UpdateJustificationMutationHookResult = ReturnType<typeof useUpdateJustificationMutation>;
export type UpdateJustificationMutationResult = Apollo.MutationResult<UpdateJustificationMutation>;
export type UpdateJustificationMutationOptions = Apollo.BaseMutationOptions<UpdateJustificationMutation, UpdateJustificationMutationVariables>;
export const DeleteJustificationDocument = gql`
    mutation DeleteJustification($id: Long!) {
  deleteJustification(id: $id) {
    code
    message
  }
}
    `;
export type DeleteJustificationMutationFn = Apollo.MutationFunction<DeleteJustificationMutation, DeleteJustificationMutationVariables>;

/**
 * __useDeleteJustificationMutation__
 *
 * To run a mutation, you first call `useDeleteJustificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteJustificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteJustificationMutation, { data, loading, error }] = useDeleteJustificationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteJustificationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteJustificationMutation, DeleteJustificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteJustificationMutation, DeleteJustificationMutationVariables>(DeleteJustificationDocument, options);
      }
export type DeleteJustificationMutationHookResult = ReturnType<typeof useDeleteJustificationMutation>;
export type DeleteJustificationMutationResult = Apollo.MutationResult<DeleteJustificationMutation>;
export type DeleteJustificationMutationOptions = Apollo.BaseMutationOptions<DeleteJustificationMutation, DeleteJustificationMutationVariables>;
export const GetCoordinationByCollaboratorDocument = gql`
    query GetCoordinationByCollaborator($collaboratorId: Long!, $page: Int, $size: Int, $state: Boolean) {
  allCoordination(
    collaboratorId: $collaboratorId
    page: $page
    size: $size
    state: $state
  ) {
    data {
      id
      name
      state
      teachers {
        id
        state
        collaborator {
          person {
            name
            lastname
            document
          }
        }
      }
      trainingCenter {
        id
        name
      }
    }
    totalItems
    totalPages
    currentPage
  }
}
    `;

/**
 * __useGetCoordinationByCollaboratorQuery__
 *
 * To run a query within a React component, call `useGetCoordinationByCollaboratorQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCoordinationByCollaboratorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCoordinationByCollaboratorQuery({
 *   variables: {
 *      collaboratorId: // value for 'collaboratorId'
 *      page: // value for 'page'
 *      size: // value for 'size'
 *      state: // value for 'state'
 *   },
 * });
 */
export function useGetCoordinationByCollaboratorQuery(baseOptions: Apollo.QueryHookOptions<GetCoordinationByCollaboratorQuery, GetCoordinationByCollaboratorQueryVariables> & ({ variables: GetCoordinationByCollaboratorQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCoordinationByCollaboratorQuery, GetCoordinationByCollaboratorQueryVariables>(GetCoordinationByCollaboratorDocument, options);
      }
export function useGetCoordinationByCollaboratorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCoordinationByCollaboratorQuery, GetCoordinationByCollaboratorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCoordinationByCollaboratorQuery, GetCoordinationByCollaboratorQueryVariables>(GetCoordinationByCollaboratorDocument, options);
        }
export function useGetCoordinationByCollaboratorSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCoordinationByCollaboratorQuery, GetCoordinationByCollaboratorQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCoordinationByCollaboratorQuery, GetCoordinationByCollaboratorQueryVariables>(GetCoordinationByCollaboratorDocument, options);
        }
export type GetCoordinationByCollaboratorQueryHookResult = ReturnType<typeof useGetCoordinationByCollaboratorQuery>;
export type GetCoordinationByCollaboratorLazyQueryHookResult = ReturnType<typeof useGetCoordinationByCollaboratorLazyQuery>;
export type GetCoordinationByCollaboratorSuspenseQueryHookResult = ReturnType<typeof useGetCoordinationByCollaboratorSuspenseQuery>;
export type GetCoordinationByCollaboratorQueryResult = Apollo.QueryResult<GetCoordinationByCollaboratorQuery, GetCoordinationByCollaboratorQueryVariables>;
export const GetProgramsDocument = gql`
    query GetPrograms($idCoordination: Long, $idTrainingLevel: Long, $name: String, $page: Int, $size: Int) {
  allPrograms(
    idCoordination: $idCoordination
    idTrainingLevel: $idTrainingLevel
    name: $name
    page: $page
    size: $size
  ) {
    date
    code
    message
    data {
      id
      name
      description
      state
      coordination {
        id
        name
      }
      trainingLevel {
        id
        name
      }
    }
    currentPage
    totalPages
    totalItems
  }
}
    `;

/**
 * __useGetProgramsQuery__
 *
 * To run a query within a React component, call `useGetProgramsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProgramsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProgramsQuery({
 *   variables: {
 *      idCoordination: // value for 'idCoordination'
 *      idTrainingLevel: // value for 'idTrainingLevel'
 *      name: // value for 'name'
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetProgramsQuery(baseOptions?: Apollo.QueryHookOptions<GetProgramsQuery, GetProgramsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProgramsQuery, GetProgramsQueryVariables>(GetProgramsDocument, options);
      }
export function useGetProgramsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProgramsQuery, GetProgramsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProgramsQuery, GetProgramsQueryVariables>(GetProgramsDocument, options);
        }
export function useGetProgramsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProgramsQuery, GetProgramsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProgramsQuery, GetProgramsQueryVariables>(GetProgramsDocument, options);
        }
export type GetProgramsQueryHookResult = ReturnType<typeof useGetProgramsQuery>;
export type GetProgramsLazyQueryHookResult = ReturnType<typeof useGetProgramsLazyQuery>;
export type GetProgramsSuspenseQueryHookResult = ReturnType<typeof useGetProgramsSuspenseQuery>;
export type GetProgramsQueryResult = Apollo.QueryResult<GetProgramsQuery, GetProgramsQueryVariables>;
export const GetStudentsDocument = gql`
    query GetStudents($name: String, $idStudySheet: Long, $page: Int, $size: Int) {
  allStudents(name: $name, idStudySheet: $idStudySheet, page: $page, size: $size) {
    date
    code
    message
    data {
      id
      state
      person {
        id
        document
        name
        lastname
        phone
        email
        address
      }
    }
    currentPage
    totalPages
    totalItems
  }
}
    `;

/**
 * __useGetStudentsQuery__
 *
 * To run a query within a React component, call `useGetStudentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStudentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStudentsQuery({
 *   variables: {
 *      name: // value for 'name'
 *      idStudySheet: // value for 'idStudySheet'
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetStudentsQuery(baseOptions?: Apollo.QueryHookOptions<GetStudentsQuery, GetStudentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStudentsQuery, GetStudentsQueryVariables>(GetStudentsDocument, options);
      }
export function useGetStudentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStudentsQuery, GetStudentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStudentsQuery, GetStudentsQueryVariables>(GetStudentsDocument, options);
        }
export function useGetStudentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStudentsQuery, GetStudentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStudentsQuery, GetStudentsQueryVariables>(GetStudentsDocument, options);
        }
export type GetStudentsQueryHookResult = ReturnType<typeof useGetStudentsQuery>;
export type GetStudentsLazyQueryHookResult = ReturnType<typeof useGetStudentsLazyQuery>;
export type GetStudentsSuspenseQueryHookResult = ReturnType<typeof useGetStudentsSuspenseQuery>;
export type GetStudentsQueryResult = Apollo.QueryResult<GetStudentsQuery, GetStudentsQueryVariables>;
export const GetStudentListDocument = gql`
    query GetStudentList {
  allStudentList {
    code
    message
    data {
      id
      state
      person {
        id
        name
        lastname
        document
      }
    }
    totalItems
  }
}
    `;

/**
 * __useGetStudentListQuery__
 *
 * To run a query within a React component, call `useGetStudentListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStudentListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStudentListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetStudentListQuery(baseOptions?: Apollo.QueryHookOptions<GetStudentListQuery, GetStudentListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStudentListQuery, GetStudentListQueryVariables>(GetStudentListDocument, options);
      }
export function useGetStudentListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStudentListQuery, GetStudentListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStudentListQuery, GetStudentListQueryVariables>(GetStudentListDocument, options);
        }
export function useGetStudentListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStudentListQuery, GetStudentListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStudentListQuery, GetStudentListQueryVariables>(GetStudentListDocument, options);
        }
export type GetStudentListQueryHookResult = ReturnType<typeof useGetStudentListQuery>;
export type GetStudentListLazyQueryHookResult = ReturnType<typeof useGetStudentListLazyQuery>;
export type GetStudentListSuspenseQueryHookResult = ReturnType<typeof useGetStudentListSuspenseQuery>;
export type GetStudentListQueryResult = Apollo.QueryResult<GetStudentListQuery, GetStudentListQueryVariables>;
export const GetStudySheetsDocument = gql`
    query GetStudySheets($name: String, $idJourney: Long, $page: Int, $size: Int) {
  allStudySheets(name: $name, idJourney: $idJourney, page: $page, size: $size) {
    date
    code
    message
    data {
      id
      number
      numberStudents
      startLective
      endLective
      state
      offer {
        name
      }
      journey {
        name
      }
      quarter {
        name {
          extension
          number
        }
      }
      trainingProject {
        name
        program {
          id
          name
        }
      }
    }
    currentPage
    totalPages
    totalItems
  }
}
    `;

/**
 * __useGetStudySheetsQuery__
 *
 * To run a query within a React component, call `useGetStudySheetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStudySheetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStudySheetsQuery({
 *   variables: {
 *      name: // value for 'name'
 *      idJourney: // value for 'idJourney'
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetStudySheetsQuery(baseOptions?: Apollo.QueryHookOptions<GetStudySheetsQuery, GetStudySheetsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStudySheetsQuery, GetStudySheetsQueryVariables>(GetStudySheetsDocument, options);
      }
export function useGetStudySheetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStudySheetsQuery, GetStudySheetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStudySheetsQuery, GetStudySheetsQueryVariables>(GetStudySheetsDocument, options);
        }
export function useGetStudySheetsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStudySheetsQuery, GetStudySheetsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStudySheetsQuery, GetStudySheetsQueryVariables>(GetStudySheetsDocument, options);
        }
export type GetStudySheetsQueryHookResult = ReturnType<typeof useGetStudySheetsQuery>;
export type GetStudySheetsLazyQueryHookResult = ReturnType<typeof useGetStudySheetsLazyQuery>;
export type GetStudySheetsSuspenseQueryHookResult = ReturnType<typeof useGetStudySheetsSuspenseQuery>;
export type GetStudySheetsQueryResult = Apollo.QueryResult<GetStudySheetsQuery, GetStudySheetsQueryVariables>;
export const GetStudySheetsByTrainingProjectDocument = gql`
    query GetStudySheetsByTrainingProject($page: Int, $size: Int) {
  allStudySheets(page: $page, size: $size) {
    date
    code
    message
    data {
      id
      number
      numberStudents
      startLective
      endLective
      state
      offer {
        name
      }
      journey {
        name
      }
      quarter {
        name {
          extension
          number
        }
      }
      trainingProject {
        id
        name
        program {
          id
          name
        }
      }
    }
    currentPage
    totalPages
    totalItems
  }
}
    `;

/**
 * __useGetStudySheetsByTrainingProjectQuery__
 *
 * To run a query within a React component, call `useGetStudySheetsByTrainingProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStudySheetsByTrainingProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStudySheetsByTrainingProjectQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetStudySheetsByTrainingProjectQuery(baseOptions?: Apollo.QueryHookOptions<GetStudySheetsByTrainingProjectQuery, GetStudySheetsByTrainingProjectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStudySheetsByTrainingProjectQuery, GetStudySheetsByTrainingProjectQueryVariables>(GetStudySheetsByTrainingProjectDocument, options);
      }
export function useGetStudySheetsByTrainingProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStudySheetsByTrainingProjectQuery, GetStudySheetsByTrainingProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStudySheetsByTrainingProjectQuery, GetStudySheetsByTrainingProjectQueryVariables>(GetStudySheetsByTrainingProjectDocument, options);
        }
export function useGetStudySheetsByTrainingProjectSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStudySheetsByTrainingProjectQuery, GetStudySheetsByTrainingProjectQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStudySheetsByTrainingProjectQuery, GetStudySheetsByTrainingProjectQueryVariables>(GetStudySheetsByTrainingProjectDocument, options);
        }
export type GetStudySheetsByTrainingProjectQueryHookResult = ReturnType<typeof useGetStudySheetsByTrainingProjectQuery>;
export type GetStudySheetsByTrainingProjectLazyQueryHookResult = ReturnType<typeof useGetStudySheetsByTrainingProjectLazyQuery>;
export type GetStudySheetsByTrainingProjectSuspenseQueryHookResult = ReturnType<typeof useGetStudySheetsByTrainingProjectSuspenseQuery>;
export type GetStudySheetsByTrainingProjectQueryResult = Apollo.QueryResult<GetStudySheetsByTrainingProjectQuery, GetStudySheetsByTrainingProjectQueryVariables>;
export const GetStudySheetWithTeamScrumByIdDocument = gql`
    query GetStudySheetWithTeamScrumById($id: Long) {
  studySheetById(id: $id) {
    data {
      id
      number
      teamsScrum {
        id
        teamName
        projectName
        processMethodology {
          id
          name
        }
        students {
          id
          person {
            name
            lastname
            document
            email
          }
          profiles {
            name
            description
            isActive
            isUnique
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetStudySheetWithTeamScrumByIdQuery__
 *
 * To run a query within a React component, call `useGetStudySheetWithTeamScrumByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStudySheetWithTeamScrumByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStudySheetWithTeamScrumByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetStudySheetWithTeamScrumByIdQuery(baseOptions?: Apollo.QueryHookOptions<GetStudySheetWithTeamScrumByIdQuery, GetStudySheetWithTeamScrumByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStudySheetWithTeamScrumByIdQuery, GetStudySheetWithTeamScrumByIdQueryVariables>(GetStudySheetWithTeamScrumByIdDocument, options);
      }
export function useGetStudySheetWithTeamScrumByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStudySheetWithTeamScrumByIdQuery, GetStudySheetWithTeamScrumByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStudySheetWithTeamScrumByIdQuery, GetStudySheetWithTeamScrumByIdQueryVariables>(GetStudySheetWithTeamScrumByIdDocument, options);
        }
export function useGetStudySheetWithTeamScrumByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStudySheetWithTeamScrumByIdQuery, GetStudySheetWithTeamScrumByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStudySheetWithTeamScrumByIdQuery, GetStudySheetWithTeamScrumByIdQueryVariables>(GetStudySheetWithTeamScrumByIdDocument, options);
        }
export type GetStudySheetWithTeamScrumByIdQueryHookResult = ReturnType<typeof useGetStudySheetWithTeamScrumByIdQuery>;
export type GetStudySheetWithTeamScrumByIdLazyQueryHookResult = ReturnType<typeof useGetStudySheetWithTeamScrumByIdLazyQuery>;
export type GetStudySheetWithTeamScrumByIdSuspenseQueryHookResult = ReturnType<typeof useGetStudySheetWithTeamScrumByIdSuspenseQuery>;
export type GetStudySheetWithTeamScrumByIdQueryResult = Apollo.QueryResult<GetStudySheetWithTeamScrumByIdQuery, GetStudySheetWithTeamScrumByIdQueryVariables>;
export const GetStudySheetByIdDocument = gql`
    query GetStudySheetById($id: Long!) {
  studySheetById(id: $id) {
    code
    message
    data {
      id
      number
      numberStudents
      quarter {
        id
        name {
          number
          extension
        }
      }
      trainingProject {
        id
        name
        program {
          id
          name
        }
      }
      studentStudySheets {
        id
        student {
          id
          person {
            id
            document
            name
            lastname
            email
            phone
          }
        }
        studentStudySheetState {
          id
          name
        }
      }
      teacherStudySheets {
        id
        competence {
          name
        }
      }
    }
  }
}
    `;

/**
 * __useGetStudySheetByIdQuery__
 *
 * To run a query within a React component, call `useGetStudySheetByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStudySheetByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStudySheetByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetStudySheetByIdQuery(baseOptions: Apollo.QueryHookOptions<GetStudySheetByIdQuery, GetStudySheetByIdQueryVariables> & ({ variables: GetStudySheetByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStudySheetByIdQuery, GetStudySheetByIdQueryVariables>(GetStudySheetByIdDocument, options);
      }
export function useGetStudySheetByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStudySheetByIdQuery, GetStudySheetByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStudySheetByIdQuery, GetStudySheetByIdQueryVariables>(GetStudySheetByIdDocument, options);
        }
export function useGetStudySheetByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStudySheetByIdQuery, GetStudySheetByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStudySheetByIdQuery, GetStudySheetByIdQueryVariables>(GetStudySheetByIdDocument, options);
        }
export type GetStudySheetByIdQueryHookResult = ReturnType<typeof useGetStudySheetByIdQuery>;
export type GetStudySheetByIdLazyQueryHookResult = ReturnType<typeof useGetStudySheetByIdLazyQuery>;
export type GetStudySheetByIdSuspenseQueryHookResult = ReturnType<typeof useGetStudySheetByIdSuspenseQuery>;
export type GetStudySheetByIdQueryResult = Apollo.QueryResult<GetStudySheetByIdQuery, GetStudySheetByIdQueryVariables>;
export const StudySheetByTeacherDocument = gql`
    query studySheetByTeacher($idTeacher: Long, $page: Int, $size: Int) {
  allStudySheets(page: $page, size: $size, idTeacher: $idTeacher) {
    date
    code
    message
    data {
      id
      number
      startLective
      endLective
      state
      journey {
        name
      }
      trainingProject {
        name
        program {
          name
        }
      }
      teacherStudySheets {
        id
        competence {
          id
          name
        }
      }
      studentStudySheets {
        student {
          id
          person {
            document
            name
            lastname
            phone
            email
            bloodType
            dateBirth
          }
        }
        studentStudySheetState {
          name
        }
      }
    }
    currentPage
    totalPages
    totalItems
  }
}
    `;

/**
 * __useStudySheetByTeacherQuery__
 *
 * To run a query within a React component, call `useStudySheetByTeacherQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudySheetByTeacherQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudySheetByTeacherQuery({
 *   variables: {
 *      idTeacher: // value for 'idTeacher'
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useStudySheetByTeacherQuery(baseOptions?: Apollo.QueryHookOptions<StudySheetByTeacherQuery, StudySheetByTeacherQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StudySheetByTeacherQuery, StudySheetByTeacherQueryVariables>(StudySheetByTeacherDocument, options);
      }
export function useStudySheetByTeacherLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudySheetByTeacherQuery, StudySheetByTeacherQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StudySheetByTeacherQuery, StudySheetByTeacherQueryVariables>(StudySheetByTeacherDocument, options);
        }
export function useStudySheetByTeacherSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StudySheetByTeacherQuery, StudySheetByTeacherQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<StudySheetByTeacherQuery, StudySheetByTeacherQueryVariables>(StudySheetByTeacherDocument, options);
        }
export type StudySheetByTeacherQueryHookResult = ReturnType<typeof useStudySheetByTeacherQuery>;
export type StudySheetByTeacherLazyQueryHookResult = ReturnType<typeof useStudySheetByTeacherLazyQuery>;
export type StudySheetByTeacherSuspenseQueryHookResult = ReturnType<typeof useStudySheetByTeacherSuspenseQuery>;
export type StudySheetByTeacherQueryResult = Apollo.QueryResult<StudySheetByTeacherQuery, StudySheetByTeacherQueryVariables>;
export const GetStudySheetWithStudentsDocument = gql`
    query GetStudySheetWithStudents($id: Long!) {
  studySheetById(id: $id) {
    code
    message
    data {
      id
      number
      journey {
        name
      }
      trainingProject {
        program {
          name
        }
      }
      studentStudySheets {
        student {
          id
          person {
            name
            lastname
            email
          }
        }
        studentStudySheetState {
          id
          name
        }
      }
    }
  }
}
    `;

/**
 * __useGetStudySheetWithStudentsQuery__
 *
 * To run a query within a React component, call `useGetStudySheetWithStudentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStudySheetWithStudentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStudySheetWithStudentsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetStudySheetWithStudentsQuery(baseOptions: Apollo.QueryHookOptions<GetStudySheetWithStudentsQuery, GetStudySheetWithStudentsQueryVariables> & ({ variables: GetStudySheetWithStudentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStudySheetWithStudentsQuery, GetStudySheetWithStudentsQueryVariables>(GetStudySheetWithStudentsDocument, options);
      }
export function useGetStudySheetWithStudentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStudySheetWithStudentsQuery, GetStudySheetWithStudentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStudySheetWithStudentsQuery, GetStudySheetWithStudentsQueryVariables>(GetStudySheetWithStudentsDocument, options);
        }
export function useGetStudySheetWithStudentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStudySheetWithStudentsQuery, GetStudySheetWithStudentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStudySheetWithStudentsQuery, GetStudySheetWithStudentsQueryVariables>(GetStudySheetWithStudentsDocument, options);
        }
export type GetStudySheetWithStudentsQueryHookResult = ReturnType<typeof useGetStudySheetWithStudentsQuery>;
export type GetStudySheetWithStudentsLazyQueryHookResult = ReturnType<typeof useGetStudySheetWithStudentsLazyQuery>;
export type GetStudySheetWithStudentsSuspenseQueryHookResult = ReturnType<typeof useGetStudySheetWithStudentsSuspenseQuery>;
export type GetStudySheetWithStudentsQueryResult = Apollo.QueryResult<GetStudySheetWithStudentsQuery, GetStudySheetWithStudentsQueryVariables>;
export const GetCStudySheetsDocument = gql`
    query GetCStudySheets($id: Long, $teacherId: Long) {
  studySheetById(id: $id, teacherId: $teacherId) {
    code
    message
    data {
      id
      teacherStudySheets {
        id
        competence {
          id
          name
        }
      }
    }
  }
}
    `;

/**
 * __useGetCStudySheetsQuery__
 *
 * To run a query within a React component, call `useGetCStudySheetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCStudySheetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCStudySheetsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      teacherId: // value for 'teacherId'
 *   },
 * });
 */
export function useGetCStudySheetsQuery(baseOptions?: Apollo.QueryHookOptions<GetCStudySheetsQuery, GetCStudySheetsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCStudySheetsQuery, GetCStudySheetsQueryVariables>(GetCStudySheetsDocument, options);
      }
export function useGetCStudySheetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCStudySheetsQuery, GetCStudySheetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCStudySheetsQuery, GetCStudySheetsQueryVariables>(GetCStudySheetsDocument, options);
        }
export function useGetCStudySheetsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCStudySheetsQuery, GetCStudySheetsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCStudySheetsQuery, GetCStudySheetsQueryVariables>(GetCStudySheetsDocument, options);
        }
export type GetCStudySheetsQueryHookResult = ReturnType<typeof useGetCStudySheetsQuery>;
export type GetCStudySheetsLazyQueryHookResult = ReturnType<typeof useGetCStudySheetsLazyQuery>;
export type GetCStudySheetsSuspenseQueryHookResult = ReturnType<typeof useGetCStudySheetsSuspenseQuery>;
export type GetCStudySheetsQueryResult = Apollo.QueryResult<GetCStudySheetsQuery, GetCStudySheetsQueryVariables>;
export const StudySheetByTeacherIdWithTeamScrumDocument = gql`
    query studySheetByTeacherIdWithTeamScrum($idTeacher: Long, $page: Int, $size: Int) {
  allStudySheets(page: $page, size: $size, idTeacher: $idTeacher) {
    date
    code
    message
    data {
      id
      number
      startLective
      endLective
      state
      journey {
        name
      }
      quarter {
        id
        name {
          extension
          number
        }
      }
      trainingProject {
        name
        program {
          name
        }
      }
      teamsScrum {
        id
        teamName
        students {
          id
          person {
            lastname
            name
            document
          }
        }
      }
    }
    currentPage
    totalPages
    totalItems
  }
}
    `;

/**
 * __useStudySheetByTeacherIdWithTeamScrumQuery__
 *
 * To run a query within a React component, call `useStudySheetByTeacherIdWithTeamScrumQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudySheetByTeacherIdWithTeamScrumQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudySheetByTeacherIdWithTeamScrumQuery({
 *   variables: {
 *      idTeacher: // value for 'idTeacher'
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useStudySheetByTeacherIdWithTeamScrumQuery(baseOptions?: Apollo.QueryHookOptions<StudySheetByTeacherIdWithTeamScrumQuery, StudySheetByTeacherIdWithTeamScrumQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StudySheetByTeacherIdWithTeamScrumQuery, StudySheetByTeacherIdWithTeamScrumQueryVariables>(StudySheetByTeacherIdWithTeamScrumDocument, options);
      }
export function useStudySheetByTeacherIdWithTeamScrumLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudySheetByTeacherIdWithTeamScrumQuery, StudySheetByTeacherIdWithTeamScrumQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StudySheetByTeacherIdWithTeamScrumQuery, StudySheetByTeacherIdWithTeamScrumQueryVariables>(StudySheetByTeacherIdWithTeamScrumDocument, options);
        }
export function useStudySheetByTeacherIdWithTeamScrumSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StudySheetByTeacherIdWithTeamScrumQuery, StudySheetByTeacherIdWithTeamScrumQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<StudySheetByTeacherIdWithTeamScrumQuery, StudySheetByTeacherIdWithTeamScrumQueryVariables>(StudySheetByTeacherIdWithTeamScrumDocument, options);
        }
export type StudySheetByTeacherIdWithTeamScrumQueryHookResult = ReturnType<typeof useStudySheetByTeacherIdWithTeamScrumQuery>;
export type StudySheetByTeacherIdWithTeamScrumLazyQueryHookResult = ReturnType<typeof useStudySheetByTeacherIdWithTeamScrumLazyQuery>;
export type StudySheetByTeacherIdWithTeamScrumSuspenseQueryHookResult = ReturnType<typeof useStudySheetByTeacherIdWithTeamScrumSuspenseQuery>;
export type StudySheetByTeacherIdWithTeamScrumQueryResult = Apollo.QueryResult<StudySheetByTeacherIdWithTeamScrumQuery, StudySheetByTeacherIdWithTeamScrumQueryVariables>;
export const GetStudySheetByIdWithAttendancesDocument = gql`
    query GetStudySheetByIdWithAttendances($id: Long!, $competenceId: Long, $teacherId: Long) {
  studySheetById(id: $id, teacherId: $teacherId) {
    code
    message
    data {
      id
      number
      numberStudents
      quarter {
        id
        name {
          number
          extension
        }
      }
      trainingProject {
        id
        name
        program {
          id
          name
        }
      }
      studentStudySheets {
        id
        student {
          id
          attendances(competenceQuarterId: $competenceId) {
            attendanceDate
            attendanceState {
              status
            }
          }
          id
          person {
            id
            document
            name
            lastname
            email
            phone
          }
        }
        studentStudySheetState {
          id
          name
        }
      }
      teacherStudySheets {
        id
        competence {
          name
          description
          learningOutcome {
            name
            description
            state
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetStudySheetByIdWithAttendancesQuery__
 *
 * To run a query within a React component, call `useGetStudySheetByIdWithAttendancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStudySheetByIdWithAttendancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStudySheetByIdWithAttendancesQuery({
 *   variables: {
 *      id: // value for 'id'
 *      competenceId: // value for 'competenceId'
 *      teacherId: // value for 'teacherId'
 *   },
 * });
 */
export function useGetStudySheetByIdWithAttendancesQuery(baseOptions: Apollo.QueryHookOptions<GetStudySheetByIdWithAttendancesQuery, GetStudySheetByIdWithAttendancesQueryVariables> & ({ variables: GetStudySheetByIdWithAttendancesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStudySheetByIdWithAttendancesQuery, GetStudySheetByIdWithAttendancesQueryVariables>(GetStudySheetByIdWithAttendancesDocument, options);
      }
export function useGetStudySheetByIdWithAttendancesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStudySheetByIdWithAttendancesQuery, GetStudySheetByIdWithAttendancesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStudySheetByIdWithAttendancesQuery, GetStudySheetByIdWithAttendancesQueryVariables>(GetStudySheetByIdWithAttendancesDocument, options);
        }
export function useGetStudySheetByIdWithAttendancesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStudySheetByIdWithAttendancesQuery, GetStudySheetByIdWithAttendancesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStudySheetByIdWithAttendancesQuery, GetStudySheetByIdWithAttendancesQueryVariables>(GetStudySheetByIdWithAttendancesDocument, options);
        }
export type GetStudySheetByIdWithAttendancesQueryHookResult = ReturnType<typeof useGetStudySheetByIdWithAttendancesQuery>;
export type GetStudySheetByIdWithAttendancesLazyQueryHookResult = ReturnType<typeof useGetStudySheetByIdWithAttendancesLazyQuery>;
export type GetStudySheetByIdWithAttendancesSuspenseQueryHookResult = ReturnType<typeof useGetStudySheetByIdWithAttendancesSuspenseQuery>;
export type GetStudySheetByIdWithAttendancesQueryResult = Apollo.QueryResult<GetStudySheetByIdWithAttendancesQuery, GetStudySheetByIdWithAttendancesQueryVariables>;
export const GetAllTrainingProjectsDocument = gql`
    query GetAllTrainingProjects($name: String, $idProgram: Long, $page: Int, $size: Int) {
  allTrainingProjects(
    name: $name
    idProgram: $idProgram
    page: $page
    size: $size
  ) {
    date
    code
    message
    data {
      id
      name
      description
      state
      program {
        id
        name
        description
        coordination {
          id
          name
        }
        trainingLevel {
          id
          name
        }
      }
    }
    currentPage
    totalPages
    totalItems
  }
}
    `;

/**
 * __useGetAllTrainingProjectsQuery__
 *
 * To run a query within a React component, call `useGetAllTrainingProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllTrainingProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllTrainingProjectsQuery({
 *   variables: {
 *      name: // value for 'name'
 *      idProgram: // value for 'idProgram'
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetAllTrainingProjectsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllTrainingProjectsQuery, GetAllTrainingProjectsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllTrainingProjectsQuery, GetAllTrainingProjectsQueryVariables>(GetAllTrainingProjectsDocument, options);
      }
export function useGetAllTrainingProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllTrainingProjectsQuery, GetAllTrainingProjectsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllTrainingProjectsQuery, GetAllTrainingProjectsQueryVariables>(GetAllTrainingProjectsDocument, options);
        }
export function useGetAllTrainingProjectsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllTrainingProjectsQuery, GetAllTrainingProjectsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllTrainingProjectsQuery, GetAllTrainingProjectsQueryVariables>(GetAllTrainingProjectsDocument, options);
        }
export type GetAllTrainingProjectsQueryHookResult = ReturnType<typeof useGetAllTrainingProjectsQuery>;
export type GetAllTrainingProjectsLazyQueryHookResult = ReturnType<typeof useGetAllTrainingProjectsLazyQuery>;
export type GetAllTrainingProjectsSuspenseQueryHookResult = ReturnType<typeof useGetAllTrainingProjectsSuspenseQuery>;
export type GetAllTrainingProjectsQueryResult = Apollo.QueryResult<GetAllTrainingProjectsQuery, GetAllTrainingProjectsQueryVariables>;
export const GetTrainingProjectsByProgramDocument = gql`
    query GetTrainingProjectsByProgram($idProgram: Long!, $page: Int, $size: Int) {
  allTrainingProjects(idProgram: $idProgram, page: $page, size: $size) {
    date
    code
    message
    data {
      id
      name
      description
      state
      program {
        id
        name
      }
    }
    currentPage
    totalPages
    totalItems
  }
}
    `;

/**
 * __useGetTrainingProjectsByProgramQuery__
 *
 * To run a query within a React component, call `useGetTrainingProjectsByProgramQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTrainingProjectsByProgramQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTrainingProjectsByProgramQuery({
 *   variables: {
 *      idProgram: // value for 'idProgram'
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetTrainingProjectsByProgramQuery(baseOptions: Apollo.QueryHookOptions<GetTrainingProjectsByProgramQuery, GetTrainingProjectsByProgramQueryVariables> & ({ variables: GetTrainingProjectsByProgramQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTrainingProjectsByProgramQuery, GetTrainingProjectsByProgramQueryVariables>(GetTrainingProjectsByProgramDocument, options);
      }
export function useGetTrainingProjectsByProgramLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTrainingProjectsByProgramQuery, GetTrainingProjectsByProgramQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTrainingProjectsByProgramQuery, GetTrainingProjectsByProgramQueryVariables>(GetTrainingProjectsByProgramDocument, options);
        }
export function useGetTrainingProjectsByProgramSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTrainingProjectsByProgramQuery, GetTrainingProjectsByProgramQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTrainingProjectsByProgramQuery, GetTrainingProjectsByProgramQueryVariables>(GetTrainingProjectsByProgramDocument, options);
        }
export type GetTrainingProjectsByProgramQueryHookResult = ReturnType<typeof useGetTrainingProjectsByProgramQuery>;
export type GetTrainingProjectsByProgramLazyQueryHookResult = ReturnType<typeof useGetTrainingProjectsByProgramLazyQuery>;
export type GetTrainingProjectsByProgramSuspenseQueryHookResult = ReturnType<typeof useGetTrainingProjectsByProgramSuspenseQuery>;
export type GetTrainingProjectsByProgramQueryResult = Apollo.QueryResult<GetTrainingProjectsByProgramQuery, GetTrainingProjectsByProgramQueryVariables>;
export const GetTrainingProjectByIdDocument = gql`
    query GetTrainingProjectById($page: Int, $size: Int) {
  allTrainingProjects(page: $page, size: $size) {
    date
    code
    message
    data {
      id
      name
      description
      state
      program {
        id
        name
        description
        coordination {
          id
          name
        }
        trainingLevel {
          id
          name
        }
      }
    }
    currentPage
    totalPages
    totalItems
  }
}
    `;

/**
 * __useGetTrainingProjectByIdQuery__
 *
 * To run a query within a React component, call `useGetTrainingProjectByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTrainingProjectByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTrainingProjectByIdQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetTrainingProjectByIdQuery(baseOptions?: Apollo.QueryHookOptions<GetTrainingProjectByIdQuery, GetTrainingProjectByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTrainingProjectByIdQuery, GetTrainingProjectByIdQueryVariables>(GetTrainingProjectByIdDocument, options);
      }
export function useGetTrainingProjectByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTrainingProjectByIdQuery, GetTrainingProjectByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTrainingProjectByIdQuery, GetTrainingProjectByIdQueryVariables>(GetTrainingProjectByIdDocument, options);
        }
export function useGetTrainingProjectByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTrainingProjectByIdQuery, GetTrainingProjectByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTrainingProjectByIdQuery, GetTrainingProjectByIdQueryVariables>(GetTrainingProjectByIdDocument, options);
        }
export type GetTrainingProjectByIdQueryHookResult = ReturnType<typeof useGetTrainingProjectByIdQuery>;
export type GetTrainingProjectByIdLazyQueryHookResult = ReturnType<typeof useGetTrainingProjectByIdLazyQuery>;
export type GetTrainingProjectByIdSuspenseQueryHookResult = ReturnType<typeof useGetTrainingProjectByIdSuspenseQuery>;
export type GetTrainingProjectByIdQueryResult = Apollo.QueryResult<GetTrainingProjectByIdQuery, GetTrainingProjectByIdQueryVariables>;
export const GetTeamsScrumsDocument = gql`
    query GetTeamsScrums($page: Int, $size: Int) {
  allTeamsScrums(page: $page, size: $size) {
    date
    code
    message
    data {
      id
      teamName
      projectName
      problem
      objectives
      description
      projectJustification
      students {
        id
        person {
          name
          lastname
        }
      }
    }
    currentPage
    totalPages
    totalItems
  }
}
    `;

/**
 * __useGetTeamsScrumsQuery__
 *
 * To run a query within a React component, call `useGetTeamsScrumsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamsScrumsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeamsScrumsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetTeamsScrumsQuery(baseOptions?: Apollo.QueryHookOptions<GetTeamsScrumsQuery, GetTeamsScrumsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTeamsScrumsQuery, GetTeamsScrumsQueryVariables>(GetTeamsScrumsDocument, options);
      }
export function useGetTeamsScrumsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTeamsScrumsQuery, GetTeamsScrumsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTeamsScrumsQuery, GetTeamsScrumsQueryVariables>(GetTeamsScrumsDocument, options);
        }
export function useGetTeamsScrumsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTeamsScrumsQuery, GetTeamsScrumsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTeamsScrumsQuery, GetTeamsScrumsQueryVariables>(GetTeamsScrumsDocument, options);
        }
export type GetTeamsScrumsQueryHookResult = ReturnType<typeof useGetTeamsScrumsQuery>;
export type GetTeamsScrumsLazyQueryHookResult = ReturnType<typeof useGetTeamsScrumsLazyQuery>;
export type GetTeamsScrumsSuspenseQueryHookResult = ReturnType<typeof useGetTeamsScrumsSuspenseQuery>;
export type GetTeamsScrumsQueryResult = Apollo.QueryResult<GetTeamsScrumsQuery, GetTeamsScrumsQueryVariables>;
export const GetTeamScrumByIdDocument = gql`
    query GetTeamScrumById($id: Long!) {
  teamScrumById(id: $id) {
    code
    message
    date
    data {
      id
      teamName
      projectName
      problem
      objectives
      description
      projectJustification
    }
  }
}
    `;

/**
 * __useGetTeamScrumByIdQuery__
 *
 * To run a query within a React component, call `useGetTeamScrumByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamScrumByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeamScrumByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTeamScrumByIdQuery(baseOptions: Apollo.QueryHookOptions<GetTeamScrumByIdQuery, GetTeamScrumByIdQueryVariables> & ({ variables: GetTeamScrumByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTeamScrumByIdQuery, GetTeamScrumByIdQueryVariables>(GetTeamScrumByIdDocument, options);
      }
export function useGetTeamScrumByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTeamScrumByIdQuery, GetTeamScrumByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTeamScrumByIdQuery, GetTeamScrumByIdQueryVariables>(GetTeamScrumByIdDocument, options);
        }
export function useGetTeamScrumByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTeamScrumByIdQuery, GetTeamScrumByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTeamScrumByIdQuery, GetTeamScrumByIdQueryVariables>(GetTeamScrumByIdDocument, options);
        }
export type GetTeamScrumByIdQueryHookResult = ReturnType<typeof useGetTeamScrumByIdQuery>;
export type GetTeamScrumByIdLazyQueryHookResult = ReturnType<typeof useGetTeamScrumByIdLazyQuery>;
export type GetTeamScrumByIdSuspenseQueryHookResult = ReturnType<typeof useGetTeamScrumByIdSuspenseQuery>;
export type GetTeamScrumByIdQueryResult = Apollo.QueryResult<GetTeamScrumByIdQuery, GetTeamScrumByIdQueryVariables>;
export const GetTeamScrumByIdWithStudentsDocument = gql`
    query GetTeamScrumByIdWithStudents($id: Long!) {
  teamScrumById(id: $id) {
    code
    message
    date
    data {
      id
      teamName
      projectName
      problem
      objectives
      description
      projectJustification
      studySheet {
        number
        quarter {
          name {
            extension
            number
          }
        }
      }
      students {
        person {
          name
          lastname
        }
        profiles {
          name
        }
      }
    }
  }
}
    `;

/**
 * __useGetTeamScrumByIdWithStudentsQuery__
 *
 * To run a query within a React component, call `useGetTeamScrumByIdWithStudentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeamScrumByIdWithStudentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeamScrumByIdWithStudentsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTeamScrumByIdWithStudentsQuery(baseOptions: Apollo.QueryHookOptions<GetTeamScrumByIdWithStudentsQuery, GetTeamScrumByIdWithStudentsQueryVariables> & ({ variables: GetTeamScrumByIdWithStudentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTeamScrumByIdWithStudentsQuery, GetTeamScrumByIdWithStudentsQueryVariables>(GetTeamScrumByIdWithStudentsDocument, options);
      }
export function useGetTeamScrumByIdWithStudentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTeamScrumByIdWithStudentsQuery, GetTeamScrumByIdWithStudentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTeamScrumByIdWithStudentsQuery, GetTeamScrumByIdWithStudentsQueryVariables>(GetTeamScrumByIdWithStudentsDocument, options);
        }
export function useGetTeamScrumByIdWithStudentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTeamScrumByIdWithStudentsQuery, GetTeamScrumByIdWithStudentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTeamScrumByIdWithStudentsQuery, GetTeamScrumByIdWithStudentsQueryVariables>(GetTeamScrumByIdWithStudentsDocument, options);
        }
export type GetTeamScrumByIdWithStudentsQueryHookResult = ReturnType<typeof useGetTeamScrumByIdWithStudentsQuery>;
export type GetTeamScrumByIdWithStudentsLazyQueryHookResult = ReturnType<typeof useGetTeamScrumByIdWithStudentsLazyQuery>;
export type GetTeamScrumByIdWithStudentsSuspenseQueryHookResult = ReturnType<typeof useGetTeamScrumByIdWithStudentsSuspenseQuery>;
export type GetTeamScrumByIdWithStudentsQueryResult = Apollo.QueryResult<GetTeamScrumByIdWithStudentsQuery, GetTeamScrumByIdWithStudentsQueryVariables>;
export const AddTeamScrumDocument = gql`
    mutation AddTeamScrum($input: TeamsScrumDto!) {
  addTeamScrum(input: $input) {
    code
    message
    id
  }
}
    `;
export type AddTeamScrumMutationFn = Apollo.MutationFunction<AddTeamScrumMutation, AddTeamScrumMutationVariables>;

/**
 * __useAddTeamScrumMutation__
 *
 * To run a mutation, you first call `useAddTeamScrumMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTeamScrumMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTeamScrumMutation, { data, loading, error }] = useAddTeamScrumMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddTeamScrumMutation(baseOptions?: Apollo.MutationHookOptions<AddTeamScrumMutation, AddTeamScrumMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddTeamScrumMutation, AddTeamScrumMutationVariables>(AddTeamScrumDocument, options);
      }
export type AddTeamScrumMutationHookResult = ReturnType<typeof useAddTeamScrumMutation>;
export type AddTeamScrumMutationResult = Apollo.MutationResult<AddTeamScrumMutation>;
export type AddTeamScrumMutationOptions = Apollo.BaseMutationOptions<AddTeamScrumMutation, AddTeamScrumMutationVariables>;
export const AddProfileToStudentDocument = gql`
    mutation AddProfileToStudent($input: [ProcessMethodologyDto]!) {
  addProfileToStudent(input: $input) {
    code
    message
    id {
      id
      studentId
      profileId
    }
  }
}
    `;
export type AddProfileToStudentMutationFn = Apollo.MutationFunction<AddProfileToStudentMutation, AddProfileToStudentMutationVariables>;

/**
 * __useAddProfileToStudentMutation__
 *
 * To run a mutation, you first call `useAddProfileToStudentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProfileToStudentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProfileToStudentMutation, { data, loading, error }] = useAddProfileToStudentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddProfileToStudentMutation(baseOptions?: Apollo.MutationHookOptions<AddProfileToStudentMutation, AddProfileToStudentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddProfileToStudentMutation, AddProfileToStudentMutationVariables>(AddProfileToStudentDocument, options);
      }
export type AddProfileToStudentMutationHookResult = ReturnType<typeof useAddProfileToStudentMutation>;
export type AddProfileToStudentMutationResult = Apollo.MutationResult<AddProfileToStudentMutation>;
export type AddProfileToStudentMutationOptions = Apollo.BaseMutationOptions<AddProfileToStudentMutation, AddProfileToStudentMutationVariables>;
export const UpdateTeamScrumDocument = gql`
    mutation UpdateTeamScrum($id: Long!, $input: TeamsScrumDto) {
  updateTeamScrum(id: $id, input: $input) {
    code
    message
    id
  }
}
    `;
export type UpdateTeamScrumMutationFn = Apollo.MutationFunction<UpdateTeamScrumMutation, UpdateTeamScrumMutationVariables>;

/**
 * __useUpdateTeamScrumMutation__
 *
 * To run a mutation, you first call `useUpdateTeamScrumMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTeamScrumMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTeamScrumMutation, { data, loading, error }] = useUpdateTeamScrumMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTeamScrumMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTeamScrumMutation, UpdateTeamScrumMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTeamScrumMutation, UpdateTeamScrumMutationVariables>(UpdateTeamScrumDocument, options);
      }
export type UpdateTeamScrumMutationHookResult = ReturnType<typeof useUpdateTeamScrumMutation>;
export type UpdateTeamScrumMutationResult = Apollo.MutationResult<UpdateTeamScrumMutation>;
export type UpdateTeamScrumMutationOptions = Apollo.BaseMutationOptions<UpdateTeamScrumMutation, UpdateTeamScrumMutationVariables>;
export const DeleteTeamScrumDocument = gql`
    mutation DeleteTeamScrum($id: Long!) {
  deleteTeamScrum(id: $id) {
    code
    message
    id
  }
}
    `;
export type DeleteTeamScrumMutationFn = Apollo.MutationFunction<DeleteTeamScrumMutation, DeleteTeamScrumMutationVariables>;

/**
 * __useDeleteTeamScrumMutation__
 *
 * To run a mutation, you first call `useDeleteTeamScrumMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTeamScrumMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTeamScrumMutation, { data, loading, error }] = useDeleteTeamScrumMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTeamScrumMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTeamScrumMutation, DeleteTeamScrumMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTeamScrumMutation, DeleteTeamScrumMutationVariables>(DeleteTeamScrumDocument, options);
      }
export type DeleteTeamScrumMutationHookResult = ReturnType<typeof useDeleteTeamScrumMutation>;
export type DeleteTeamScrumMutationResult = Apollo.MutationResult<DeleteTeamScrumMutation>;
export type DeleteTeamScrumMutationOptions = Apollo.BaseMutationOptions<DeleteTeamScrumMutation, DeleteTeamScrumMutationVariables>;
export const AddNoveltyDocument = gql`
    mutation AddNovelty($input: NoveltyDto) {
  addNovelty(input: $input) {
    id
    code
    message
  }
}
    `;
export type AddNoveltyMutationFn = Apollo.MutationFunction<AddNoveltyMutation, AddNoveltyMutationVariables>;

/**
 * __useAddNoveltyMutation__
 *
 * To run a mutation, you first call `useAddNoveltyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddNoveltyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addNoveltyMutation, { data, loading, error }] = useAddNoveltyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddNoveltyMutation(baseOptions?: Apollo.MutationHookOptions<AddNoveltyMutation, AddNoveltyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddNoveltyMutation, AddNoveltyMutationVariables>(AddNoveltyDocument, options);
      }
export type AddNoveltyMutationHookResult = ReturnType<typeof useAddNoveltyMutation>;
export type AddNoveltyMutationResult = Apollo.MutationResult<AddNoveltyMutation>;
export type AddNoveltyMutationOptions = Apollo.BaseMutationOptions<AddNoveltyMutation, AddNoveltyMutationVariables>;
export const GetNoveltyTypesDocument = gql`
    query getNoveltyTypes($page: Int = 0, $size: Int = 10) {
  allNoveltyTypes(page: $page, size: $size) {
    code
    message
    date
    currentPage
    totalItems
    totalPages
    data {
      id
      nameNovelty
      isActive
      description
      procedureDescription
    }
  }
}
    `;

/**
 * __useGetNoveltyTypesQuery__
 *
 * To run a query within a React component, call `useGetNoveltyTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNoveltyTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNoveltyTypesQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *   },
 * });
 */
export function useGetNoveltyTypesQuery(baseOptions?: Apollo.QueryHookOptions<GetNoveltyTypesQuery, GetNoveltyTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNoveltyTypesQuery, GetNoveltyTypesQueryVariables>(GetNoveltyTypesDocument, options);
      }
export function useGetNoveltyTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNoveltyTypesQuery, GetNoveltyTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNoveltyTypesQuery, GetNoveltyTypesQueryVariables>(GetNoveltyTypesDocument, options);
        }
export function useGetNoveltyTypesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetNoveltyTypesQuery, GetNoveltyTypesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetNoveltyTypesQuery, GetNoveltyTypesQueryVariables>(GetNoveltyTypesDocument, options);
        }
export type GetNoveltyTypesQueryHookResult = ReturnType<typeof useGetNoveltyTypesQuery>;
export type GetNoveltyTypesLazyQueryHookResult = ReturnType<typeof useGetNoveltyTypesLazyQuery>;
export type GetNoveltyTypesSuspenseQueryHookResult = ReturnType<typeof useGetNoveltyTypesSuspenseQuery>;
export type GetNoveltyTypesQueryResult = Apollo.QueryResult<GetNoveltyTypesQuery, GetNoveltyTypesQueryVariables>;