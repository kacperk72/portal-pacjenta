import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
  standalone: true,
})
export class TimePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    const parts = value.split(':');
    if (parts.length < 2) return value; // oryginalna wartość jeśli coś jest nie tak

    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    return `${hours}:${minutes}`;
  }
}
