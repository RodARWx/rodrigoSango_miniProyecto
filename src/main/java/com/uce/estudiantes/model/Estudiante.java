package com.uce.estudiantes.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

/**
 * JPA Entity representing the 'estudiantes' table in the PostgreSQL database.
 * Includes indexes to accelerate searches and filters on large volumes of records.
 */
@Entity
@Table(name = "estudiantes", indexes = {
        @Index(name = "idx_estudiante_nombre", columnList = "nombre"),
        @Index(name = "idx_estudiante_curso", columnList = "curso")
})
public class Estudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, unique = true, length = 150)
    private String correo;

    @Column(nullable = false, length = 100)
    private String curso;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(length = 500)
    private String descripcion;

    // No-args constructor required by JPA
    public Estudiante() {
    }

    // Parameterized constructor
    public Estudiante(String nombre, String correo, String curso,
            String descripcion, String imageUrl) {
        this.nombre = nombre;
        this.correo = correo;
        this.curso = curso;
        this.descripcion = descripcion;
        this.imageUrl = imageUrl;
    }

    public Estudiante(Long id, String nombre, String correo, String curso,
            String descripcion, String imageUrl) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.curso = curso;
        this.descripcion = descripcion;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getCurso() {
        return curso;
    }

    public void setCurso(String curso) {
        this.curso = curso;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    @Override
    public String toString() {
        return "Estudiante{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", correo='" + correo + '\'' +
                ", curso='" + curso + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}
