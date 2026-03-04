import { gql } from '@apollo/client';

export const GET_ALL_IMPROVEMENT_PLAN_EVALUATIONS = gql`
	query AllImprovementPlanEvaluations($page: Int, $size: Int) {
		allImprovementPlanEvaluations(page: $page, size: $size) {
			data {
				id
				pertinence
				validity
				authenticity
				quality
				judgment
			}
			code
			message
			totalPages
			totalItems
			currentPage
		}
	}
`;

export const GET_IMPROVEMENT_PLAN_EVALUATION_BY_ID = gql`
	query ImprovementPlanEvaluationById($id: Long!) {
		improvementPlanEvaluationById(id: $id) {
			data {
				id
				pertinence
				validity
				authenticity
				quality
				judgment
			}
			code
			message
		}
	}
`;

export const GET_IMPROVEMENT_PLAN_EVALUATION_BY_PLAN_ID = gql`
	query ImprovementPlanEvaluationByImprovementPlanId($improvementPlanId: Long!) {
		improvementPlanEvaluationByImprovementPlanId(improvementPlanId: $improvementPlanId) {
			data {
				id
				pertinence
				validity
				authenticity
				quality
				judgment
			}
			code
			message
		}
	}
`;

export const ADD_IMPROVEMENT_PLAN_EVALUATION = gql`
	mutation AddImprovementPlanEvaluation($input: ImprovementPlanEvaluationDto) {
		addImprovementPlanEvaluation(input: $input) {
			code
			message
		}
	}
`;

export const UPDATE_IMPROVEMENT_PLAN_EVALUATION = gql`
	mutation UpdateImprovementPlanEvaluation($id: Long!, $input: ImprovementPlanEvaluationDto) {
		updateImprovementPlanEvaluation(id: $id, input: $input) {
			code
			message
		}
	}
`;

export const DELETE_IMPROVEMENT_PLAN_EVALUATION = gql`
	mutation DeleteImprovementPlanEvaluation($id: Long!) {
		deleteImprovementPlanEvaluation(id: $id) {
			code
			message
		}
	}
`;
