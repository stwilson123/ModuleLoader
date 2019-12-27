import { IManifestProvider, ResourceManifestBuilder } from "@/manifest/abstract";

export class manifestProvidr extends IManifestProvider {
    buildManifests(builder: ResourceManifestBuilder) {
        let builderAdd = builder.add();
        builderAdd.defineResource("component","testResource").add(import("../module2/src/view2"))
    }
}