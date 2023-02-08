import { NodeAPI, Node as NRNode, NodeDef } from "node-red";

export let RED: NodeAPI;

export class Node implements Node {
    protected constructor(config: NodeDef) {
        RED.nodes.createNode(this, config);
    }

    static registerType(node: NodeAPI, type: string, opts?: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        RED = node;
        RED.nodes.registerType(
            type,
            this.prototype.constructor as any, // eslint-disable-line @typescript-eslint/no-explicit-any
            opts
        );
    }
}

export interface Node extends NRNode {} // eslint-disable-line @typescript-eslint/no-empty-interface
