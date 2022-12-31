import { NodeDef, NodeAPI,  NodeMessageInFlow } from "node-red";
import { Node, RED } from "../../node";
import { Controller } from "./types";
import PayloadType from "../../shared/types";

import * as k8s from '@kubernetes/client-node';

export interface UpdateProperties extends NodeDef {
    cluster: string;
}

class UpdateNode extends Node {
    cluster: string;
    action: string;
    kc: k8s.KubeConfig;

    constructor(config: UpdateProperties) {
        super(config);
        this.cluster = config.cluster;

        let configNode: any
        configNode = RED.nodes.getNode(config.cluster);
        if (configNode === undefined) {
            this.error("Cluster config not found");
            return;
        }

        var kc = new k8s.KubeConfig();
        kc.loadFromOptions(configNode.k8s);
        this.kc = kc;

        this.on("input", async function(msg: PayloadType,send,done) {
            let client = k8s.KubernetesObjectApi.makeApiClient(this.kc);
            let spec: k8s.KubernetesObject = {};

            spec = msg.object || {};
            spec.metadata = spec.metadata || {};

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
                const responseList = await client.list(spec.apiVersion,spec.kind, spec.metadata.namespace);
                for (const item of responseList.body.items) {
                    if (item.metadata.name === spec.metadata.name) {

                        const response = await client.patch(spec);
                        msg.object = response.body
                        this.send(msg);

                        return;
                    }
                }
                // else if not patched, just send original message
                this.send(msg);
            } catch (e) {
                this.send(e);
            }
        });
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    UpdateNode.registerType(RED, Controller.name);
}
