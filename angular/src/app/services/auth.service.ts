import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { utilisateur } from '../models/utilisateur';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';

interface ReponseInscrAuth {
    user : utilisateur,
    accessToken : string,
    refreshToken : string
}

@Injectable({
    providedIn: 'root'
})


export class AuthService {

    utilisateur : any = {};

    constructor(private httpClient : HttpClient){}

    connexion(utilisateur: Object): Observable<ReponseInscrAuth>{
        return this.httpClient.post<ReponseInscrAuth>('/api/v1/user/auth', utilisateur)
            .pipe(
                tap( response => {
                    this.utilisateur = response.user;
                    this.setToken('token', response.accessToken);
                    this.setToken('refreshToken', response.refreshToken);
                })
            );
    }

    private setToken(key: string, token: string): void {
        localStorage.setItem(key, token);
    }

    logout(): void{
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        this.utilisateur = null;
    }

    getUtilisateur(): any{
        let obj:any=jwtDecode(localStorage.getItem('token')!);
        this.utilisateur.id = obj.id;
        this.utilisateur.nom = obj.nom;
        this.chercherUtilisateur(obj?.id, this.utilisateur);
        return this.utilisateur;
    }

    chercherUtilisateur(id: any, user: any){
        this.httpClient.get('/api/v1/user/' + id).subscribe((response: any) => {
            if(response.mimeType!=""){
                var buffer = response.photo.data;
                var mimeType = "data:" + response.mimeType + ";base64";
                var binary = '';
                for (var i = 0; i < buffer.length; ++i) {
                    binary += String.fromCharCode(buffer[i]);
                }
                var base64 = btoa(binary);
                Object.defineProperty(user, "image", { value : mimeType + "," + base64 });
            } else {
                Object.defineProperty(user, "image", { value : "" } );
            }
            Object.defineProperty(user, "email", { value : response.email });
        })
    }

    refreshToken(): Observable<{accessToken: string}> {
        const refreshToken = localStorage.getItem('refreshToken');
        return this.httpClient.post<{accessToken: string}>(
          '/api/v1/user/refresh-token',{ refreshToken }).pipe(
            tap(response => {
              this.setToken('token', response.accessToken);
            })
        );
      }

}