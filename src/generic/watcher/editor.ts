import { EditorNodeDef, EditorNodeProperties } from "node-red";
import { Controller } from "./types";
import { Controller as ClusterConfigController } from "../../cluster-config/types";

export interface WatcherEditorProperties extends EditorNodeProperties {
    nodename: string;
    cluster: string;
    apiversion: string;
    kind: string;
    namespace: string;
    name: string;
}


const WatcherEditor: EditorNodeDef<WatcherEditorProperties> = {
    category: "kubernetes",
    color: "#326DE6",
    icon: "kubernetes_logo_40x60_white.png",
    align: "left",
    defaults: {
        nodename: { value: "" },
        cluster: { value: "", type: ClusterConfigController.name, required: true },
        apiversion: { value: "" },
        kind: { value: "" },
        namespace: { value: "" },
        name: { value: "" },
    },
    inputs: 0,
    outputs: 1,
    label: function() {
        return this.nodename || Controller.name;
    },
};

export default WatcherEditor;
