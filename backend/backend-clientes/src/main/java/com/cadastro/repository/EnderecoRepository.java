package com.cadastro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cadastro.model.Endereco;

public interface EnderecoRepository extends JpaRepository<Endereco, Long> {
    // Esta interface irá prover automaticamente os métodos CRUD para a entidade Endereco
}