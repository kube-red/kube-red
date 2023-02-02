import { NodeDef, NodeAPI } from "node-red";
import { Node, RED } from "../../node";
import { Controller } from "./types";

import * as k8s from '@kubernetes/client-node';
import PayloadType from "../../shared/types";

export interface DeleteProperties extends NodeDef {
    cluster: string;
    apiversion: string;
    kind: string;
    namespace: string;
    name: string;
}

class DeleteNode extends Node {
    cluster: string;
    kc: k8s.KubeConfig;
    apiversion: string;
    kind: string;
    namespace: string;
    name: string;

    constructor(config: DeleteProperties) {
        super(config);
        this.cluster = config.cluster;
        this.apiversion = config.apiversion;
        this.kind = config.kind;
        this.namespace = config.namespace;
        this.name = config.name;

        const configNode = RED.nodes.getNode(config.cluster) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        if (configNode === undefined) {
            this.error("Cluster config not found");
            return;
        }

        const kc = new k8s.KubeConfig();
        kc.loadFromOptions(configNode.k8s);
        this.kc = kc;

        const client = k8s.KubernetesObjectApi.makeApiClient(this.kc);

        this.on("input", async function(msg: PayloadType) {
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

            try {
                const response = await client.delete(spec);
                msg.object = response.body;
                this.send(msg);
                return;
            } catch (e) {
                if (e.body.message ) {
                    this.error(e.body.message);
                    return;
                }
                this.error(e);
            }
        });
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    DeleteNode.registerType(RED, Controller.name);
}
