import { NodeDef, NodeAPI } from "node-red";
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
                        msg.object = item;
                        this.send(msg);
                        return;
                    }
                }
                // if not found - create
                const responseCreate = await client.create(spec);
                msg.object = responseCreate.body
                this.send(msg);
                return;
            } catch (e) {
                this.error(e);
            }
        });
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    CreateNode.registerType(RED, Controller.name);
}
