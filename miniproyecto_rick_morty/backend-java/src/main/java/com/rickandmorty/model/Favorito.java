package com.rickandmorty.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favoritos")
public class Favorito {

    @Id
    private Integer id;

    @Column(nullable = false)
    private String nombre;

    private String estado;
    private String especie;
    private String genero;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String imagen;

    private String origen;

    @Column(name = "fecha_guardado")
    private LocalDateTime fechaGuardado = LocalDateTime.now();

    public Favorito() {}

    public Favorito(Integer id, String nombre, String estado, String especie, String genero, String imagen, String origen) {
        this.id = id;
        this.nombre = nombre;
        this.estado = estado;
        this.especie = especie;
        this.genero = genero;
        this.imagen = imagen;
        this.origen = origen;
        this.fechaGuardado = LocalDateTime.now();
    }

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getEspecie() { return especie; }
    public void setEspecie(String especie) { this.especie = especie; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public String getOrigen() { return origen; }
    public void setOrigen(String origen) { this.origen = origen; }

    public LocalDateTime getFechaGuardado() { return fechaGuardado; }
    public void setFechaGuardado(LocalDateTime fechaGuardado) { this.fechaGuardado = fechaGuardado; }
}
