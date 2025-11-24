import { gql } from '@apollo/client';

export const GET_ALL_IMPROVEMENT_PLAN_ACTIVITIES = gql`
	query AllImprovementPlanActivities($page: Int, $size: Int, $id: Long) {
		allImprovementPlanActivities(page: $page, size: $size, id: $id) {
			data {
				id
				description
				objectives
				conclusions
				deliveryDate
				evidenceTypes {
					id
					name
				}
				improvementPlanDelivery {
					id
					deliveryFormat
				}
				improvementPlan {
					id
				}
			}
		}
	}
`;

export const ADD_IMPROVEMENT_PLAN_ACTIVITY = gql`
	mutation addImprovementPlanActivity($input: ImprovementPlanActivityDto) {
    addImprovementPlanActivity(input: $input) {
    code
    message
  }
}
`;

export const GET_ALL_IMPROVEMENT_PLAN_EVIDENCE_TYPES = gql`
query AllImprovementPlanEvidenceTypes($page: Int, $size: Int) {
	allImprovementPlanEvidenceTypes(page: $page, size: $size) {
		data {
			id
			name
		}
	}
}
`;

export const GET_ALL_IMPROVEMENT_PLAN_DELIVERIES = gql`
query AllImprovementPlanDeliveries($page: Int, $size: Int) {
	allImprovementPlanDeliveries(page: $page, size: $size) {
		data {
			id
			deliveryFormat
		}
	}
}
`;

export const UPDATE_IMPROVEMENT_PLAN_ACTIVITY = gql`
	mutation updateImprovementPlanActivity($id: Long!, $input: ImprovementPlanActivityDto) {
		updateImprovementPlanActivity(id: $id, input: $input) {
			code
			message
		}
	}
`;

export const DELETE_IMPROVEMENT_PLAN_ACTIVITY = gql`
	mutation deleteImprovementPlanActivity($id: Long!) {
		deleteImprovementPlanActivity(id: $id) {
			code
			message
		}
	}
`;
