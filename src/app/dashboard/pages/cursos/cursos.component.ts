import { Component, OnDestroy } from '@angular/core';
import { Curso } from './models';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CursosService } from './services/cursos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CursosAltasComponent } from './pages/cursos-altas/cursos-altas.component';
import { DeleteDialogComponent } from './pages/delete-dialog/delete-dialog.component';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Usuario } from 'src/app/core/models';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss'],
})
export class CursosComponent implements OnDestroy {
  dataSource = new MatTableDataSource<Curso>();

  destroyed$ = new Subject<void>();
  authUser$: Observable<Usuario | null>;

  aplicarFiltros(ev: Event): void {
    const inputValue = (ev.target as HTMLInputElement)?.value;
    this.dataSource.filter = inputValue?.trim()?.toLowerCase();
  }

  constructor(
    private matDialog: MatDialog,
    private cursosService: CursosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.authUser$ = this.authService.getAuthUser();
    this.cursosService.getCursos().subscribe((cursos) => {
      this.dataSource.data = cursos;
    });
  }

  abrirAltas(): void {
    const dialog = this.matDialog.open(CursosAltasComponent);
    dialog.disableClose = true;
    dialog.afterClosed().subscribe((valor) => {
      this.add(valor);
    });
  }

  abrirEdicion(curso: Curso) {
    const dialog = this.matDialog.open(CursosAltasComponent, {
      data: curso,
    });
    dialog.disableClose = true;
    dialog.afterClosed().subscribe((response) => {
      this.onModify(response);
    });
  }

  eliminarUsuario(curso: Curso) {
    const dialog = this.matDialog.open(DeleteDialogComponent, {
      data: curso,
    });
    dialog.disableClose = true;
    dialog.afterClosed().subscribe((valor) => {
      if (valor) {
        this.delete(curso);
      }
    });
  }

  add(curso: Curso) {
    if (curso.materia || curso.cupos || curso.grupos || curso.tutor) {
      curso = {
        ...curso,
        id: this.dataSource.data[this.dataSource.data.length - 1].id + 1,
      };
      this.cursosService.addCurso(curso).subscribe((newCurso) => newCurso);
      this.dataSource.data.push(curso);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
    }
  }

  delete(curso: Curso): void {
    this.cursosService.deleteCurso(curso.id).subscribe()
    this.dataSource.data.splice(this.dataSource.data.indexOf(curso), 1);
    this.dataSource = new MatTableDataSource(this.dataSource.data);
  }

  onModify(curso: Curso) {
    const index = this.dataSource.data.findIndex((cu) => {
      return cu.id === curso.id;
    });
    this.cursosService.updateCurso(curso, curso.id).subscribe((uMateria) => curso.id = uMateria.id);
    this.dataSource.data[index] = curso;
    this.dataSource = new MatTableDataSource(this.dataSource.data);
  }

  details(cursoId: number): void {
    this.router.navigate([cursoId], {
      relativeTo: this.activatedRoute,
    });
  }

  displayedColumns: string[] = [
    'id',
    'materia',
    'cupos',
    'grupos',
    'tutor',
    'accion',
  ];

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
