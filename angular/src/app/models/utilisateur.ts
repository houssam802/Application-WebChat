export interface utilisateur {
    id : number;
    nom : string;
    image ?: any; 
    chat_infos ?: chat_infos;
    demandes_amies_envoyer ?: boolean; 
}

export class chat_infos {
    msg_non_lue?:number;
    der_msg?:string;
}