package com.cadastro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cadastro.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    // Esta interface irá prover automaticamente os métodos CRUD para a entidade Cliente
}
