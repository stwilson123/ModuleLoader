import { IResourceManager, ResourceDefinition, IManifestProvider, ResourceManifestBuilder,getResourceKey } from "./abstract";
import { Types } from "@/Types";
import { inject, multiInject } from "@/ioc/iocManager";
import { IBlocksShell, } from "@/core/abstract";
export class resourceManager implements IResourceManager {
 
    constructor(@inject(Types.IBlocksShell) blocksShell: IBlocksShell, @multiInject(Types.IManifestProvider) manifestProviders: IManifestProvider[]) {
        this.resources = new Map<string, Map<string, ResourceDefinition>>();
        this.blocksShell = blocksShell;
        this.manifestProviders = manifestProviders;
    }
    resources: Map<string, Map<string, ResourceDefinition>>;
    blocksShell: IBlocksShell;
    manifestProviders: IManifestProvider[];

    getResources(): Map<string, Map<string, ResourceDefinition>> {
        if (this.resources.size === 0)
            this.buildResource();
        return this.resources;
    }
    getResource(moduleName: string, resourceType: string, resourceName: string): ResourceDefinition|undefined {

        let moduleResource = this.getResources().get(moduleName);
        if (!moduleResource || !moduleResource.has(getResourceKey(resourceType, resourceName))) {
            throw new Error(`Can not found resourceType:${resourceType}, resourceName:${resourceName} in resources.`)
        }
        return moduleResource.get(getResourceKey(resourceType, resourceName));
    }

    buildResource(): void {
        for (const manifestProvider of this.manifestProviders) {
            let builder = new ResourceManifestBuilder();
            manifestProvider.buildManifests(builder);
            let moduleName = this.blocksShell.typeMapModuleName.get(manifestProvider.constructor);
            if (moduleName === undefined)
                throw new Error(`${manifestProvider.constructor} can not found moduleName.`)
            if (!this.resources.has(moduleName))
                this.resources.set(moduleName, new Map());
            for (const manifest of builder.resourceManifests) {
                for (const resource of manifest.resources) {
                    let resourceNameMap = this.resources.get(moduleName);
                    if (resourceNameMap)
                        resourceNameMap.set(getResourceKey(resource.resourceType, resource.resourceName), resource);
                }

            }

        }
    }


}

class resourceKey {
    public resourceName = "";
    public resourceType = ""
}