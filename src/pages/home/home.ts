import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject} from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Http  , ResponseOptions , Headers  , URLSearchParams } from '@angular/http';
import {SpeechRecognition} from '@ionic-native/speech-recognition'; 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public base64Image: string;
  constructor(private speech: SpeechRecognition, private camera: Camera, public navCtrl: NavController, private transfer:Transfer, private file: File, private http:Http) { }

  async takePicture(){
  this.camera.getPicture().then((imageData) => {
   let base64Image = 'data:image/jpeg;base64,' + imageData;

   console.log(base64Image);
   var currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
   var correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
   console.log('currentName' + currentName);
   console.log('correctPath' + correctPath);
   var options = {
                  fileKey: "file",
                  fileName: currentName,
                  chunkedMode: false,
                  mimeType: "multipart/form-data",
                  params : {'file': currentName}
                };
   var url = "http://10.171.171.95:8080/receipt-recognition/api/v1/recognition/image/hackathon";
   const fileTransfer: TransferObject = this.transfer.create();
   fileTransfer.upload(imageData, url, options).then(data => {
              console.log('response:' + JSON.stringify(data));
              //console.log(data.response.request_id);
            }, err => {
            console.log('uploading error');
            console.log(JSON.stringify(err));
            });
   console.log('uploading is done....');
}, (err) => {
   // Handle error
   console.log("there is an error");
  });
}


async speechIt():Promise<boolean> {
  
  const isAvailabel = await this.speech.isRecognitionAvailable();
  console.log(isAvailabel);
  return isAvailabel;
}



}
