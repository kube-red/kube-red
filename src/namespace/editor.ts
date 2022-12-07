import { EditorNodeDef, EditorNodeProperties } from 'node-red';
import NamespaceConfig from './types';

export interface NamespaceEditorProperties extends EditorNodeProperties {
    name: string;
    active: boolean;
    config: NamespaceConfig;
}

const defaultNamespaceConfig: NamespaceConfig = {
    type: "flow", // Type is either flow or global
    typeValue: "", // Name is used as the context name

    namespacename: "",
}


const NamespaceEditor: EditorNodeDef<NamespaceEditorProperties> = {
    category: 'function',
    color: '#a6bbcf',
    defaults: {
        name: {value:""},
        active: {value:true},
        config: {value: defaultNamespaceConfig},
    },
    inputs:1,
    outputs:1,
    icon: "file.png",
    label: function() {
        return this.name||"namespace";
    },
    oneditprepare: function() {
        $('#node-input-clustername').typedInput({
            types: ['flow','global'],
        })
    },
    oneditsave: function() {
        var property = $("#node-input-clustername");
        var node = this;
        node.config.type = property.find(".node-input-clustername-property-type").typedInput('type');
        node.config.typeValue = property.find(".node-input-clustername-property-type").typedInput('value');
        console.log("node"+node.config)
    },
}

export default NamespaceEditor;
