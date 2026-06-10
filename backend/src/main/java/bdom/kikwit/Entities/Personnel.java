package bdom.kikwit.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity @Data @NoArgsConstructor @AllArgsConstructor @ToString
public class Personnel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long id_ess;
    private int nb_agent_matricule;
    private int nb_agent_nu;
    private int nb_nv_agent_matricule;
    private int nb_nv_agent_salaireEtat;
    private int nb_nv_agent_primeEtat;
    private int nb_agent_primeLocale;
    @Transient
    private Etablissement etablissement;

}
