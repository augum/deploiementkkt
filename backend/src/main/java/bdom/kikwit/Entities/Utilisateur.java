package bdom.kikwit.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Entity @Data @AllArgsConstructor @NoArgsConstructor @ToString
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String postnom;
    private String prenom;
    private String login;
    private String password;
    private Long id_role;
    private Long id_ess;
    private String email;
    @Transient
    private Role role;
    @Transient
    private Etablissement etablissement;
}