import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
// import { userInfo } from 'os';

export interface UserDetails {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  gender: string;
  password: string;
  UserType: string;
  phone: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  gender: string;
  password: string;
  UserType: string;
  phone: string;
}

@Injectable()
export class AuthenticationService {
  private token: string;
  baseUrl = "http://localhost:3000";

  constructor(private http: HttpClient, private router: Router) {}
  private saveToken(token: string): void {
    localStorage.setItem("usertoken", token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem("usertoken");
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split(".")[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  IsAdmin(): number {
    const user = this.getUserDetails();

    if (user) {
      return user.UserType === "admin" ? 1 : 7; // si es admin regresa 1 , si no 7
    } else {
      return 0;
    }
  }

  IsCliente(): number {
    const user = this.getUserDetails();
    if (user) {
      return user.UserType == "cliente" ? 2 : 7; // si es cliente regresa 2 , si no 7
    } else {
      return 0;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  // LOGIN
  public login(user: TokenPayload): Observable<any> {
    const base = this.http.post(this.baseUrl + `/api/user/login`, user);

    console.log(base);
    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        console.log(data);
        return data;
      })
    );

    return request;
  }

  // SALIR
  public logout(): void {
    this.token = "";
    window.localStorage.removeItem("usertoken");
    this.router.navigateByUrl("/");
  }


}
