import { EditorNodeDef, EditorNodeProperties } from 'node-red';

export interface LowerCaseEditorProperties extends EditorNodeProperties {
    prefix: string;
    cluster: string;
}

const LowerCaseEditor: EditorNodeDef<LowerCaseEditorProperties> = {
    category: 'function',
    color: '#a6bbcf',
    defaults: {
        name: {value:""},
        cluster: {value: "", type: "cluster-config"},
        prefix: {value: ""}
    },
    inputs:1,
    outputs:1,
    icon: "file.png",
    label: function() {
        return this.name||"lower-case";
    }
}

export default LowerCaseEditor;
