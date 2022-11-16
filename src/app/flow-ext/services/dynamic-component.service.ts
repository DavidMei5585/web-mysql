import { Injectable } from '@angular/core';
import { LeaveMainComponent } from '../components/leave-main/leave-main.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentService {
  components: { [key: string]: any } = {
    '001': LeaveMainComponent
  };

  constructor() {}

  getComponent(componentName: string) {
    return this.components[componentName];
  }
}
