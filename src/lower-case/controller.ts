import { NodeDef, NodeAPI, Node, NodeMessageInFlow } from "node-red";

export interface LowerCaseProperties extends NodeDef {
    prefix: string;
}

class LowerCaseController {
    node: Node;
    prefix: string;

    constructor(node: Node, RED: NodeAPI, config: LowerCaseProperties) {
        node.on('input', this.onInput.bind(this));
        this.node = node;
        this.prefix = config.prefix;
    }

    onInput(msg: NodeMessageInFlow) {
        if (typeof msg.payload === 'string') {
            msg.payload = this.prefix + msg.payload.toLowerCase();
            this.node.send(msg);
        }
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    RED.nodes.registerType("lower-case", function(config: LowerCaseProperties) {
        // called whenever a new instance of the node is created
        RED.nodes.createNode(this, config);
        new LowerCaseController(this, RED, config);
    });
}
