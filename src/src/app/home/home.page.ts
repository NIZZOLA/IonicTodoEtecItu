import { Component } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ToastController,
} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tasks: any[] = []; // cria-se uma lista (array) de objetos
  constructor(
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.loadStorage();
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK'],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async ShowAdd() {
    const alert = await this.alertCtrl.create({
      header: 'O que deseja fazer ?',
      inputs: [
        {
          name: 'taskToDo',
          type: 'text',
          placeholder: 'digite aqui a tarefa',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('clicked cancel');
          },
        },
        {
          text: 'Adicionar',
          handler: (form) => {
            console.log(form.taskToDo);
            // debugger;
            this.Add(form.taskToDo);
          },
        },
      ],
    });
    await alert.present();
  }

  async Add(newTask: string) {
    // valida se usuário preencheu task
    if (newTask.trim().length < 1) {
      const toast = await this.toastCtrl.create({
        message: 'preencha com informações válidas !',
        duration: 2000,
        position: 'top',
      });

      toast.present();
      return;
    }

    let task = { name: newTask, done: false };
    this.tasks.push(task);
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    localStorage.setItem('taskDb', JSON.stringify(this.tasks));
  }

  loadStorage() {
    let taskJson = localStorage.getItem('taskDb');
    console.log(taskJson);
    if (taskJson) {
      this.tasks = JSON.parse(taskJson);
    }
  }

  async openActions(task: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'O QUE DESEJA FAZER ?',
      buttons: [
        {
          text: task.done ? 'Desmarcar' : 'Marcar',
          icon: task.done ? 'radio-button-off' : 'checkmark-circle',
          handler: () => {
            task.done = !task.done;
            this.updateLocalStorage();
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async delete(task: any) {
    this.tasks = this.tasks.filter((taskArray) => taskArray != task);
    this.updateLocalStorage();
  }
}
