import { Component } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ToastController,
} from '@ionic/angular';
import { TaskToDoService } from '../api/task-to-do.service';
import { TaskToDo } from '../model/task-to-do';

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
    private actionSheetCtrl: ActionSheetController,
    private taskApi: TaskToDoService
  ) {
    //this.loadStorage();
    this.loadApi();
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

    let task = new TaskToDo();
    task.nome = newTask;
    task.active = true;

    this.taskApi.post(newTask);

    this.tasks.push(task);
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

  loadApi() {
    this.taskApi.getAll()
    .then((json) => {
      // TRANSFORMAR EM UMA COLEÇÃO E COLOCAR NO TASKS
      this.tasks = <TaskToDo[]>json;
    })
    .catch((erro) => {
      console.log("Api indisponivel !" + erro );
    })
  }

  async openActions(task: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'O QUE DESEJA FAZER ?',
      buttons: [
        {
          text: task.active ? 'Desmarcar' : 'Marcar',
          icon: task.active ? 'radio-button-off' : 'checkmark-circle',
          handler: () => {
            task.active = !task.active;
            this.taskApi.put(task.id, task);
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

    this.taskApi.delete(task.id);
    this.tasks = this.tasks.filter((taskArray) => taskArray != task);
  }
}
