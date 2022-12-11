import { NodeDef, NodeAPI, Node, NodeMessageInFlow } from "node-red";
import * as k8s from '@kubernetes/client-node';
import {NamespaceConfig, Controller} from "./types";

export interface NamespaceProperties extends NodeDef {
    config: NamespaceConfig;
}

class NamespaceController {
    node: Node;
    config: NamespaceConfig;
    kc: k8s.KubeConfig;

    constructor(node: Node, RED: NodeAPI, config: NamespaceProperties) {
        this.node = node;
        this.config = config.config;

        node.on('input', this.onInput.bind(this));
    }

    onInput(msg: NodeMessageInFlow) {
        var kc = new k8s.KubeConfig();
        kc = this.node.context().global.get(this.config.sourceClusterName) as k8s.KubeConfig;
        if (kc === undefined) {
            this.node.error("Kubeconfig not found");
            return;
        }

        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
        if (typeof msg.payload === 'string') {
            namespace.metadata.name = msg.payload;
            var namespace = new k8s.V1Namespace();
            namespace.metadata = new k8s.V1ObjectMeta();
        }

        k8sApi.createNamespace(namespace).then((res) => {
            this.node.send({payload: res.body});
        }
        ).catch((err) => {
            this.node.error(JSON.stringify(err))
        });
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    RED.nodes.registerType(Controller.name, function(config: NamespaceProperties) {
        RED.nodes.createNode(this, config);
        new NamespaceController(this, RED, config);
    });
}
