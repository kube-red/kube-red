import { NodeAPI, Node as NRNode, NodeDef} from "node-red";

export let RED: NodeAPI;

export class Node implements Node {
    protected constructor(config: NodeDef) {
        RED.nodes.createNode(this, config);
    }
    
    static registerType(red: NodeAPI, type: string, opts?: any) {
        RED = red;
        RED.nodes.registerType(
            type,
            this.prototype.constructor as any,
            opts
        );
    }
}

export interface Node extends NRNode {
}
