import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
  standalone: true,
})
export class TimePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    // Rozdzielamy godzinę od minuty i sekundy
    const parts = value.split(':');
    if (parts.length < 2) return value; // Zwracamy oryginalną wartość jeśli coś jest nie tak

    // Pobieramy godziny i minuty
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    // Zwracamy format "h:mm"
    return `${hours}:${minutes}`;
  }
}
