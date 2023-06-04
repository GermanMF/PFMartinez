import { createFeature, createReducer, on } from '@ngrx/store';
import { AlumnosActions } from './alumnos.actions';

export const alumnosFeatureKey = 'alumnos';

export interface State {

}

export const initialState: State = {

};

export const reducer = createReducer(
  initialState,
  on(AlumnosActions.loadAlumnoss, state => state),

);

export const alumnosFeature = createFeature({
  name: alumnosFeatureKey,
  reducer,
});

