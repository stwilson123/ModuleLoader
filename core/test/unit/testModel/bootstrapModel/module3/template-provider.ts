import { ITemplateProvider, TemplateResult } from "@/interface"

export class LayoutTemplateProvider extends ITemplateProvider {
    public getTemplate(): TemplateResult[] {
        return [{
            name: "layout",
            path: "/layout",
            
        }];
    }
}