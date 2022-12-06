import { EditorNodeDef, EditorNodeProperties } from 'node-red';
import { ClusterConfigProperties } from '../cluster-config/controller';

export interface NamespaceEditorProperties extends EditorNodeProperties {
    namespacename: string;
    cluster: ClusterConfigProperties;
}

const NamespaceEditor: EditorNodeDef<NamespaceEditorProperties> = {
    category: 'function',
    color: '#a6bbcf',
    defaults: {
        cluster: {type: "cluster-config", value: ""},
        name: {value:""},
        namespacename: {value: "default"}
    },
    inputs:1,
    outputs:1,
    icon: "file.png",
    label: function() {
        return this.name||"namespace";
    }
}

export default NamespaceEditor;
