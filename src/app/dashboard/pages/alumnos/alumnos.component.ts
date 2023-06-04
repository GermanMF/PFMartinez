import { Component } from '@angular/core';
import { Alumno } from './models';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AlumnosService } from './services/alumnos.service';
import { AlumnosAltasComponent } from './pages/alumnos-altas/alumnos-altas.component';
import { DeleteDialogComponent } from './pages/delete-dialog/delete-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Usuario } from 'src/app/core/models';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.scss'],
})
export class AlumnosComponent {
  dataSource = new MatTableDataSource<Alumno>();

  destroyed$ = new Subject<void>();
  authUser$: Observable<Usuario | null>;

  aplicarFiltros(ev: Event): void {
    const inputValue = (ev.target as HTMLInputElement)?.value;
    this.dataSource.filter = inputValue?.trim()?.toLowerCase();
  }

  constructor(
    private matDialog: MatDialog,
    private alumnosService: AlumnosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.authUser$ = this.authService.getAuthUser();
    this.alumnosService.getAlumnos().subscribe((alumnos) => {
      this.dataSource.data = alumnos;
    });
  }

  abrirAltas(): void {
    const dialog = this.matDialog.open(AlumnosAltasComponent);
    dialog.disableClose = true;
    dialog.afterClosed().subscribe((valor) => {
      this.add(valor);
    });
  }

  abrirEdicion(alumno: Alumno) {
    const dialog = this.matDialog.open(AlumnosAltasComponent, {
      data: alumno,
    });
    dialog.disableClose = true;
    dialog.afterClosed().subscribe((valor) => {
      this.modify(valor);
    });
  }

  eliminarUsuario(alumno: Alumno) {
    const dialog = this.matDialog.open(DeleteDialogComponent, {
      data: alumno,
    });
    dialog.disableClose = true;
    dialog.afterClosed().subscribe((valor) => {
      if (valor) {
        this.delete(alumno);
      }
    });
  }

  add(alumno: Alumno) {
    if (alumno.firstName || alumno.lastName || alumno.online) {
      alumno = {
        ...alumno,
        id: this.dataSource.data[this.dataSource.data.length - 1].id + 1,
      };
      this.alumnosService
        .addAlumnos(alumno)
        .subscribe((newAlumno) => newAlumno);
      this.dataSource.data.push(alumno);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
    }
  }

  delete(alumno: Alumno): void {
    this.alumnosService.deleteAlumnos(alumno.id).subscribe();
    this.dataSource.data.splice(this.dataSource.data.indexOf(alumno), 1);
    this.dataSource = new MatTableDataSource(this.dataSource.data);
  }

  modify(alumno: Alumno) { 
    const index = this.dataSource.data.findIndex((alumnoI) => {
      return alumnoI.id === alumno.id;
    });
    this.alumnosService
        .updateAlumnos(alumno, alumno.id)
        .subscribe((uAlumno) => alumno.id = uAlumno.id);
    this.dataSource.data[index] = alumno;
    this.dataSource = new MatTableDataSource(this.dataSource.data);
  }

  details(alumnoId: number): void {
    this.router.navigate([alumnoId], {
      relativeTo: this.activatedRoute,
    });
  }

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'update',
    'materias',
    'online',
    'accion',
  ];

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
