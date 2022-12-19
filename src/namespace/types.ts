export interface NamespaceConfig {
    action: string;
}

// TODO: Watch is not implemented yet
export const actions = ["create", "delete", "list", "get", "patch"];

export const Controller = {
    name: "namespace",
    actions: actions,
};

export default NamespaceConfig;

