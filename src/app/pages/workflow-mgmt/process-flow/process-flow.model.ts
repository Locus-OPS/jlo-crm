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

export const nodes: Node[] = [
    { id: 'first', label: 'Start' },
    { id: 'second', label: 'Task 1: Review' },
    { id: 'fourth', label: 'Task 3: Approval' },
    { id: 'c1', label: 'Task 2: Reject' },
    { id: 'c2', label: 'End' },

];

export const clusters: ClusterNode[] = [
    {
        id: 'third',
        label: 'C',
        childNodeIds: ['c1', 'c2']
    }
    // , {
    //     id: 'fourth',
    //     label: 'fourth',
    //     childNodeIds: ['fourth']
    // }
]

export const links: Edge[] = [
    {
        id: 'a',
        source: 'first',
        target: 'second',
        label: 'is parent of'
    }, {
        id: 'b',
        source: 'first',
        target: 'c1',
        label: 'custom label b'
    }, {
        id: 'c',
        source: 'first',
        target: 'c1',
        label: 'custom label c'
    }, {
        id: 'd',
        source: 'first',
        target: 'c2',
        label: 'custom label d'
    }
    , {
        id: 'e',
        source: 'second',
        target: 'fourth',
        label: 'Review to approval'
    }
];
