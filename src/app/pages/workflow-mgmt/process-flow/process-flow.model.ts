import { BaseModel } from "src/app/shared/base.model";

import { Edge, Node, ClusterNode } from '@swimlane/ngx-graph';

export const nodes_1: Node[] = [
    {
        id: 'first',
        label: 'Allowance Approval'
    }, {
        id: 'second',
        label: 'B'
    }, {
        id: 'c1',
        label: 'C1'
    }, {
        id: 'c2',
        label: 'C2'
    }
];

/**Task of workflow รายการของ Node ที่จะแสดงในกราฟ*/
export const nodes: Node[] = [
    { id: 'start', label: 'Start' },
    { id: 'second', label: 'Task 1: Review Request' },
    { id: 'third', label: 'Task 2: Approve Payment' },
    { id: 'fourth', label: 'Task 3: Send Notification' },
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
/**รายการของลิงก์ (edges) ระหว่าง Nodes */
export const links: Edge[] = [
    {
        id: 'a',
        source: 'start',
        target: 'second',
        label: 'Start Review the submitted.'
    }, {
        id: 'b',
        source: 'second',
        target: 'third',
        label: 'Approve the payment.'
    }, {
        id: 'c',
        source: 'third',
        target: 'fourth',
        label: 'Send approval notification.'
    }, {
        id: 'd',
        source: 'fourth',
        target: 'end',
        label: 'custom label d'
    }
    , {
        id: 'e',
        source: 'start',
        target: 'end',
        label: 'Allowance Approval Workflow'
    }
];
