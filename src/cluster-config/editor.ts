import { EditorNodeDef, EditorNodeProperties } from 'node-red';

export interface ClusterConfigEditorProperties extends EditorNodeProperties {
    incluster: boolean;
    name: string;
    server: string;
    user: string;
    password: string;
}

const ClusterConfigEditor: EditorNodeDef<ClusterConfigEditorProperties> = {
    category: 'config',
    color: '#a6bbcc',
    defaults: {
        incluster: {value: false},
        name: {value: ""},
        server: {value: ""},
        user: {value: ""},
        password: {value: ""},
    },
    inputs:0,
    outputs:1,
    icon: "file.png",
    label: function() {
        return this.name||"cluster-config";
    }
}

export default ClusterConfigEditor;
