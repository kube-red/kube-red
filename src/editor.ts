import { EditorRED } from "node-red";
import ClusterConfigEditor from "./cluster-config/editor";
import NamespaceEditor from "./namespace/editor";
import ConfigMapEditor from "./configmap/editor";

declare const RED: EditorRED;

// fetch discovered types from the backend,
// and for each type, register a kube node (i.e. deployment, nodes, pods, etc. etc. including CRDs)
// in node-red

// for type := range discoveredTypes {
//     RED.nodes.registerType("pods", PodsEditor);
// }

RED.nodes.registerType("cluster-config", ClusterConfigEditor)
RED.nodes.registerType("namespace", NamespaceEditor)
RED.nodes.registerType("configmap", ConfigMapEditor)

