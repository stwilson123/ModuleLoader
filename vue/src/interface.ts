
import { Component } from './component';

import { Controller } from './controller';

import { Watch, Prop } from 'vue-property-decorator';
import { SpecialInject, InjectCore } from "./ioc/iocRegister";
import { asyncCompatible } from "./utility/asyncCompatible";
export {
    Controller, Component, Prop, Watch, SpecialInject, InjectCore, asyncCompatible
}
