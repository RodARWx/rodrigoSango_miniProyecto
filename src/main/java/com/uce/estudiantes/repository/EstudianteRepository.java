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
 * JPA Repository for CRUD operations and paginated queries on the Estudiante entity.
 */
@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {

    // Helper method to find a student by email
    Optional<Estudiante> findByCorreo(String correo);

    // Helper method to check student existence by email
    boolean existsByCorreo(String correo);

    // Query to list unique courses for dynamic filter options
    @Query("SELECT DISTINCT e.curso FROM Estudiante e WHERE e.curso IS NOT NULL AND TRIM(e.curso) != '' ORDER BY e.curso ASC")
    List<String> findDistinctCursos();

    // Paginated query with dynamic database-level filtering for high concurrency and large volumes
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

    // Server-side search suggestion query limited via Pageable
    @Query("SELECT e FROM Estudiante e WHERE " +
           "LOWER(e.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(e.correo) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(e.curso) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Estudiante> buscarSugerencias(@Param("termino") String termino, Pageable pageable);
}
