import { NodeDef, NodeAPI, NodeMessageInFlow } from "node-red";
import { Node } from "../node";

export interface LowerCaseProperties extends NodeDef {
    prefix: string;
}

class LowerCase extends Node {
    prefix: string;

    constructor(RED: NodeAPI, config: LowerCaseProperties) {
        super(RED, config);

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
    class LowerCaseWrapper extends LowerCase {
		constructor(config: LowerCaseProperties) {
			super(RED, config);
		}
	}

    LowerCaseWrapper.registerType(RED, "lower-case");
}
