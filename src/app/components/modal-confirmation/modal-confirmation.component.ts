import { Component, Input, OnInit } from '@angular/core';
import { IonModal, IonButton } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.scss'],
  standalone: true,
  imports: [IonButton, CommonModule],
  providers: [ModalController],
})
export class ModalConfirmationComponent implements OnInit {
  @Input() title: string = '';
  @Input() message: string = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  confirm() {
    this.modalCtrl.dismiss(true);
  }

  cancel() {
    this.modalCtrl.dismiss(false);
  }
}
