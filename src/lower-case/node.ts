import { NodeDef, NodeAPI, NodeMessageInFlow } from "node-red";
import { Node } from "../node";

export interface LowerCaseProperties extends NodeDef {
    prefix: string;
}

class LowerCase extends Node {
    prefix: string;

    constructor(config: LowerCaseProperties) {
        super(config);

        this.prefix = config.prefix;
        this.on('input', this.onInput);
    }

    onInput(msg: NodeMessageInFlow) {
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
