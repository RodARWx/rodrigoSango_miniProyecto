package com.uce.estudiantes.repository;

import com.uce.estudiantes.model.Estudiante;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA para operaciones CRUD y consultas paginadas sobre la entidad Estudiante.
 */
@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {

    // Método auxiliar para buscar un estudiante por correo electrónico
    Optional<Estudiante> findByCorreo(String correo);

    // Método auxiliar para verificar existencia por correo electrónico
    boolean existsByCorreo(String correo);

    // Consulta para listar los cursos únicos para filtros dinámicos
    @Query("SELECT DISTINCT e.curso FROM Estudiante e WHERE e.curso IS NOT NULL AND TRIM(e.curso) != '' ORDER BY e.curso ASC")
    List<String> findDistinctCursos();

    // Consulta paginada con filtrado dinámico en base de datos para alta concurrencia y grandes volúmenes
    @Query("SELECT e FROM Estudiante e WHERE " +
           "(:termino IS NULL OR :termino = '' OR " +
           " LOWER(e.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           " LOWER(e.correo) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           " LOWER(e.curso) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           " LOWER(e.descripcion) LIKE LOWER(CONCAT('%', :termino, '%'))) AND " +
           "(:curso IS NULL OR :curso = '' OR e.curso = :curso)")
    Page<Estudiante> buscarConFiltros(@Param("termino") String termino,
                                      @Param("curso") String curso,
                                      Pageable pageable);

    // Búsqueda de sugerencias en servidor con límite mediante Pageable
    @Query("SELECT e FROM Estudiante e WHERE " +
           "LOWER(e.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(e.correo) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(e.curso) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Estudiante> buscarSugerencias(@Param("termino") String termino, Pageable pageable);
}
