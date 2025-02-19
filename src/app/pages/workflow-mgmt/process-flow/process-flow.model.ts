import { BaseModel } from "src/app/shared/base.model";

import { Edge, Node, ClusterNode } from '@swimlane/ngx-graph';


/**Task of workflow รายการของ Node ที่จะแสดงในกราฟ*/
export const nodes: Node[] = [

    { id: 'start', label: 'Start' },
    { id: '1', label: 'Start: Review Request' },
    { id: '2', label: 'Approve Payment' },
    { id: '3', label: 'Send Notification' },
    { id: '4', label: 'Validate Invoice' },
    { id: '5', label: 'Issue Payment' },
    { id: 'end', label: 'End' }
];

/*//(ไม่บังคับ) ใช้สำหรับจัดกลุ่มของ Nodes*/
export const clusters: ClusterNode[] = [
    // {
    //     id: 'third',
    //     label: 'C',
    //     childNodeIds: ['c1', 'c2']
    // }

]
/**เส้นรายการของลิงก์ (edges) ระหว่าง Nodes */
export const links: Edge[] = [
    { source: 'start', target: '1', label: 'Next' },
    { source: '1', target: '2', label: 'Next' },
    { source: '2', target: '3', label: 'Next' },
    { source: '3', target: '4', label: 'Next' },
    { source: '4', target: '5', label: 'Next' },
    { id: 'end', source: '5', target: 'end', label: 'Next' },
    { id: 'summary', source: 'start', target: 'end', label: 'Locus Approval workflow for travel allowance requests' }
];


export interface WorkflowTracking {
    trackingId: number;
    transactionId: number;
    workflowId: number;
    taskId: number;
    assignmentId: number;
    systemId: number;
    eventType: string;
    status: string;
    timestamp: string;
    notes?: string;
}

/*
การออกแบบระบบให้รองรับการติดตาม สถานะระดับ Transaction และ ระบบที่เชื่อมโยงหลายระบบ ควรพิจารณา:

1.เพิ่มฟิลด์ SYSTEM_ID เพื่อแยกระบบที่เรียกใช้งาน
2.บันทึกทุกการเปลี่ยนแปลงสถานะของแต่ละขั้นตอน
3.ใช้ API หรือ Integration ในการส่งข้อมูลจากระบบต่าง ๆ มาบันทึกใน tb_workflow_tracking
*/
