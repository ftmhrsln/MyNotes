import { Component, OnInit } from '@angular/core';
import { 
  ToastController, 
  LoadingController, 
  NavController 
} from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  currentDate;
  posts: any;

  constructor(

    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private navCtrl: NavController,
    
  ) {

    this.currentDate = new Date();

  }


  ionViewWillEnter() {
    this.getPosts();
  }

  async getPosts() {

      //show loader
      let loader = await this.loadingCtrl.create({
        message: "Please wait..."
       });
      loader.present();

      try{

        this.firestore
        .collection("posts")
        .snapshotChanges()
        .subscribe(data => {
          this.posts = data.map( e => {
            return {
              id: e.payload.doc.id,
              title: e.payload.doc.data()["title"],
              details: e.payload.doc.data()["details"]
            };
          });

          //dismiss loader
          loader.dismiss();
        });
      }catch(e) {
        this.showToast(e);

      }

  }

async deletePost(id: string){
       //show loader
       let loader = this.loadingCtrl.create({
        message: "Please wait..."
       });
      (await loader).present();

      await this.firestore.doc("posts/" + id).delete();

      //dismiss loader
      (await loader).dismiss();

}



  showToast(message: string) {
    this.toastCtrl
      .create({
        message: message,
        duration: 3000
    })
    .then(toastData => toastData.present());
  }

}
