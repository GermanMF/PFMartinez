import { createReducer, on } from "@ngrx/store";
import { Usuario } from "src/app/core/models";
import { SetAuthUser, RemoveAuthUser } from "./auth.actions";

export const authFeatureKey = 'auth';

export interface AuthState {
  authUser: Usuario | null;
  token: string | null;
}

const initialState: AuthState = {
  authUser: null,
  token: localStorage.getItem('token') || null,
}

export const authReducer = createReducer(
  initialState,

  on(SetAuthUser, (currentState, { payload }) => {
    return {
      authUser: payload,
      token: payload.token,
    }
  }),


  on(RemoveAuthUser, (currentState) => {
    return {
      authUser: null,
      token: null
    }
  })
)
