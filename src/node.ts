import { NodeAPI, Node as NRNode, NodeDef} from "node-red";

export class Node implements Node {
    protected constructor(RED: NodeAPI, config: NodeDef) {
        RED.nodes.createNode(this, config);
    }
    
    static registerType(RED: NodeAPI, type: string, opts?: any) {
        RED.nodes.registerType(
            type,
            (this as any).prototype.constructor as any,
            opts
        );
    }
}

export interface Node extends NRNode {
}
