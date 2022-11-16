import { Injectable } from '@angular/core';
import 'leader-line';
declare let LeaderLine: any;

/**
 * Leader Line Service
 * @author David
 */
@Injectable({
  providedIn: 'root'
})
export class LineService {
  lines = [];

  draw(items: any[]): void {
    this.clear();

    for (let i = 1; i < items.length; i++) {
      this.lines = [
        ...this.lines,
        new LeaderLine(
          // LeaderLine.pointAnchor(document.getElementById(this.items[i - 1].id), {
          //   x: '100%',
          //   y: '50%'
          // }),
          // LeaderLine.pointAnchor(document.getElementById(this.items[i].id), { x: '5%', y: '50%' }),
          {
            start: document.getElementById(items[i - 1].id),
            end: document.getElementById(items[i].id),
            color: 'rgb(79, 167, 70)',
            startSocket: 'right',
            endSocket: 'left',
            path: 'straight'
          }
        )
      ];

      if (items[i].returnId !== null && items[i].returnId !== '') {
        //draw return line
        this.lines = [
          ...this.lines,
          new LeaderLine(
            LeaderLine.pointAnchor(document.getElementById(items[i].id), {
              x: '50%',
              y: '100%'
            }),
            LeaderLine.pointAnchor(document.getElementById(items[i].returnId), {
              x: '50%',
              y: '100%'
            }),
            {
              // start: document.getElementById(this.items[i].id),
              // end: document.getElementById(this.items[i].returnId),
              startSocket: 'bottom',
              endSocket: 'bottom'
            }
          )
        ];
      }
    }
  }

  clear(): void {
    this.lines.forEach((line) => line.remove());
    this.lines = [];
  }
}
