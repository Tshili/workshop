import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgForm} from '@angular/forms';
import * as SockJS from 'sockjs-client';
import * as $ from 'jquery';
import * as Stomp from 'stompjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  rForm:FormGroup;
  post : any;
  description:string = '';
  name:string = '';
  
  infos : {
    firstName:string,
    lastName:string,
    nationality:string,
    bithdate:Date,
    actualCountry:string,
    addressNumber:number,
    addressStreet:string,
    postalCode:number,
    city:string,
    country:string,
    phoneNumber:number,
    email:string
  }

  private serverUrl = 'http://localhost:8181/websocket-backend/socket'
  private title = 'WebSockets chat';
  private stompClient;
  public notifications = 1;

  constructor(private fb :FormBuilder){
    this.rForm = fb.group({
    'name': [null, Validators.required],
    'description' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
    'validate' : ''
  });
  this.initializeWebSocketConnection();
}

addPost(f: NgForm){
  console.log("je suis le message");
  console.log(f.value);
  
  this.stompClient.send("/app/send/message" , {}, this.notifications ++);
      console.log("je suis le send message");
      
      console.log("jajoute une notification");
      console.log(this.notifications);
      $('#input').val('');
  }

initializeWebSocketConnection(){
  let ws = new SockJS(this.serverUrl);
  this.stompClient = Stomp.over(ws);
  let that = this;
  this.stompClient.connect({}, function(frame) {
    that.stompClient.subscribe("/chat", (message) => {
      if(message.body) {
        $(".chat").append("<div class='message'>"+message.body+"</div>");
        console.log("je suis le message body");
        console.log(message.body);
      }
    });
  });
}

sendMessage(infos){
  this.stompClient.send("/app/send/message" , {}, this.notifications ++);
  console.log("Je suis le message envoyé");
  console.log(infos);
  console.log("J'ajoute une notification");
  console.log(this.notifications);
  $('#input').val('');
}







}
