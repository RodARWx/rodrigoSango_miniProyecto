package com.rickandmorty.repository;

import com.rickandmorty.model.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Integer> {
    List<Favorito> findAllByOrderByFechaGuardadoDesc();
}
