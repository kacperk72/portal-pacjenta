import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { MatIconModule } from '@angular/material/icon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ai-doctor',
  standalone: true,
  imports: [
    TabViewModule,
    MatIconModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
  ],
  templateUrl: './ai-doctor.component.html',
  styleUrl: './ai-doctor.component.css',
})
export class AiDoctorComponent {
  description: string = '';
  aiResponseSick: string =
    'Według twoich objawów masz przeziębienie, zaleca się wzięcie paracetamolu i pozostanie w domu przez 3 dni';
  aiResponseHealth =
    'Według twoich parametrów twój wskaźnik BMI wynosi ..., zaleca się zwiększenie aktywności i zdrowszą dietę. Zaleca się ograniczenie spożycia tłuszczy nasyconych oraz zwiększony udział warzyw w diecie';
  userParams = {
    gender: '',
    age: '0',
    weight: '0',
  };

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        // Tutaj masz dostęp do zawartości pliku jako fileReader.result
        console.log(fileReader.result);
        // Możesz dalej przetwarzać zawartość pliku, jak potrzebujesz
      };

      fileReader.readAsText(file); // Czytanie pliku jako tekst
    }
  }
}
