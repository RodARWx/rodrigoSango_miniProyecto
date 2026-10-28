package com.uce.estudiantes.controller;

import com.uce.estudiantes.model.Estudiante;
import com.uce.estudiantes.repository.EstudianteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * RESTful controller for managing CRUD operations and paginated student queries.
 * Designed to support large volumes of data with server-side pagination, filtering, and comprehensive validation.
 */
@RestController
@RequestMapping("/api/estudiantes")
@CrossOrigin(origins = "*")
public class EstudianteController {

    private final EstudianteRepository estudianteRepository;

    public EstudianteController(EstudianteRepository estudianteRepository) {
        this.estudianteRepository = estudianteRepository;
    }

    /**
     * Comprehensively validates student fields for both creation (POST) and update (PUT).
     * Returns a map containing discovered validation errors per field.
     */
    private Map<String, String> validarDatosEstudiante(Estudiante estudiante, Long idExistente) {
        Map<String, String> errores = new LinkedHashMap<>();

        // 1. Validate full name
        if (estudiante.getNombre() == null || estudiante.getNombre().trim().isEmpty()) {
            errores.put("nombre", "El nombre completo es obligatorio.");
        } else {
            String nombre = estudiante.getNombre().trim();
            if (nombre.length() < 3) {
                errores.put("nombre", "El nombre debe contener al menos 3 caracteres.");
            } else if (nombre.length() > 100) {
                errores.put("nombre", "El nombre no puede superar los 100 caracteres.");
            } else if (!nombre.matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s]+$")) {
                errores.put("nombre", "El nombre solo puede contener letras y espacios (sin números ni símbolos).");
            }
        }

        // 2. Validate email address
        if (estudiante.getCorreo() == null || estudiante.getCorreo().trim().isEmpty()) {
            errores.put("correo", "El correo electrónico es obligatorio.");
        } else {
            String correo = estudiante.getCorreo().trim().toLowerCase();
            if (!correo.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")) {
                errores.put("correo", "El formato del correo no es válido (ejemplo: usuario@uce.edu.ec).");
            } else {
                // Check if email already belongs to another student record
                Optional<Estudiante> existente = estudianteRepository.findByCorreo(correo);
                if (existente.isPresent() && (idExistente == null || !existente.get().getId().equals(idExistente))) {
                    errores.put("correo", "El correo '" + correo + "' ya se encuentra registrado por otro estudiante.");
                }
            }
        }

        // 3. Validate course
        if (estudiante.getCurso() == null || estudiante.getCurso().trim().isEmpty()) {
            errores.put("curso", "El curso o paralelo es obligatorio.");
        } else {
            String curso = estudiante.getCurso().trim();
            if (curso.length() < 3) {
                errores.put("curso", "El curso debe tener al menos 3 caracteres.");
            } else if (curso.length() > 100) {
                errores.put("curso", "El curso no puede superar los 100 caracteres.");
            }
        }

        // 4. Validate description
        if (estudiante.getDescripcion() != null && estudiante.getDescripcion().trim().length() > 500) {
            errores.put("descripcion", "La descripción no puede exceder los 500 caracteres.");
        }

        // 5. Validate image URL if provided
        if (estudiante.getImageUrl() != null && !estudiante.getImageUrl().trim().isEmpty()) {
            String url = estudiante.getImageUrl().trim();
            if (url.length() > 500) {
                errores.put("imageUrl", "La URL de la imagen no puede superar los 500 caracteres.");
            } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
                errores.put("imageUrl", "La URL de la imagen debe comenzar con http:// o https://");
            }
        }

        return errores;
    }

    /**
     * GET /api/estudiantes
     * Returns a paginated and filtered list from the server.
     */
    @GetMapping
    public ResponseEntity<Page<Estudiante>> listarEstudiantes(
            @RequestParam(required = false) String buscar,
            @RequestParam(required = false) String curso,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "id,desc") String sort) {

        Sort.Direction direction = Sort.Direction.DESC;
        String property = "id";

        if (sort != null && sort.contains(",")) {
            String[] parts = sort.split(",");
            property = parts[0].trim();
            if (parts.length > 1 && parts[1].trim().equalsIgnoreCase("asc")) {
                direction = Sort.Direction.ASC;
            }
        }

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(direction, property));
        Page<Estudiante> resultado = estudianteRepository.buscarConFiltros(buscar, curso, pageable);
        return ResponseEntity.ok(resultado);
    }

    /**
     * GET /api/estudiantes/todos
     * Returns all students without pagination (for autocomplete caches and backups).
     */
    @GetMapping("/todos")
    public ResponseEntity<List<Estudiante>> listarTodos() {
        return ResponseEntity.ok(estudianteRepository.findAll());
    }

    /**
     * GET /api/estudiantes/cursos
     * Returns the distinct list of courses to populate dynamic filter dropdowns.
     */
    @GetMapping("/cursos")
    public ResponseEntity<List<String>> listarCursos() {
        return ResponseEntity.ok(estudianteRepository.findDistinctCursos());
    }

    /**
     * GET /api/estudiantes/sugerencias?q=...
     * Returns up to 5 fast autocomplete suggestions from the server.
     */
    @GetMapping("/sugerencias")
    public ResponseEntity<List<Estudiante>> obtenerSugerencias(@RequestParam(defaultValue = "") String q) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        Pageable top5 = PageRequest.of(0, 5);
        return ResponseEntity.ok(estudianteRepository.buscarSugerencias(q.trim(), top5));
    }

    /**
     * GET /api/estudiantes/{id}
     * Returns a specific student by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Estudiante> obtenerEstudiantePorId(@PathVariable Long id) {
        return estudianteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/estudiantes
     * Registers a new student after thorough input validation.
     */
    @PostMapping
    public ResponseEntity<?> registrarEstudiante(@RequestBody Estudiante estudiante) {
        Map<String, String> errores = validarDatosEstudiante(estudiante, null);
        if (!errores.isEmpty()) {
            return ResponseEntity.badRequest().body(errores);
        }

        // Sanitize and save
        estudiante.setNombre(estudiante.getNombre().trim());
        estudiante.setCorreo(estudiante.getCorreo().trim().toLowerCase());
        estudiante.setCurso(estudiante.getCurso().trim());
        if (estudiante.getDescripcion() != null) {
            estudiante.setDescripcion(estudiante.getDescripcion().trim());
        }
        if (estudiante.getImageUrl() != null) {
            estudiante.setImageUrl(estudiante.getImageUrl().trim());
        }

        Estudiante nuevoEstudiante = estudianteRepository.save(estudiante);
        return new ResponseEntity<>(nuevoEstudiante, HttpStatus.CREATED);
    }

    /**
     * PUT /api/estudiantes/{id}
     * Updates an existing student after thorough input validation.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarEstudiante(
            @PathVariable Long id,
            @RequestBody Estudiante detallesEstudiante) {

        return estudianteRepository.findById(id)
                .map(estudianteExistente -> {
                    Map<String, String> errores = validarDatosEstudiante(detallesEstudiante, id);
                    if (!errores.isEmpty()) {
                        return ResponseEntity.badRequest().body((Object) errores);
                    }

                    estudianteExistente.setNombre(detallesEstudiante.getNombre().trim());
                    estudianteExistente.setCorreo(detallesEstudiante.getCorreo().trim().toLowerCase());
                    estudianteExistente.setCurso(detallesEstudiante.getCurso().trim());

                    if (detallesEstudiante.getDescripcion() != null) {
                        estudianteExistente.setDescripcion(detallesEstudiante.getDescripcion().trim());
                    } else {
                        estudianteExistente.setDescripcion(null);
                    }

                    if (detallesEstudiante.getImageUrl() != null) {
                        estudianteExistente.setImageUrl(detallesEstudiante.getImageUrl().trim());
                    } else {
                        estudianteExistente.setImageUrl(null);
                    }

                    Estudiante actualizado = estudianteRepository.save(estudianteExistente);
                    return ResponseEntity.ok((Object) actualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/estudiantes/{id}
     * Deletes a student by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEstudiante(@PathVariable Long id) {
        if (!estudianteRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        estudianteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/estudiantes/health
     * Health probe endpoint for Application Load Balancers and container orchestrators.
     * Validates database connectivity and exposes instance metadata for load distribution verification.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new LinkedHashMap<>();
        health.put("status", "UP");
        health.put("timestamp", java.time.Instant.now().toString());
        health.put("service", "estudiantes-api");

        try {
            long totalStudents = estudianteRepository.count();
            health.put("database", "CONNECTED");
            health.put("totalRecords", totalStudents);
        } catch (Exception e) {
            health.put("database", "DOWN");
            health.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(health);
        }

        try {
            health.put("instanceHost", java.net.InetAddress.getLocalHost().getHostName());
        } catch (Exception ignored) {
            health.put("instanceHost", "unknown");
        }

        return ResponseEntity.ok(health);
    }
}
