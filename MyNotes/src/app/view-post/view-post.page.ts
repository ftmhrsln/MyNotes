import { Component, OnInit } from '@angular/core';
import { Post } from "../models/post.model";
import { ActivatedRoute } from "@angular/router"
import { 
  ToastController, 
  LoadingController, 
  NavController 
} from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.page.html',
  styleUrls: ['./view-post.page.scss'],
})
export class ViewPostPage implements OnInit {
  post = {} as Post;
  id: any;
  currentDate;

  constructor(
    private actRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {
    this.id = this.actRoute.snapshot.paramMap.get("id");
    this.currentDate = new Date();
   }

  ngOnInit() {
    this.getPostsById(this.id);
  }

  async getPostsById(id: string) {
    //show loader
    let loader = this.loadingCtrl.create({
    message: "Please wait..."
    });
    (await loader).present();

   this.firestore.doc("posts/" + id)
   .valueChanges()
   .subscribe(data => {
    this.post.title = data["title"];
    this.post.details = data["details"];
   });

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
