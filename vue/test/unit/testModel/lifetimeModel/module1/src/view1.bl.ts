import { Controller, Component } from "@/interface";


@Component
export default class view1 extends Controller
{
    lifetime = 0;
    public testProperty = this.getBlocks();

    viewDidEnter()
    {
        this.lifetime = 2;
    }

    getBlocks()
    {
        return this.blocksShell;
    }

    viewWillEnter()
    {
        this.lifetime = 1;
    }
}