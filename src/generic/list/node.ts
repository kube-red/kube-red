import { NodeDef, NodeAPI,  NodeMessageInFlow } from "node-red";
import { Node, RED } from "../../node";
import { Controller } from "./types";

import * as k8s from '@kubernetes/client-node';
import PayloadType from "../../shared/types";

export interface ListProperties extends NodeDef {
    cluster: string;
    apiversion: string;
    kind: string;
    namespace: string;
    name: string;
}

class ListNode extends Node {
    cluster: string;
    kc: k8s.KubeConfig;
    apiversion: string;
    kind: string;
    namespace: string;
    name: string;

    constructor(config: ListProperties) {
        super(config);
        this.cluster = config.cluster;
        this.apiversion = config.apiversion;
        this.kind = config.kind;
        this.namespace = config.namespace;
        this.name = config.name;

        let configNode: any
        configNode = RED.nodes.getNode(config.cluster);
        if (configNode === undefined) {
            this.error("Cluster config not found");
            return;
        }

        var kc = new k8s.KubeConfig();
        kc.loadFromOptions(configNode.k8s);
        this.kc = kc;

        let client = k8s.KubernetesObjectApi.makeApiClient(this.kc);

        this.on("input", async function(msg: PayloadType,send,done) {

            let spec: k8s.KubernetesObject = {};

            spec = msg.object || {};
            spec.metadata = spec.metadata || {};


            if (!spec.kind) {
                spec.kind = this.kind;
            }
            if (!spec.apiVersion) {
                spec.apiVersion = this.apiversion;
            }
            if (!spec.metadata.namespace) {
                spec.metadata.namespace = this.namespace;
            }
            if (!spec.metadata.name) {
                spec.metadata.name = this.name
            }

            if (spec.kind === undefined) {
                this.error("Must specify kind");
                return;
            }
            if (spec.apiVersion === undefined) {
                this.error("Must specify apiVersion");
                return;
            }
            if (spec.metadata.name === undefined) {
                this.error("Must specify metadata.name");
                return;
            }

            // DIRTY HACK: Kube hangs on await if object does not exist. So list
            // all objects of the same kind and check if the object exists.
            // TODO: Find a better way to check if object exists amd why it hangs
            try {
                const response = await client.list(spec.apiVersion,spec.kind);
                msg.object = response.body;
                send(msg);
                return;
            } catch (e) {
                    this.error(e);
            }
        });
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    ListNode.registerType(RED, Controller.name);
}
