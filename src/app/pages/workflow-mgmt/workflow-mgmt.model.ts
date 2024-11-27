import { BaseModel } from "src/app/shared/base.model";

export interface WorkflowModel extends BaseModel {
    workflowId: string;
    workflowName: string;
    description?: string;
    status: string;
}

export interface WorkflowBusinessRileModel extends BaseModel {
    ruleId: string;
    workflowId: string;
    conditionType: string;
    conditionValue1?: number;
    conditionValue2?: number;
    priority: string;
    status: string;

}