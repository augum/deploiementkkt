package bdom.kikwit.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity @Data @NoArgsConstructor @AllArgsConstructor @ToString
public class CartographieStructure {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long id_ess;
    private String distance_bdom;
    private String population_cible;
    private Long id_se;
    private boolean presence_blocop;
    private boolean capacite_transfusion;
    private String electricite;
    private String eau;
    private String reabilitation;
    private String forage;
    private String incinerateur;
    private String equipement_biom;
    @Transient
    private SourceEnergie sourceEnergie;
    @Transient
    private Etablissement etablissement;


}
