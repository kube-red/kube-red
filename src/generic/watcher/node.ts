import { NodeDef, NodeAPI } from "node-red";
import { Node, RED } from "../../node";
import { Controller } from "./types";

import * as k8s from "@kubernetes/client-node";
import PayloadType from "../../shared/types";
import * as utils from "../../shared/status";

export interface WatcherProperties extends NodeDef {
    cluster: string;
    apiversion: string;
    kind: string;
    namespace: string;
    name: string;
}

type StartupFunction = () => void;

class WatcherNode extends Node {
    cluster: string;
    kc: k8s.KubeConfig;
    apiversion: string;
    kind: string;
    namespace: string;
    name: string;
    start: StartupFunction;

    constructor(config: WatcherProperties) {
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
        const watch = new k8s.Watch(kc);

        if (this.kind === undefined) {
            this.error("Must specify kind");
            return;
        }
        if (this.apiversion === undefined) {
            this.error("Must specify apiVersion");
        }

        let watchEndpoint = `/api/${this.apiversion}/${this.kind}`;
        if (this.namespace) {
            watchEndpoint = `api/${this.apiversion}/namespaces/${this.namespace}/${this.kind}`;
        }
        if (this.name) {
            watchEndpoint = `api/${this.apiversion}/namespaces/${this.namespace}/${this.kind}/${this.name}`;
        }

        WatcherNode.prototype.start = function() {
            watch.watch(watchEndpoint, { allowWatchBookmarks: true, }, (type: string, apiObj: k8s.KubernetesObject) => {
                const msg: PayloadType = {_msgid: ""}; // Node will generate new ID and we need value for typescript.

                if (type === "ADDED") {
                    msg.watchEventType = "ADDED";
                } else if (type === "MODIFIED") {
                    msg.watchEventType = "MODIFIED";
                } else if (type === "DELETED") {
                    msg.watchEventType = "DELETED";
                } else if (type === "BOOKMARK") {
                    msg.watchEventType = "BOOKMARK";
                } else {
                    this.error("Unknown watch event type: " + type);
                }
                msg.object = apiObj;
                this.send(msg);
            }, (e) => {
                this.status(utils.getErrorStatus(e));

                if (e.body && e.body.message) {
                    this.error(e.body && e.body.message);
                    return;
                }
                this.error(e);
            });
        };

        this.start();
    }
}

// loaded on startup
export default function (RED: NodeAPI) {
    WatcherNode.registerType(RED, Controller.name);
}
