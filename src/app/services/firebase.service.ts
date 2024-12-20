import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { getFirestore, setDoc, doc, getDoc, addDoc, collection,collectionData,query } from '@angular/fire/firestore'
import { UtilsService } from './utils.service';
import {AngularFireStorage} from '@angular/fire/compat/storage'
import {getStorage,uploadString,ref,getDownloadURL} from 'firebase/storage'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilSvc = inject(UtilsService);
  storage=inject(AngularFireStorage);
  //autenticación

  getAuth() {
    return getAuth();
  }

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  //crear usuario
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  //actualizar usuario

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }


  //enviar correo para restablecimiento de contraseña
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);

  }

  //CERRAR SESIÓN
  singOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilSvc.routerLink('/auth');



  }



  /////////////////BASE DE DATOS////////////////////////////////

  //getCollecionData

  getCollectionData(path:string,collectionQuery?:any){
    const ref=collection(getFirestore(),path);
    return collectionData(query(ref,collectionQuery))
  }
  //enviar un documento
  setDocument(path: string, data: any) {

    return setDoc(doc(getFirestore(), path), data);

  }

  async getDocument(path: string) {

    return (await getDoc(doc(getFirestore(), path))).data();

  }


  addDocument(path: string, data: any) {

    return addDoc(collection(getFirestore(), path), data);

  }


  ////////////////////ALMACENAMIENTO///////////////////////

  //subir una imagen
 async uploadImage(path:string,dataUrl:string){

     return uploadString(ref(getStorage(),path),dataUrl,'data_url').then(()=>{
      return getDownloadURL(ref(getStorage(),path))
     })

  }

}
