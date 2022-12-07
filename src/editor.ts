import { EditorRED } from "node-red";
import ClusterEditorBasic from "./cluster-config-basic/editor";
import LowerCaseEditor from "./lower-case/editor";
import NamespaceEditor from "./namespace/editor";

declare const RED: EditorRED;

// fetch discovered types from the backend,
// and for each type, register a kube node (i.e. deployment, nodes, pods, etc. etc. including CRDs)
// in node-red

// for type := range discoveredTypes {
//     RED.nodes.registerType("pods", PodsEditor);
// }

RED.nodes.registerType("cluster-config-basic", ClusterEditorBasic);
RED.nodes.registerType("lower-case", LowerCaseEditor);
RED.nodes.registerType("namespace", NamespaceEditor);
