import { NodeDef, NodeAPI, NodeMessageInFlow } from "node-red";
import { Node } from "../node";

export interface ClusterConfigProperties extends NodeDef {
    prefix: string;
    clusterName: string;
}

class ClusterConfig extends Node {
    prefix: string;
    clusterName: string;

    constructor(config: ClusterConfigProperties) {
        super(config);

        this.prefix = config.prefix;
        this.clusterName = config.clusterName;
    }

}

// loaded on startup
export default function (RED: NodeAPI) {
    ClusterConfig.registerType(RED, "cluster-config");
}
