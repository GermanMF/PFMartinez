import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, map, catchError, throwError } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "src/environment/environment";
import { Usuario } from "../../models";
import { createAction, Store } from "@ngrx/store";
import { AppState } from "src/app/store";
import { selectAuthUser } from "src/app/store/auth/auth.selectors";
import { SetAuthUser, RemoveAuthUser } from "src/app/store/auth/auth.actions";

export interface LoginFormValue {
  email: string;
  password: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private authUser$ = new BehaviorSubject<Usuario | any>(null);

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private store: Store<AppState>
  ) {
    this.httpClient
      .get<Usuario[]>(`${environment.apiBaseUrl}/usuarios`)
      .subscribe({
        next: (users) => {
          localStorage.setItem("role", users[0].role);
        },
      });
  }

  setAuthUser(usuario: Usuario, token: string): void {
    this.store.dispatch(SetAuthUser({ payload: { ...usuario, token } }));
  }

  getAuthUser(): Observable<Usuario | null> {
    return this.store.select(selectAuthUser);
  }

  login(formValue: LoginFormValue): void {
    this.httpClient
      .get<Usuario[]>(`${environment.apiBaseUrl}/usuarios`, {
        params: {
          ...formValue,
        },
      })
      .subscribe({
        next: (users) => {
          const loggedUser = users[0];
          if (loggedUser) {
            localStorage.setItem("token", loggedUser.token);
            // this.authUser$.next(loggedUser);
            this.setAuthUser(loggedUser, loggedUser.token);
            this.router.navigate(["dashboard"]);
          } else {
            alert("Usuario y/o contraseña incorrecta");
          }
        },
      });
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // this.authUser$.next(null);
    this.store.dispatch(RemoveAuthUser());
    this.router.navigate(["auth"]);
  }

  verifyToken(): Observable<boolean> {
    const token = localStorage.getItem("token");
    return this.httpClient
      .get<Usuario[]>(`${environment.apiBaseUrl}/usuarios?token=${token}`, {
        headers: new HttpHeaders({
          Authorization: token || "",
        }),
      })
      .pipe(
        map((users) => {
          const loggedUser = users[0];
          if (loggedUser) {
            localStorage.setItem("token", loggedUser.token);
            this.authUser$.next(loggedUser);
          }
          return !!loggedUser;
        }),
        catchError((err) => {
          alert("Error al verificar el token");
          return throwError(() => err);
        })
      );
  }
}
