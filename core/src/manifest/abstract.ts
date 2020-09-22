import { IDependency } from "./../core/abstract";
class IManifestProvider extends IDependency {
    buildManifests(builder: ResourceManifestBuilder) {
        throw new Error("buildManifests is not implemented.")
    }
}

class ResourceManifest {
    resources: ResourceDefinition[] = [];
    defineResource(resourceType: string, resourceName: string) {
        let manifest = new ResourceDefinition(resourceType, resourceName);
        this.resources.push(manifest)
        return manifest;
    }
}

class ResourceDefinition {
    resourceType: string;
    resourceName: string;
    public resource: any;
    constructor(resourceType: string, resourceName: string) {
        this.resourceName = resourceName;
        this.resourceType = resourceType;
    }

    add(resource: any) {
        this.resource = resource;
    }
}
class ResourceManifestBuilder {
    resourceManifests: ResourceManifest[] = [];
    add(): ResourceManifest {
        let manifest = new ResourceManifest();
        this.resourceManifests.push(manifest)
        return manifest;
    }
}

interface IResourceManager {
    getResources(): Map<string, Map<string, ResourceDefinition>>;
    getResource(moduleName:string,resourceType: string, resourceName: string):ResourceDefinition|undefined;
    buildResource(): void;
}


let getResourceKey = (resourceType: string, resourceName: string) =>
resourceType + "-" + resourceName;
export { IManifestProvider, ResourceManifestBuilder, IResourceManager, ResourceDefinition,getResourceKey }