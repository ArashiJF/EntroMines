import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let minutes = value / 60;
    let hours = minutes / 60;
    const seconds = Math.trunc((minutes - Math.floor(minutes)) * 60);
    hours = Math.trunc(hours);
    minutes = Math.trunc(minutes);
    return hours > 0 ?
      (hours > 9 ? hours.toString() : '0' + hours.toString()) + ':' +
        (minutes > 9 ? minutes.toString() : '0' + minutes.toString()) + ':' +
        (seconds > 9 ? seconds.toString() : '0' + seconds.toString()) :
      (minutes > 9 ? minutes.toString() : '0' + minutes.toString()) + ':' +
        (seconds > 9 ? seconds.toString() : '0' + seconds.toString());
  }

}
