export interface ClusterConfig {
    incluster: boolean;
    server: string;
    user: string;
    password: string;
}

const defaultClusterConfig: ClusterConfig = {
    incluster: true,
    server: "https://api.server:8443",
    user: "cluster-admin",
    password: "",
}

export const Controller = {
    name: "cluster-config",
    defaults: defaultClusterConfig,
}

export default ClusterConfig;

