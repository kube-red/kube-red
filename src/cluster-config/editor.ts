import { EditorNodeDef, EditorNodeProperties } from 'node-red';

export interface ClusterConfigEditorProperties extends EditorNodeProperties {
    clusterName: string;
}

const ClusterConfigEditor: EditorNodeDef<ClusterConfigEditorProperties> = {
    category: 'config',
    color: '#a6bbcf',
    defaults: {
        name: {value:""},
        clusterName: {value: ""},
    },
    inputs:0,
    outputs:0,
    icon: "file.png",
    oneditsave: Save,
    oneditprepare: Restore,
    label: function() {
        return this.name||"cluster-config";
    }
}

export default ClusterConfigEditor;

function Save() {
    var property = $("#node-input-name")
    this.name = property.val();

    var property = $("#node-input-cluster-name")
    this.clusterName = property.val();
}

function Restore() {
    var property = $("#node-input-name")
    property.val(this.name);

    var property = $("#node-input-cluster-name")
    property.val(this.clusterName);
}
