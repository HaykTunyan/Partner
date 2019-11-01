import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    } else {
      args = args.toLowerCase();
      return value.filter(function (el: any) {
        return el.name.toLowerCase().indexOf(args) > -1;
      });
    }
  }

}
