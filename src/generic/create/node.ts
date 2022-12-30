import { NodeDef, NodeAPI,  NodeMessageInFlow } from "node-red";
import { Node, RED } from "../../node";
import { Controller } from "./types";
import PayloadType from "../../shared/types";

import * as k8s from '@kubernetes/client-node';

export interface CreateProperties extends NodeDef {
    cluster: string;
}

class CreateNode extends Node {
    cluster: string;
    action: string;
    kc: k8s.KubeConfig;

    constructor(config: CreateProperties) {
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
                // try to get the resource, if it does not exist an error will be thrown and we will end up in the catch
                // block.

                const response = await client.read({ kind: spec.kind, apiVersion: spec.apiVersion, metadata: {name:spec.metadata.name, namespace: spec.metadata.namespace}});
                // we got the resource, so it exists, so just send it back
                msg.object = response.body
                this.send(msg);
            } catch (e) {
                // we did not get the resource, so it does not exist, so create it
                try {
                    const response = await client.create(spec);
                    msg.object = response.body
                    this.send(msg);
                } catch (e) {
                    this.error(e);
                }
            }
        });
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    CreateNode.registerType(RED, Controller.name);
}
