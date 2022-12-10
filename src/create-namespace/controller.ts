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
        if (this.config.sourceType === "flow") {
            kc = this.node.context().flow.get(this.config.sourceClusterName) as k8s.KubeConfig;
        } else {
            kc = this.node.context().global.get(this.config.sourceClusterName) as k8s.KubeConfig;
        }

        if (kc === undefined) {
            this.node.error("Kubeconfig not found");
            return;
        }

        console.log(kc)
        console.log(process.env.ENV_VARIABLE)
        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
        var namespace = new k8s.V1Namespace();
        namespace.metadata = new k8s.V1ObjectMeta();
        if (typeof msg.payload === 'string') {
            namespace.metadata.name = msg.payload;
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
