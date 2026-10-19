package com.rickandmorty.controller;

import com.rickandmorty.model.Favorito;
import com.rickandmorty.repository.FavoritoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FavoritoController {

    @Autowired
    private FavoritoRepository favoritoRepository;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> res = new HashMap<>();
        res.put("status", "OK");
        res.put("backend", "Java Spring Boot");
        res.put("database", "PostgreSQL");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/favoritos")
    public ResponseEntity<Map<String, Object>> listarFavoritos() {
        List<Favorito> lista = favoritoRepository.findAllByOrderByFechaGuardadoDesc();
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("total", lista.size());
        res.put("motor", "PostgreSQL (Spring Data JPA)");
        res.put("data", lista);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/favoritos/check/{id}")
    public ResponseEntity<Map<String, Object>> verificarFavorito(@PathVariable Integer id) {
        boolean existe = favoritoRepository.existsById(id);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("esFavorito", existe);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/favoritos")
    public ResponseEntity<Map<String, Object>> agregarFavorito(@RequestBody Favorito favorito) {
        Favorito guardado = favoritoRepository.save(favorito);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("mensaje", "Personaje guardado en PostgreSQL.");
        res.put("data", guardado);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @DeleteMapping("/favoritos/{id}")
    public ResponseEntity<Map<String, Object>> eliminarFavorito(@PathVariable Integer id) {
        if (!favoritoRepository.existsById(id)) {
            Map<String, Object> res = new HashMap<>();
            res.put("success", false);
            res.put("mensaje", "El personaje no existe en favoritos.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
        }
        favoritoRepository.deleteById(id);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("mensaje", "Personaje eliminado de PostgreSQL.");
        res.put("id", id);
        return ResponseEntity.ok(res);
    }
}
