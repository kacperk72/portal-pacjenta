import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '../date.pipe';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css',
  imports: [DatePipe],
})
export class ConfirmModalComponent {
  @Input() visit: any;

  constructor(public activeModal: NgbActiveModal) {}

  confirmVisit() {
    this.activeModal.close('confirmed');
  }

  cancel() {
    this.activeModal.dismiss('cancelled');
  }
}
