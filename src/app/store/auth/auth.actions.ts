import { createAction, props } from "@ngrx/store";
import { Usuario } from "src/app/core/models";

export const SetAuthUser = createAction(
  '[auth] Establecer usuario',
  props<{ payload: Usuario & { token: string } }>(),
);


export const RemoveAuthUser = createAction('[auth] Quitar usuario')
