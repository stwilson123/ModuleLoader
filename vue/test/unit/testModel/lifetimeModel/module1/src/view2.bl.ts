import { Controller, Component } from "@/interface";


@Component({name:"123"})
export default class view2 extends Controller
{
    lifetime = 0;

    viewDidEnter()
    {
        this.lifetime = 2;
    }


    viewWillEnter()
    {
        this.lifetime = 1;
    }
}