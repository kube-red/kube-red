import { EditorNodeDef, EditorNodeProperties } from 'node-red';
import { ClusterConfigProperties } from "../cluster-config/controller";

export interface NamespacesEditorProperties extends EditorNodeProperties {
    cluster: ClusterConfigProperties;
    labels: string[];
    name: string;

}

const NamespacesEditor: EditorNodeDef<NamespacesEditorProperties> = {
    category: 'function',
    color: '#a6bbcf',
    defaults: {
        cluster: {type: "cluster-config", value: ""},
        name: {value: ""},
        labels: {value: []},
    },
    inputs:1,
    outputs:1,
    icon: "file.png",
    label: function() {
        return this.name||"namespace-function";
    }
}

export default NamespacesEditor;
