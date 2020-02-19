import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders, HttpHandler} from "@angular/common/http"
import { Observable } from "rxjs-compat"
import { GLOBAL } from "./global"


@Injectable()   
export class UserService{
    public url:string 
    public identity
    public token
    constructor(public http: HttpClient){
        this.url = GLOBAL.url    
    }

    //Metodo de servicio para realizar un login mediante un metodo post
    signup(user_to_login, getHash = null): Observable<any>{
        user_to_login.getHash = getHash
        const json = JSON.stringify(user_to_login); 
        let params = json 
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        return this.http.post(this.url+'login',json,{headers: headers}) 
         
    }

    register(user_to_register){
        const params = JSON.stringify(user_to_register)
         
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        return this.http.post(this.url+'register',params,{headers: headers}) 
         
    }

    updateUser(user_to_update){
        const params = JSON.stringify(user_to_update)
        let token = this.getToken()
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', token)
        
        return  this.http.put(this.url+'update-user/'+ user_to_update._id,params,{headers: headers})
    }
  
    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'))
        if(identity != "undefinded"){
            this.identity = identity
        }else{
            this.identity = null
        }

        return this.identity
    }
    getToken(){
        let token = localStorage.getItem('token')
        if(token != "undefinded"){
            this.token = token
        }else{
            this.token = null
        }
        return this.token
    }
}       