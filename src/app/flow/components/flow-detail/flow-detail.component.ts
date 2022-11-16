import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs';
import { DynamicComponentDirective } from 'src/app/flow-ext/directives/dynamic-component.directive';
import { DynamicComponentService } from 'src/app/flow-ext/services/dynamic-component.service';
import { FlowService } from 'src/app/flow/services/flow.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-flow-detail',
  templateUrl: './flow-detail.component.html',
  styleUrls: ['./flow-detail.component.scss']
})
export class FlowDetailComponent implements OnInit, OnDestroy {
  @ViewChild(DynamicComponentDirective, { static: true }) componentHost!: DynamicComponentDirective;
  @Output() hide = new EventEmitter<boolean>();
  @Input() todo: any;
  @Input() typeCodes: any[] = [];
  @Input() deptCodes: any[] = [];
  @Input() statusCodes: any[] = [];
  @Input() actionCodes: any[] = [];
  submit = false;
  subs = new SubSink();
  records$: Observable<any> = new Observable<any>();
  current$: Observable<any> = new Observable<any>();

  constructor(
    private flowService: FlowService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private dynamicComponentService: DynamicComponentService
  ) {}

  ngOnInit() {
    this.records$ = this.flowService.getFlowRecord(this.todo.flowId);
    this.current$ = this.flowService.getFlowCurrent(this.todo.flowId);

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.dynamicComponentService.getComponent(this.todo.flowType)
    );

    const viewContainerRef = this.componentHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef: any = viewContainerRef.createComponent(componentFactory);
    componentRef.instance.flowId = this.todo.flowId;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  hideModal() {
    this.submit = false;
    this.hide.emit(true);
  }
}
