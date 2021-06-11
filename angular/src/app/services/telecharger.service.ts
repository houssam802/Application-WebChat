import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class TelechargerService {
    constructor(private httpClient: HttpClient){}

    telechargerFichier(nomFichier: String): Observable<any>{
        return this.httpClient.post('/api/v1/user/telecharger', { nomFichier }).pipe(
            switchMap((response: any) => {
                if(response.mimeType){
                    var buffer = response.file.data;
                    var mimeType = "data:" + response.mimeType + ";base64";
                    var binary = '';
                    for (var i = 0; i < buffer.length; ++i) {
                        binary += String.fromCharCode(buffer[i]);
                    }
                    var base64 = btoa(binary);
                    response = mimeType + "," + base64;
                }
                return of(response);
            })
        )
    }
}