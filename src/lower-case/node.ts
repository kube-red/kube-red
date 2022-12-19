import { NodeDef, NodeAPI, NodeMessageInFlow } from "node-red";
import { Node, RED } from "../node";


export interface LowerCaseProperties extends NodeDef {
    prefix: string;
    cluster: string;
}
class LowerCase extends Node {
    prefix: string;
    cluster: string;
    configNode: any;

    constructor(config: LowerCaseProperties) {
        super(config);
        this.cluster = config.cluster;

        this.configNode = RED.nodes.getNode(config.cluster);

        this.prefix = config.prefix;
        this.on('input', this.onInput);
    }

    onInput(msg: NodeMessageInFlow) {
        console.log(this.configNode.clusterName)
        if (typeof msg.payload === 'string') {
            msg.payload = this.prefix + msg.payload.toLowerCase();
            this.send(msg);
        }
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    LowerCase.registerType(RED, "lower-case");
}
