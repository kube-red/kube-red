"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LowerCaseController {
    constructor(node, RED, config) {
        node.on('input', this.onInput.bind(this));
        this.node = node;
        this.prefix = config.prefix;
    }
    onInput(msg) {
        if (typeof msg.payload === 'string') {
            msg.payload = this.prefix + msg.payload.toLowerCase();
            this.node.send(msg);
        }
    }
}
// loaded on startup
function default_1(RED) {
    RED.nodes.registerType("lower-case", function (config) {
        // called whenever a new instance of the node is created
        RED.nodes.createNode(this, config);
        new LowerCaseController(this, RED, config);
    });
}
exports.default = default_1;
