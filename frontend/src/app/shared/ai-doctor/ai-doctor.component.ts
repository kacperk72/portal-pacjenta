import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { MatIconModule } from '@angular/material/icon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChatService } from '../../core/chat.service';

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
export class AiDoctorComponent implements OnInit {
  userSymptomsDescription: string = '';
  prompt1: string = 'Na podastawie podanych objawów zaproponuj leczenie: ';
  aiResponseSick: string = '';

  prompt2: string =
    'Na podastawie podanych parametrów pacjenta podaj zalecenia aby żyć w zdrowiu i minimalizować ryzyko chorób. Wylicz również wskaźnik BMI.';
  aiResponseHealth = '';
  userParams = {
    gender: '',
    age: 0,
    weight: 0,
  };

  prompt3: string =
    'Na podstawie podanych lekarstw i dawkowania, spróbuj wskazać czy występują pomiędzy nimi jakieś niebezpieczne związki lub interakcje.';
  aiResponseMedicines: string = '';
  userMedicineDescription: string = '';

  emptyError: boolean = false;
  formError: boolean = false;
  isLoading: boolean = false;

  constructor(private chatService: ChatService) {}

  ngOnInit() {}

  sendPrompt(type: string) {
    switch (type) {
      case 'Symptoms':
        if (this.userSymptomsDescription != '') {
          this.isLoading = true;
          this.chatService
            .sendMessage(this.prompt1 + this.userSymptomsDescription)
            .subscribe((data: any) => {
              console.log(data);
              this.aiResponseSick = data.response.content;
              this.isLoading = false;
            });
        } else {
          this.emptyError = true;
        }
        break;
      case 'Params':
        if (
          this.userParams.gender.length > 0 &&
          this.userParams.age > 0 &&
          this.userParams.weight > 0
        ) {
          this.isLoading = true;
          const params = `Płeć: ${this.userParams.gender}, Wiek ${this.userParams.age}, Waga ${this.userParams.weight}`;
          this.chatService
            .sendMessage(this.prompt2 + params)
            .subscribe((data: any) => {
              console.log(data);
              this.aiResponseHealth = data.response.content;
              this.isLoading = false;
            });
        } else {
          this.formError = true;
        }
        break;
      case 'Medicines':
        if (this.userMedicineDescription != '') {
          this.isLoading = true;
          this.chatService
            .sendMessage(this.prompt3 + this.userMedicineDescription)
            .subscribe((data: any) => {
              console.log(data);
              this.aiResponseMedicines = data.response.content;
              this.isLoading = false;
            });
        } else {
          this.emptyError = true;
        }
        break;
    }
  }

  descriptionChange() {
    if (this.userSymptomsDescription != '') {
      this.emptyError = false;
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        console.log(fileReader.result);
      };

      fileReader.readAsText(file);
    }
  }
}
