import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true,
})
export class DatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    const date = new Date(value);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth zwraca miesiące od 0 (styczeń = 0)
    const year = date.getFullYear();

    return `${day}.${month}.${year}`; // Format DD.MM.YYYY
  }
}
