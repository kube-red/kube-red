import { NodeDef, NodeAPI,  NodeMessageInFlow } from "node-red";
import { Node, RED } from "../node";
import {Controller} from "./types";

import * as k8s from '@kubernetes/client-node';

export interface NamespaceProperties extends NodeDef {
    cluster: string;
    action: string;
}

class NamespaceNode extends Node {
    cluster: string;
    action: string;
    configNode: any;

    constructor(config: NamespaceProperties) {
        super(config);
        this.cluster = config.cluster;
        this.action = config.action;
        this.configNode = RED.nodes.getNode(config.cluster);

        if (this.configNode === undefined) {
            this.error("Cluster config not found");
            return;
        }

        this.on('input', this.onInput);
    }

    onInput(msg: NodeMessageInFlow) {
        var kc = new k8s.KubeConfig();
        kc.loadFromOptions(this.configNode.k8s);

        const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

        // generic object for actions
        var namespace = new k8s.V1Namespace();
        switch (typeof msg.payload) {
            case 'string':
                namespace.metadata = new k8s.V1ObjectMeta();
                namespace.metadata.name = msg.payload;
                break;
            case 'object':
                namespace = msg.payload;
                break;
            default:
                this.error("Invalid payload type");
        }

        // switch based on action
        let fn = null;
        switch (this.action) {
            case "create":
                fn = k8sApi.createNamespace(namespace)
                break;
            case "delete":
                fn =  k8sApi.deleteNamespace(namespace.metadata.name)
                break;
            case "get":
                fn = k8sApi.readNamespace(namespace.metadata.name)
                break;
            case "list":
                fn = k8sApi.listNamespace()
                break;
            case "patch":
                fn = k8sApi.patchNamespace(namespace.metadata.name, namespace)
                break;
            case "update":
                fn = k8sApi.replaceNamespace(namespace.metadata.name, namespace)
            default:
                this.error("Invalid action");
        }

        fn.then((res) => {
            this.send({payload: res.body});
        }).catch((err) => {
            this.error(JSON.stringify(err))
        });
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    NamespaceNode.registerType(RED, Controller.name);
}
