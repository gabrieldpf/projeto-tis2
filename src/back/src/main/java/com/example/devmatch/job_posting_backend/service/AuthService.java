package com.example.devmatch.job_posting_backend.service;

import com.example.devmatch.job_posting_backend.dto.AuthResponseDto;
import com.example.devmatch.job_posting_backend.dto.LoginRequestDto;
import com.example.devmatch.job_posting_backend.dto.RegisterRequestDto;
import com.example.devmatch.job_posting_backend.entity.Usuario;
import com.example.devmatch.job_posting_backend.repository.UsuarioRepository;
import com.example.devmatch.job_posting_backend.repository.PerfilDevRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Service responsável pela lógica de autenticação e registro de usuários
 * Gerencia login, cadastro e criptografia de senhas
 */
@Service
public class AuthService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PerfilDevRepository perfilDevRepository;
    
    // Encoder para criptografia de senhas usando BCrypt
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    /**
     * Realiza o login do usuário
     * @param loginRequest Dados de login (email, senha, tipo)
     * @return AuthResponseDto com os dados do usuário autenticado
     * @throws RuntimeException se credenciais inválidas
     */
    public AuthResponseDto login(LoginRequestDto loginRequest) {
        // Busca usuário pelo email
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginRequest.getEmail());
        
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("E-mail não cadastrado. Verifique o e-mail digitado ou crie uma conta.");
        }
        
        Usuario usuario = usuarioOpt.get();
        
        // Verifica se o tipo de usuário corresponde
        // Admin pode fazer login apenas com tipo "admin"
        if (!usuario.getTipo().equals(loginRequest.getTipo())) {
            String tipoEsperado;
            if (loginRequest.getTipo().equals("dev")) {
                tipoEsperado = "Desenvolvedor";
            } else if (loginRequest.getTipo().equals("empresa")) {
                tipoEsperado = "Empresa";
            } else {
                tipoEsperado = "Administrador";
            }
            
            String tipoAtual;
            if (usuario.getTipo().equals("dev")) {
                tipoAtual = "Desenvolvedor";
            } else if (usuario.getTipo().equals("empresa")) {
                tipoAtual = "Empresa";
            } else {
                tipoAtual = "Administrador";
            }
            
            throw new RuntimeException("Este e-mail está cadastrado como " + tipoAtual + ", mas você está tentando acessar como " + tipoEsperado + ".");
        }
        
        // Verifica se a senha está correta
        if (!passwordEncoder.matches(loginRequest.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("Senha incorreta. Verifique sua senha e tente novamente.");
        }
        
        // Verifica se o perfil está completo
        Boolean perfilCompleto = verificarPerfilCompleto(usuario);
        
        return AuthResponseDto.fromEntity(usuario, perfilCompleto);
    }
    
    /**
     * Registra um novo usuário no sistema
     * @param registerRequest Dados de registro (nome, email, senha, tipo)
     * @return AuthResponseDto com os dados do novo usuário
     * @throws RuntimeException se email já estiver em uso
     */
    public AuthResponseDto register(RegisterRequestDto registerRequest) {
        // Verifica se o email já está cadastrado
        if (usuarioRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado. Use outro e-mail ou faça login.");
        }
        
        // Valida o tipo de usuário
        if (!registerRequest.getTipo().equals("dev") && !registerRequest.getTipo().equals("empresa")) {
            throw new RuntimeException("Tipo de usuário inválido. Use 'dev' ou 'empresa'.");
        }
        
        // Cria nova instância de usuário
        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(registerRequest.getNome());
        novoUsuario.setEmail(registerRequest.getEmail());
        // Criptografa a senha antes de salvar
        novoUsuario.setSenha(passwordEncoder.encode(registerRequest.getSenha()));
        novoUsuario.setTipo(registerRequest.getTipo());
        novoUsuario.setDataCriacao(LocalDateTime.now());
        
        // Salva o usuário no banco de dados
        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);
        
        // Retorna os dados do usuário criado (perfil sempre incompleto no registro)
        return AuthResponseDto.fromEntity(usuarioSalvo, false);
    }
    
    /**
     * Busca um usuário pelo ID
     * @param id ID do usuário
     * @return AuthResponseDto com os dados do usuário
     * @throws RuntimeException se usuário não encontrado
     */
    public AuthResponseDto getUserById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Verifica se o perfil está completo
        Boolean perfilCompleto = verificarPerfilCompleto(usuario);
        
        return AuthResponseDto.fromEntity(usuario, perfilCompleto);
    }
    
    /**
     * Verifica se o perfil do usuário está completo
     * Para desenvolvedores: verifica se existe registro em perfis_dev e se o campo perfil_completo é true
     * Para empresas: sempre retorna true (por enquanto, até implementar perfil de empresa)
     * @param usuario Usuário a ser verificado
     * @return true se o perfil está completo, false caso contrário
     */
    private Boolean verificarPerfilCompleto(Usuario usuario) {
        if (usuario.getTipo().equals("dev")) {
            // Para desenvolvedores, verifica se existe perfil e se está marcado como completo
            return perfilDevRepository.findByUsuarioId(usuario.getId())
                .map(perfil -> perfil.getPerfilCompleto() != null && perfil.getPerfilCompleto())
                .orElse(false);
        } else {
            // Para empresas, por enquanto sempre retorna true
            // TODO: Implementar verificação de perfil de empresa quando necessário
            return true;
        }
    }
}

