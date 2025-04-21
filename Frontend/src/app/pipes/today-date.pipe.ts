import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'todayDate',
  standalone: true
})
export class TodayDatePipe implements PipeTransform {
  transform(format: string = 'fullDate'): string {
    const today = new Date();
    
    switch(format) {
      case 'shortDate':
        return today.toLocaleDateString();
      case 'longDate':
        return today.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      case 'fullDate':
      default:
        return today.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric'
        });
    }
  }
}